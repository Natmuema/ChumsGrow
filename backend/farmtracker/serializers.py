from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Farmer, ProduceCategory, Produce, TrackingPoint,
    Transaction, CarbonCredit, QRCode, ConsumerVerification
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class FarmerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    total_earnings = serializers.SerializerMethodField()
    active_produce_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Farmer
        fields = '__all__'
        read_only_fields = ['farmer_id', 'hedera_account_id', 'wallet_address']
    
    def get_total_earnings(self, obj):
        transactions = obj.transactions.filter(payment_status='completed')
        return sum(t.final_amount for t in transactions)
    
    def get_active_produce_count(self, obj):
        return obj.produces.exclude(status='sold').count()


class FarmerRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = Farmer
        fields = [
            'username', 'password', 'email', 'first_name', 'last_name',
            'farm_name', 'location', 'gps_coordinates', 'phone_number',
            'mpesa_number', 'eco_practices'
        ]
    
    def create(self, validated_data):
        # Extract user data
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
        }
        
        # Create user
        user = User.objects.create_user(**user_data)
        
        # Create farmer profile
        farmer = Farmer.objects.create(user=user, **validated_data)
        return farmer


class ProduceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProduceCategory
        fields = '__all__'


class ProduceSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.farm_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tracking_count = serializers.SerializerMethodField()
    last_location = serializers.SerializerMethodField()
    
    class Meta:
        model = Produce
        fields = '__all__'
        read_only_fields = [
            'produce_id', 'total_value', 'eco_score',
            'blockchain_hash', 'smart_contract_id'
        ]
    
    def get_tracking_count(self, obj):
        return obj.tracking_points.count()
    
    def get_last_location(self, obj):
        last_point = obj.tracking_points.order_by('-timestamp').first()
        if last_point:
            return {
                'location': last_point.location_name,
                'type': last_point.location_type,
                'timestamp': last_point.timestamp
            }
        return None


class TrackingPointSerializer(serializers.ModelSerializer):
    produce_name = serializers.CharField(source='produce.name', read_only=True)
    
    class Meta:
        model = TrackingPoint
        fields = '__all__'
        read_only_fields = ['tracking_id', 'verification_hash', 'timestamp']


class TransactionSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.farm_name', read_only=True)
    produce_name = serializers.CharField(source='produce.name', read_only=True)
    payment_breakdown = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = [
            'transaction_id', 'total_amount', 'fair_trade_premium',
            'carbon_credit_bonus', 'final_amount', 'blockchain_transaction_hash',
            'hedera_consensus_timestamp', 'transaction_date'
        ]
    
    def get_payment_breakdown(self, obj):
        return {
            'base_amount': obj.total_amount,
            'fair_trade_premium': obj.fair_trade_premium,
            'carbon_credit_bonus': obj.carbon_credit_bonus,
            'final_amount': obj.final_amount
        }


class CarbonCreditSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.farm_name', read_only=True)
    
    class Meta:
        model = CarbonCredit
        fields = '__all__'
        read_only_fields = [
            'credit_id', 'nft_token_id', 'blockchain_certificate_hash',
            'issue_date'
        ]


class QRCodeSerializer(serializers.ModelSerializer):
    produce_details = ProduceSerializer(source='produce', read_only=True)
    
    class Meta:
        model = QRCode
        fields = '__all__'
        read_only_fields = ['qr_id', 'qr_data', 'qr_image_url', 'scan_count', 'created_at']


class ConsumerVerificationSerializer(serializers.ModelSerializer):
    produce_name = serializers.CharField(source='produce.name', read_only=True)
    farmer_name = serializers.CharField(source='produce.farmer.farm_name', read_only=True)
    journey = serializers.SerializerMethodField()
    
    class Meta:
        model = ConsumerVerification
        fields = '__all__'
        read_only_fields = ['verification_id', 'verified_at']
    
    def get_journey(self, obj):
        tracking_points = obj.produce.tracking_points.order_by('timestamp')
        return TrackingPointSerializer(tracking_points, many=True).data


class ProduceTrackingSerializer(serializers.Serializer):
    """Serializer for complete produce tracking information"""
    produce = ProduceSerializer()
    tracking_points = TrackingPointSerializer(many=True)
    farmer = FarmerSerializer()
    qr_code = QRCodeSerializer()
    transactions = TransactionSerializer(many=True)
    verifications = ConsumerVerificationSerializer(many=True)


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_farmers = serializers.IntegerField()
    total_produce = serializers.IntegerField()
    total_transactions = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    carbon_credits_issued = serializers.DecimalField(max_digits=10, decimal_places=2)
    active_shipments = serializers.IntegerField()
    verified_produce = serializers.IntegerField()
    eco_friendly_percentage = serializers.FloatField()


class PaymentRequestSerializer(serializers.Serializer):
    """Serializer for payment requests"""
    transaction_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_method = serializers.ChoiceField(choices=['mpesa', 'bank', 'crypto'])
    phone_number = serializers.CharField(max_length=20, required=False)


class VerificationRequestSerializer(serializers.Serializer):
    """Serializer for produce verification requests"""
    produce_id = serializers.UUIDField()
    qr_code = serializers.CharField(required=False)
    verification_method = serializers.ChoiceField(
        choices=['qr_scan', 'manual_code', 'nfc', 'blockchain']
    )
    consumer_name = serializers.CharField(max_length=200, required=False)
    consumer_email = serializers.EmailField(required=False)
    consumer_phone = serializers.CharField(max_length=20, required=False)
    location = serializers.CharField(max_length=200, required=False)
    gps_coordinates = serializers.CharField(max_length=100, required=False)