from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.accounts.models import Client, phone_regex

class Lead(models.Model):
    """Individual lead/prospect model"""
    LEAD_SOURCES = [
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('whatsapp', 'WhatsApp Direct'),
        ('website', 'Website'),
        ('qr_code', 'QR Code'),
        ('referral', 'Referral'),
        ('other', 'Other'),
    ]
    
    LEAD_STATUS = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('engaged', 'Engaged'),
        ('qualified', 'Qualified'),
        ('converted', 'Converted'),
        ('lost', 'Lost'),
    ]
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='leads')
    phone_number = models.CharField(validators=[phone_regex], max_length=17)
    email = models.EmailField(blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    
    source = models.CharField(max_length=20, choices=LEAD_SOURCES)
    source_campaign = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=LEAD_STATUS, default='new')
    
    score = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Engagement metrics
    total_messages = models.IntegerField(default=0)
    last_interaction = models.DateTimeField(null=True, blank=True)
    products_viewed = models.JSONField(default=list, blank=True)
    
    # Tags for segmentation
    tags = models.JSONField(default=list, blank=True)
    
    # Conversion tracking
    converted_at = models.DateTimeField(null=True, blank=True)
    conversion_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        unique_together = ['client', 'phone_number']
    
    def __str__(self):
        return f"{self.get_full_name()} - {self.phone_number}"
    
    def get_full_name(self):
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        return "Unknown"
    
    def calculate_score(self):
        """Calculate lead score based on engagement"""
        score = 0
        
        # Base score from status
        status_scores = {
            'new': 10,
            'contacted': 20,
            'engaged': 40,
            'qualified': 70,
            'converted': 100,
        }
        score += status_scores.get(self.status, 0)
        
        # Engagement score
        if self.total_messages > 10:
            score += 10
        elif self.total_messages > 5:
            score += 5
        
        # Product interest score
        if len(self.products_viewed) > 5:
            score += 10
        elif len(self.products_viewed) > 2:
            score += 5
        
        self.score = min(score, 100)
        return self.score

class LeadNote(models.Model):
    """Notes and interactions for leads"""
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='notes')
    note = models.TextField()
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'lead_notes'
        ordering = ['-created_at']