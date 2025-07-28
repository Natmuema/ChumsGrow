from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class RiskProfile(TimeStampedModel):
    RISK_LEVELS = [
        ('conservative', 'Conservative'),
        ('moderate', 'Moderate'),
        ('aggressive', 'Aggressive'),
    ]

    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='risk_profiles')  # Optional: gives you user.risk_profiles.all()
    age = models.IntegerField(validators=[MinValueValidator(18), MaxValueValidator(100)])
    monthly_income = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    investment_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    risk_tolerance = models.CharField(max_length=20, choices=RISK_LEVELS)
    investment_timeline = models.IntegerField(
        help_text="Investment timeline in months",
        validators=[MinValueValidator(1)]
    )
    financial_goals = models.TextField(help_text="Describe your financial goals")
    
    class Meta:
        verbose_name = "Risk Profile"
        verbose_name_plural = "Risk Profiles"

    def __str__(self):
        return f"{self.user.username} - {self.get_risk_tolerance_display()}"
    
    @property
    def investment_timeline_years(self):
        """Return investment timeline in years"""
        return round(self.investment_timeline / 12, 1)
    
    @property
    def monthly_investment_capacity(self):
        """Calculate potential monthly investment capacity (rough estimate)"""
        # Simple calculation - could be more sophisticated
        return self.monthly_income * 0.1  # Assuming 10% of income for investment

class Investment(TimeStampedModel):
    INVESTMENT_TYPES = [
        ('stocks', 'Hisa za Kampuni'),
        ('bonds', 'Dhamana'),
        ('real_estate', 'Mali Isiyohamishika'),
        ('money_market', 'Soko la Fedha'),
        ('mutual_funds', 'Mfuko wa Uongozi'),
        ('fixed_deposit', 'Amana ya Muda'),
        ('business', 'Biashara'),
        ('agriculture', 'Kilimo'),
        ('digital_assets', 'Mali za Kidijitali'),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=INVESTMENT_TYPES)
    minimum_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    expected_return = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        help_text="Expected annual return in percentage",
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    risk_level = models.CharField(max_length=20, choices=RiskProfile.RISK_LEVELS)
    description = models.TextField()
    local_description = models.TextField(help_text="Description in Swahili")
    is_active = models.BooleanField(default=True, help_text="Whether this investment is currently available")
    
    class Meta:
        verbose_name = "Investment"
        verbose_name_plural = "Investments"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
    
    @property
    def expected_return_decimal(self):
        """Return expected return as decimal for calculations"""
        return self.expected_return / 100

class InvestmentRecommendation(TimeStampedModel):
    risk_profile = models.ForeignKey(RiskProfile, on_delete=models.CASCADE, related_name='recommendations')
    investment = models.ForeignKey(Investment, on_delete=models.CASCADE, related_name='recommendations')
    recommended_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        help_text="Recommended investment amount",
        validators=[MinValueValidator(0)],
        default=0
    )
    ai_rationale = models.TextField()
    confidence_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        help_text="AI confidence score (0-1)",
        validators=[MinValueValidator(0), MaxValueValidator(1)],

      
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Investment Recommendation"
        verbose_name_plural = "Investment Recommendations"
        unique_together = ['risk_profile', 'investment']
        ordering = ['-confidence_score', '-recommended_amount']

    def __str__(self):
        return f"Recommendation for {self.risk_profile.user.username} - {self.investment.name}"
    
    @property
    def percentage_of_portfolio(self):
        """Calculate what percentage of total investment this recommendation represents"""
        if self.risk_profile.investment_amount > 0:
            return (self.recommended_amount / self.risk_profile.investment_amount) * 100
        return 0
    
    @property
    def projected_annual_return(self):
        """Calculate projected annual return amount"""
        return self.recommended_amount * self.investment.expected_return_decimal
