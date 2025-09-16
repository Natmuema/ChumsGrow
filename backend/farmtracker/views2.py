from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from decimal import Decimal

from .models import (
    Farmer, Produce, Transaction, CarbonCredit, ConsumerVerification
)
from .serializers import (
    FarmerSerializer, ProduceSerializer, TrackingPointSerializer,
    TransactionSerializer, ConsumerVerificationSerializer,
    DashboardStatsSerializer, VerificationRequestSerializer
)
from .blockchain import HederaIntegration
from .mpesa import PaymentProcessor


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for transaction management"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()
        
        if transaction.payment_method == 'mpesa':
            self._process_mpesa_payment(transaction)
        
        if transaction.quantity_sold >= transaction.produce.quantity:
            transaction.produce.status = 'sold'
            transaction.produce.save()
        
        return Response(
            TransactionSerializer(transaction).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        """Process payment for transaction"""
        transaction = self.get_object()
        
        if transaction.payment_status == 'completed':
            return Response(
                {'error': 'Payment already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if transaction.payment_method == 'mpesa':
            result = self._process_mpesa_payment(transaction)
        else:
            result = {'success': False, 'error': 'Payment method not supported'}
        
        if result['success']:
            transaction.payment_status = 'completed'
            transaction.payment_date = timezone.now()
            transaction.mpesa_transaction_id = result.get('mpesa_transaction_id')
            transaction.save()
            
            if transaction.produce.eco_score >= 75:
                self._award_carbon_credits(transaction)
            
            return Response({
                'success': True,
                'message': 'Payment processed successfully',
                'transaction_id': result.get('mpesa_transaction_id'),
                'amount_paid': str(transaction.final_amount)
            })
        else:
            return Response(
                {'error': result.get('error', 'Payment processing failed')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _process_mpesa_payment(self, transaction):
        """Process M-Pesa payment"""
        processor = PaymentProcessor()
        
        payment_data = {
            'transaction_id': str(transaction.transaction_id),
            'total_amount': float(transaction.total_amount),
            'fair_trade_premium': float(transaction.fair_trade_premium),
            'carbon_credit_bonus': float(transaction.carbon_credit_bonus),
            'mpesa_number': transaction.farmer.mpesa_number,
            'farmer_name': transaction.farmer.farm_name,
            'produce_id': str(transaction.produce.produce_id)
        }
        
        hedera = HederaIntegration()
        blockchain_result = hedera.execute_payment_smart_contract({
            'smart_contract_id': transaction.produce.smart_contract_id,
            'farmer_hedera_account': transaction.farmer.hedera_account_id,
            **payment_data
        })
        
        if blockchain_result['success']:
            transaction.smart_contract_executed = True
            transaction.blockchain_transaction_hash = blockchain_result['transaction_hash']
            transaction.hedera_consensus_timestamp = blockchain_result['consensus_timestamp']
            transaction.save()
        
        return processor.process_farmer_payment(payment_data)
    
    def _award_carbon_credits(self, transaction):
        """Award carbon credits for eco-friendly produce"""
        credits_earned = Decimal('1.0') * (transaction.produce.eco_score / 100)
        
        carbon_credit = CarbonCredit.objects.create(
            farmer=transaction.farmer,
            credits_earned=credits_earned,
            credit_type='organic_farming',
            verification_status='verified',
            verification_date=timezone.now(),
            credit_value_usd=credits_earned * Decimal('10.0')
        )
        
        hedera = HederaIntegration()
        nft_result = hedera.issue_carbon_credits(
            str(transaction.farmer.farmer_id),
            {
                'credit_type': 'organic_farming',
                'credits': float(credits_earned)
            }
        )
        
        if nft_result['success']:
            carbon_credit.nft_token_id = nft_result['nft_token_id']
            carbon_credit.blockchain_certificate_hash = nft_result['blockchain_certificate_hash']
            carbon_credit.save()
            
            transaction.farmer.carbon_credits_earned += credits_earned
            transaction.farmer.save()


class ConsumerVerificationView(generics.CreateAPIView):
    """View for consumer verification of produce authenticity"""
    serializer_class = VerificationRequestSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        produce_id = serializer.validated_data['produce_id']
        produce = get_object_or_404(Produce, produce_id=produce_id)
        
        hedera = HederaIntegration()
        verification_result = hedera.verify_produce_authenticity(
            str(produce_id),
            serializer.validated_data
        )
        
        if verification_result['success']:
            verification = ConsumerVerification.objects.create(
                produce=produce,
                consumer_name=serializer.validated_data.get('consumer_name', ''),
                consumer_email=serializer.validated_data.get('consumer_email', ''),
                consumer_phone=serializer.validated_data.get('consumer_phone', ''),
                verification_method=serializer.validated_data['verification_method'],
                verification_status='authentic' if verification_result['authentic'] else 'suspicious',
                verification_location=serializer.validated_data.get('location', ''),
                gps_coordinates=serializer.validated_data.get('gps_coordinates', '')
            )
            
            if hasattr(produce, 'qr_code'):
                produce.qr_code.scan_count += 1
                produce.qr_code.last_scanned = timezone.now()
                produce.qr_code.save()
            
            response_data = {
                'success': True,
                'authentic': verification_result['authentic'],
                'verification_id': str(verification.verification_id),
                'produce': ProduceSerializer(produce).data,
                'farmer': FarmerSerializer(produce.farmer).data,
                'journey': TrackingPointSerializer(
                    produce.tracking_points.order_by('timestamp'),
                    many=True
                ).data,
                'blockchain_proof': verification_result.get('verification_proof'),
                'message': 'Product verified successfully' if verification_result['authentic'] 
                          else 'Product verification suspicious'
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Verification failed', 'details': verification_result.get('error')},
                status=status.HTTP_400_BAD_REQUEST
            )


class DashboardStatsView(generics.GenericAPIView):
    """View for dashboard statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        stats = {
            'total_farmers': Farmer.objects.filter(is_active=True).count(),
            'total_produce': Produce.objects.count(),
            'total_transactions': Transaction.objects.filter(payment_status='completed').count(),
            'total_revenue': Transaction.objects.filter(
                payment_status='completed'
            ).aggregate(Sum('final_amount'))['final_amount__sum'] or 0,
            'carbon_credits_issued': CarbonCredit.objects.filter(
                verification_status='verified'
            ).aggregate(Sum('credits_earned'))['credits_earned__sum'] or 0,
            'active_shipments': Produce.objects.filter(status='in_transit').count(),
            'verified_produce': ConsumerVerification.objects.filter(
                verification_status='authentic'
            ).values('produce').distinct().count(),
            'eco_friendly_percentage': self._calculate_eco_percentage()
        }
        
        serializer = DashboardStatsSerializer(data=stats)
        serializer.is_valid()
        
        return Response(serializer.data)
    
    def _calculate_eco_percentage(self):
        total = Produce.objects.count()
        if total == 0:
            return 0.0
        
        eco_friendly = Produce.objects.filter(
            Q(organic_certified=True) | Q(pesticide_free=True) | 
            Q(water_efficient=True) | Q(carbon_neutral=True)
        ).count()
        
        return (eco_friendly / total) * 100