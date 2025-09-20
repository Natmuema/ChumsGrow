from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

class User(AbstractUser):
    """Extended User model for the application"""
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    company_name = models.CharField(max_length=255, blank=True)
    is_client = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

class Client(models.Model):
    """SME Client account model"""
    SUBSCRIPTION_PLANS = [
        ('free', 'Free Trial'),
        ('starter', 'Starter - $49/month'),
        ('growth', 'Growth - $149/month'),
        ('scale', 'Scale - $499/month'),
        ('enterprise', 'Enterprise'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    business_name = models.CharField(max_length=255)
    business_type = models.CharField(max_length=100)
    whatsapp_number = models.CharField(validators=[phone_regex], max_length=17)
    website_url = models.URLField(blank=True, null=True)
    subscription_plan = models.CharField(max_length=20, choices=SUBSCRIPTION_PLANS, default='free')
    subscription_start = models.DateTimeField(null=True, blank=True)
    subscription_end = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Mascot customization
    mascot_name = models.CharField(max_length=50, default='Nurty')
    mascot_avatar = models.ImageField(upload_to='mascots/', null=True, blank=True)
    mascot_greeting = models.TextField(default="Hi! I'm here to help you find exactly what you're looking for! 🤖")
    
    # Integration settings
    shopify_store_url = models.URLField(blank=True, null=True)
    shopify_api_key = models.CharField(max_length=255, blank=True)
    woocommerce_url = models.URLField(blank=True, null=True)
    woocommerce_key = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'clients'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.business_name} ({self.subscription_plan})"
    
    @property
    def total_leads(self):
        return self.leads.count()
    
    @property
    def total_conversations(self):
        return self.leads.aggregate(
            total=models.Count('conversations')
        )['total'] or 0