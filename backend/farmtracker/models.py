from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from decimal import Decimal

User = get_user_model()


class Farmer(models.Model):
    """Farmer profile with M-Pesa integration and carbon credit tracking"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    farmer_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    farm_name = models.CharField(max_length=200)
    location = models.CharField(max_length=300)
    gps_coordinates = models.CharField(max_length=100, blank=True, help_text="Latitude,Longitude")
    phone_number = models.CharField(max_length=20, unique=True)
    mpesa_number = models.CharField(max_length=20, help_text="M-Pesa phone number for payments")
    certification_status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('certified_organic', 'Certified Organic'),
        ('eco_friendly', 'Eco-Friendly Certified')
    ], default='pending')
    
    # Carbon credit tracking
    carbon_credits_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    eco_practices = models.JSONField(default=list, blank=True, help_text="List of eco-friendly practices adopted")
    sustainability_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Hedera DLT integration
    hedera_account_id = models.CharField(max_length=50, blank=True, null=True)
    wallet_address = models.CharField(max_length=100, blank=True, null=True)
    
    registration_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-registration_date']
    
    def __str__(self):
        return f"{self.farm_name} - {self.user.get_full_name()}"


class ProduceCategory(models.Model):
    """Categories of agricultural produce"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    unit_of_measurement = models.CharField(max_length=20, default='kg')
    carbon_footprint_factor = models.DecimalField(
        max_digits=5, decimal_places=2, default=1.0,
        help_text="Carbon footprint multiplier for this produce type"
    )
    
    class Meta:
        verbose_name_plural = "Produce Categories"
    
    def __str__(self):
        return self.name


class Produce(models.Model):
    """Individual produce batch registered by farmers"""
    produce_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='produces')
    category = models.ForeignKey(ProduceCategory, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='kg')
    quality_grade = models.CharField(max_length=10, choices=[
        ('A', 'Grade A'),
        ('B', 'Grade B'),
        ('C', 'Grade C'),
    ], default='B')
    
    # Pricing
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_value = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    
    # Production details
    harvest_date = models.DateField()
    registration_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateField(blank=True, null=True)
    
    # Eco-friendly tracking
    organic_certified = models.BooleanField(default=False)
    pesticide_free = models.BooleanField(default=False)
    water_efficient = models.BooleanField(default=False)
    carbon_neutral = models.BooleanField(default=False)
    eco_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Blockchain tracking
    blockchain_hash = models.CharField(max_length=256, blank=True, null=True)
    smart_contract_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('registered', 'Registered'),
        ('in_transit', 'In Transit'),
        ('at_market', 'At Market'),
        ('sold', 'Sold'),
        ('expired', 'Expired')
    ], default='registered')
    
    class Meta:
        ordering = ['-registration_date']
    
    def save(self, *args, **kwargs):
        if self.quantity and self.price_per_unit:
            self.total_value = self.quantity * self.price_per_unit
        
        # Calculate eco score
        eco_points = 0
        if self.organic_certified:
            eco_points += 25
        if self.pesticide_free:
            eco_points += 25
        if self.water_efficient:
            eco_points += 25
        if self.carbon_neutral:
            eco_points += 25
        self.eco_score = eco_points
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - {self.quantity}{self.unit} by {self.farmer.farm_name}"


class TrackingPoint(models.Model):
    """Supply chain tracking points for produce journey"""
    tracking_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE, related_name='tracking_points')
    location_name = models.CharField(max_length=200)
    location_type = models.CharField(max_length=50, choices=[
        ('farm', 'Farm'),
        ('collection_center', 'Collection Center'),
        ('warehouse', 'Warehouse'),
        ('transport', 'In Transport'),
        ('market', 'Market'),
        ('retailer', 'Retailer'),
        ('consumer', 'Consumer')
    ])
    gps_coordinates = models.CharField(max_length=100, blank=True)
    
    # Handler information
    handler_name = models.CharField(max_length=200, blank=True)
    handler_contact = models.CharField(max_length=50, blank=True)
    
    # Conditions
    temperature = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Temperature in Celsius")
    humidity = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Humidity percentage")
    condition_notes = models.TextField(blank=True)
    
    # Verification
    verified = models.BooleanField(default=False)
    verification_method = models.CharField(max_length=50, blank=True)
    verification_hash = models.CharField(max_length=256, blank=True, null=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.produce.name} at {self.location_name} - {self.timestamp}"


class Transaction(models.Model):
    """Financial transactions for produce sales"""
    transaction_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE, related_name='transactions')
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='transactions')
    
    # Buyer information
    buyer_name = models.CharField(max_length=200)
    buyer_contact = models.CharField(max_length=50, blank=True)
    buyer_type = models.CharField(max_length=50, choices=[
        ('consumer', 'End Consumer'),
        ('retailer', 'Retailer'),
        ('wholesaler', 'Wholesaler'),
        ('processor', 'Processor')
    ])
    
    # Transaction details
    quantity_sold = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Fair trade premium
    fair_trade_premium = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    carbon_credit_bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Payment details
    payment_method = models.CharField(max_length=50, choices=[
        ('mpesa', 'M-Pesa'),
        ('bank', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('crypto', 'Cryptocurrency')
    ], default='mpesa')
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='pending')
    mpesa_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Blockchain tracking
    smart_contract_executed = models.BooleanField(default=False)
    blockchain_transaction_hash = models.CharField(max_length=256, blank=True, null=True)
    hedera_consensus_timestamp = models.CharField(max_length=100, blank=True, null=True)
    
    transaction_date = models.DateTimeField(auto_now_add=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-transaction_date']
    
    def save(self, *args, **kwargs):
        # Calculate totals
        self.total_amount = self.quantity_sold * self.unit_price
        
        # Calculate fair trade premium (10% bonus for verified farmers)
        if self.farmer.certification_status in ['verified', 'certified_organic', 'eco_friendly']:
            self.fair_trade_premium = self.total_amount * Decimal('0.10')
        
        # Calculate carbon credit bonus based on eco score
        if self.produce.eco_score >= 75:
            self.carbon_credit_bonus = self.total_amount * Decimal('0.05')
        
        self.final_amount = self.total_amount + self.fair_trade_premium + self.carbon_credit_bonus
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Transaction {self.transaction_id} - {self.farmer.farm_name} to {self.buyer_name}"


class CarbonCredit(models.Model):
    """Carbon credit tracking and rewards"""
    credit_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='carbon_credits')
    
    # Credit details
    credits_earned = models.DecimalField(max_digits=10, decimal_places=2)
    credit_type = models.CharField(max_length=50, choices=[
        ('organic_farming', 'Organic Farming'),
        ('water_conservation', 'Water Conservation'),
        ('renewable_energy', 'Renewable Energy Use'),
        ('reforestation', 'Reforestation'),
        ('soil_management', 'Sustainable Soil Management'),
        ('waste_reduction', 'Waste Reduction')
    ])
    
    # Verification
    verification_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('issued', 'Issued'),
        ('redeemed', 'Redeemed')
    ], default='pending')
    verification_date = models.DateTimeField(blank=True, null=True)
    verifier_name = models.CharField(max_length=200, blank=True)
    
    # Monetary value
    credit_value_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=[
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid')
    ], default='unpaid')
    
    # Blockchain tracking
    nft_token_id = models.CharField(max_length=100, blank=True, null=True)
    blockchain_certificate_hash = models.CharField(max_length=256, blank=True, null=True)
    
    issue_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-issue_date']
    
    def __str__(self):
        return f"{self.credits_earned} credits - {self.farmer.farm_name}"


class QRCode(models.Model):
    """QR codes for produce authentication"""
    qr_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    produce = models.OneToOneField(Produce, on_delete=models.CASCADE, related_name='qr_code')
    qr_data = models.TextField()
    qr_image_url = models.URLField(blank=True, null=True)
    scan_count = models.IntegerField(default=0)
    last_scanned = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"QR Code for {self.produce.name}"


class ConsumerVerification(models.Model):
    """Consumer verification records for authenticity checks"""
    verification_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE, related_name='verifications')
    qr_code = models.ForeignKey(QRCode, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Consumer details
    consumer_name = models.CharField(max_length=200, blank=True)
    consumer_email = models.EmailField(blank=True)
    consumer_phone = models.CharField(max_length=20, blank=True)
    
    # Verification details
    verification_method = models.CharField(max_length=50, choices=[
        ('qr_scan', 'QR Code Scan'),
        ('manual_code', 'Manual Code Entry'),
        ('nfc', 'NFC Tag'),
        ('blockchain', 'Blockchain Verification')
    ])
    verification_status = models.CharField(max_length=20, choices=[
        ('authentic', 'Authentic'),
        ('suspicious', 'Suspicious'),
        ('counterfeit', 'Counterfeit')
    ], default='authentic')
    
    # Location
    verification_location = models.CharField(max_length=200, blank=True)
    gps_coordinates = models.CharField(max_length=100, blank=True)
    
    # Feedback
    quality_rating = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback = models.TextField(blank=True)
    
    verified_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-verified_at']
    
    def __str__(self):
        return f"Verification {self.verification_id} - {self.produce.name}"