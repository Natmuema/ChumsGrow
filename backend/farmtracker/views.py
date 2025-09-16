from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from datetime import datetime, timedelta
import qrcode
import io
import base64
from decimal import Decimal

from .models import (
    Farmer, ProduceCategory, Produce, TrackingPoint,
    Transaction, CarbonCredit, QRCode, ConsumerVerification
)
from .serializers import (
    FarmerSerializer, FarmerRegistrationSerializer,
    ProduceCategorySerializer, ProduceSerializer,
    TrackingPointSerializer, TransactionSerializer,
    CarbonCreditSerializer, QRCodeSerializer,
    ConsumerVerificationSerializer, ProduceTrackingSerializer,
    DashboardStatsSerializer, PaymentRequestSerializer,
    VerificationRequestSerializer
)
from .blockchain import HederaIntegration, SmartContractTemplates
from .mpesa import MPesaIntegration, PaymentProcessor


class FarmerViewSet(viewsets.ModelViewSet):
    """ViewSet for farmer management"""
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        certification = self.request.query_params.get('certification')
        if certification:
            queryset = queryset.filter(certification_status=certification)
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset
    
    @action(detail=True, methods=['post'])
    def create_blockchain_account(self, request, pk=None):
        """Create Hedera blockchain account for farmer"""
        farmer = self.get_object()
        
        if farmer.hedera_account_id:
            return Response(
                {'error': 'Farmer already has a blockchain account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        hedera = HederaIntegration()
        result = hedera.create_farmer_account({
            'farmer_id': str(farmer.farmer_id),
            'farm_name': farmer.farm_name
        })
        
        if result['success']:
            farmer.hedera_account_id = result['account_id']
            farmer.wallet_address = result['public_key']
            farmer.save()
            
            return Response({
                'success': True,
                'account_id': result['account_id'],
                'message': 'Blockchain account created successfully'
            })
        else:
            return Response(
                {'error': result.get('error', 'Failed to create blockchain account')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def earnings(self, request, pk=None):
        """Get farmer's earnings summary"""
        farmer = self.get_object()
        transactions = farmer.transactions.filter(payment_status='completed')
        
        earnings = {
            'total_earnings': transactions.aggregate(Sum('final_amount'))['final_amount__sum'] or 0,
            'fair_trade_premiums': transactions.aggregate(Sum('fair_trade_premium'))['fair_trade_premium__sum'] or 0,
            'carbon_bonuses': transactions.aggregate(Sum('carbon_credit_bonus'))['carbon_credit_bonus__sum'] or 0,
            'transaction_count': transactions.count(),
            'average_per_transaction': transactions.aggregate(Avg('final_amount'))['final_amount__avg'] or 0,
            'recent_transactions': TransactionSerializer(
                transactions.order_by('-transaction_date')[:5],
                many=True
            ).data
        }
        
        return Response(earnings)
    
    @action(detail=True, methods=['get'])
    def carbon_credits(self, request, pk=None):
        """Get farmer's carbon credits"""
        farmer = self.get_object()
        credits = farmer.carbon_credits.all()
        
        summary = {
            'total_credits_earned': farmer.carbon_credits_earned,
            'verified_credits': credits.filter(verification_status='verified').aggregate(
                Sum('credits_earned')
            )['credits_earned__sum'] or 0,
            'pending_credits': credits.filter(verification_status='pending').aggregate(
                Sum('credits_earned')
            )['credits_earned__sum'] or 0,
            'credit_value_usd': credits.aggregate(Sum('credit_value_usd'))['credit_value_usd__sum'] or 0,
            'credits': CarbonCreditSerializer(credits, many=True).data
        }
        
        return Response(summary)


class FarmerRegistrationView(generics.CreateAPIView):
    """View for farmer registration"""
    serializer_class = FarmerRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        farmer = serializer.save()
        
        hedera = HederaIntegration()
        blockchain_result = hedera.create_farmer_account({
            'farmer_id': str(farmer.farmer_id),
            'farm_name': farmer.farm_name
        })
        
        if blockchain_result['success']:
            farmer.hedera_account_id = blockchain_result['account_id']
            farmer.wallet_address = blockchain_result['public_key']
            farmer.save()
        
        return Response({
            'success': True,
            'farmer': FarmerSerializer(farmer).data,
            'blockchain_account': blockchain_result.get('account_id'),
            'message': 'Farmer registered successfully'
        }, status=status.HTTP_201_CREATED)


class ProduceCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for produce categories"""
    queryset = ProduceCategory.objects.all()
    serializer_class = ProduceCategorySerializer
    permission_classes = [IsAuthenticated]


class ProduceViewSet(viewsets.ModelViewSet):
    """ViewSet for produce management"""
    queryset = Produce.objects.all()
    serializer_class = ProduceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        farmer_id = self.request.query_params.get('farmer_id')
        if farmer_id:
            queryset = queryset.filter(farmer__farmer_id=farmer_id)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        quality = self.request.query_params.get('quality')
        if quality:
            queryset = queryset.filter(quality_grade=quality)
        organic = self.request.query_params.get('organic')
        if organic is not None:
            queryset = queryset.filter(organic_certified=organic.lower() == 'true')
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        produce = serializer.save()
        
        hedera = HederaIntegration()
        blockchain_result = hedera.register_produce_on_chain({
            'produce_id': str(produce.produce_id),
            'farmer_id': str(produce.farmer.farmer_id),
            'name': produce.name,
            'quantity': float(produce.quantity),
            'quality_grade': produce.quality_grade,
            'organic_certified': produce.organic_certified,
            'harvest_date': produce.harvest_date.isoformat()
        })
        
        if blockchain_result['success']:
            produce.blockchain_hash = blockchain_result['blockchain_hash']
            produce.smart_contract_id = blockchain_result['smart_contract_id']
            produce.save()
            
            qr_data = self._generate_qr_code_data(produce)
            QRCode.objects.create(
                produce=produce,
                qr_data=qr_data,
                qr_image_url=self._create_qr_image(qr_data)
            )
        
        return Response(
            ProduceSerializer(produce).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def add_tracking_point(self, request, pk=None):
        """Add a tracking point to produce journey"""
        produce = self.get_object()
        
        tracking_data = request.data.copy()
        tracking_data['produce'] = produce.id
        
        serializer = TrackingPointSerializer(data=tracking_data)
        serializer.is_valid(raise_exception=True)
        tracking_point = serializer.save()
        
        location_type = tracking_data.get('location_type')
        if location_type == 'market':
            produce.status = 'at_market'
        elif location_type == 'transport':
            produce.status = 'in_transit'
        produce.save()
        
        hedera = HederaIntegration()
        blockchain_result = hedera.add_tracking_point({
            'produce_id': str(produce.produce_id),
            'tracking_id': str(tracking_point.tracking_id),
            'location_name': tracking_point.location_name,
            'location_type': tracking_point.location_type,
            'temperature': float(tracking_point.temperature) if tracking_point.temperature else None,
            'humidity': float(tracking_point.humidity) if tracking_point.humidity else None
        })
        
        if blockchain_result['success']:
            tracking_point.verification_hash = blockchain_result['verification_hash']
            tracking_point.verified = True
            tracking_point.save()
        
        return Response(TrackingPointSerializer(tracking_point).data)
    
    @action(detail=True, methods=['get'])
    def tracking_history(self, request, pk=None):
        """Get complete tracking history for produce"""
        produce = self.get_object()
        
        data = {
            'produce': ProduceSerializer(produce).data,
            'tracking_points': TrackingPointSerializer(
                produce.tracking_points.order_by('timestamp'),
                many=True
            ).data,
            'farmer': FarmerSerializer(produce.farmer).data,
            'qr_code': QRCodeSerializer(
                getattr(produce, 'qr_code', None)
            ).data if hasattr(produce, 'qr_code') else None,
            'transactions': TransactionSerializer(
                produce.transactions.all(),
                many=True
            ).data,
            'verifications': ConsumerVerificationSerializer(
                produce.verifications.all(),
                many=True
            ).data
        }
        
        return Response(data)
    
    def _generate_qr_code_data(self, produce):
        """Generate QR code data for produce"""
        base_url = self.request.build_absolute_uri('/').rstrip('/')
        return f"{base_url}/verify/{produce.produce_id}"
    
    def _create_qr_image(self, data):
        """Create QR code image and return base64 string"""
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_str}"