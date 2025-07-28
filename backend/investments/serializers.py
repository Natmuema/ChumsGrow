from rest_framework import serializers
from django.contrib.auth.models import User
from .models import RiskProfile, Investment, InvestmentRecommendation

class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer for nested representation"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = ['id']

class RiskProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    investment_timeline_years = serializers.ReadOnlyField()
    monthly_investment_capacity = serializers.ReadOnlyField()
    risk_tolerance_display = serializers.CharField(source='get_risk_tolerance_display', read_only=True)
    
    class Meta:
        model = RiskProfile
        fields = [
            'id', 'user', 'age', 'monthly_income', 'investment_amount', 
            'risk_tolerance', 'risk_tolerance_display', 'investment_timeline', 
            'investment_timeline_years', 'financial_goals', 'monthly_investment_capacity',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_age(self, value):
        """Validate age is reasonable"""
        if value < 18:
            raise serializers.ValidationError("Age must be at least 18 years.")
        if value > 100:
            raise serializers.ValidationError("Age must be less than 100 years.")
        return value
    
    def validate_investment_amount(self, value):
        """Validate investment amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Investment amount must be greater than 0.")
        return value
    
    def validate_monthly_income(self, value):
        """Validate monthly income is positive"""
        if value <= 0:
            raise serializers.ValidationError("Monthly income must be greater than 0.")
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        investment_amount = data.get('investment_amount')
        monthly_income = data.get('monthly_income')
        
        if investment_amount and monthly_income:
            # Check if investment amount is reasonable compared to income
            if investment_amount > monthly_income * 12:  # More than annual income
                raise serializers.ValidationError(
                    "Investment amount seems too high compared to your annual income. "
                    "Consider a more conservative approach."
                )
        
        return data

class InvestmentSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    risk_level_display = serializers.CharField(source='get_risk_level_display', read_only=True)
    expected_return_decimal = serializers.ReadOnlyField()
    
    class Meta:
        model = Investment
        fields = [
            'id', 'name', 'type', 'type_display', 'minimum_amount', 
            'expected_return', 'expected_return_decimal', 'risk_level', 
            'risk_level_display', 'description', 'local_description', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_expected_return(self, value):
        """Validate expected return is reasonable"""
        if value < 0:
            raise serializers.ValidationError("Expected return cannot be negative.")
        if value > 100:
            raise serializers.ValidationError("Expected return cannot exceed 100%.")
        return value
    
    def validate_minimum_amount(self, value):
        """Validate minimum amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Minimum amount must be greater than 0.")
        return value

class InvestmentRecommendationSerializer(serializers.ModelSerializer):
    investment = InvestmentSerializer(read_only=True)
    risk_profile = RiskProfileSerializer(read_only=True)
    percentage_of_portfolio = serializers.ReadOnlyField()
    projected_annual_return = serializers.ReadOnlyField()
    
    # Write-only fields for creating recommendations
    investment_id = serializers.IntegerField(write_only=True)
    risk_profile_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = InvestmentRecommendation
        fields = [
            'id', 'risk_profile', 'risk_profile_id', 'investment', 'investment_id',
            'recommended_amount', 'ai_rationale', 'confidence_score', 
            'percentage_of_portfolio', 'projected_annual_return', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_recommended_amount(self, value):
        """Validate recommended amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Recommended amount must be greater than 0.")
        return value
    
    def validate_confidence_score(self, value):
        """Validate confidence score is between 0 and 1"""
        if value is not None and (value < 0 or value > 1):
            raise serializers.ValidationError("Confidence score must be between 0 and 1.")
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        investment_id = data.get('investment_id')
        risk_profile_id = data.get('risk_profile_id')
        recommended_amount = data.get('recommended_amount')
        
        # Validate investment exists and is active
        if investment_id:
            try:
                investment = Investment.objects.get(id=investment_id, is_active=True)
                if recommended_amount and recommended_amount < investment.minimum_amount:
                    raise serializers.ValidationError(
                        f"Recommended amount must be at least {investment.minimum_amount} "
                        f"for {investment.name}."
                    )
            except Investment.DoesNotExist:
                raise serializers.ValidationError("Invalid or inactive investment selected.")
        
        # Validate risk profile exists
        if risk_profile_id:
            try:
                risk_profile = RiskProfile.objects.get(id=risk_profile_id)
                if recommended_amount and recommended_amount > risk_profile.investment_amount:
                    raise serializers.ValidationError(
                        "Recommended amount cannot exceed total investment amount."
                    )
            except RiskProfile.DoesNotExist:
                raise serializers.ValidationError("Invalid risk profile selected.")
        
        return data
    
    def create(self, validated_data):
        """Create recommendation with proper foreign key assignment"""
        investment_id = validated_data.pop('investment_id')
        risk_profile_id = validated_data.pop('risk_profile_id')
        
        investment = Investment.objects.get(id=investment_id)
        risk_profile = RiskProfile.objects.get(id=risk_profile_id)
        
        return InvestmentRecommendation.objects.create(
            investment=investment,
            risk_profile=risk_profile,
            **validated_data
        )

# Additional serializers for specific use cases
class RiskProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating risk profiles (excludes user field)"""
    class Meta:
        model = RiskProfile
        fields = [
            'age', 'monthly_income', 'investment_amount', 'risk_tolerance', 
            'investment_timeline', 'financial_goals'
        ]
    
    def validate_age(self, value):
        if value < 18:
            raise serializers.ValidationError("Age must be at least 18 years.")
        if value > 100:
            raise serializers.ValidationError("Age must be less than 100 years.")
        return value
    
    def validate_investment_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Investment amount must be greater than 0.")
        return value
    
    def validate_monthly_income(self, value):
        if value <= 0:
            raise serializers.ValidationError("Monthly income must be greater than 0.")
        return value

class InvestmentSummarySerializer(serializers.ModelSerializer):
    """Lightweight serializer for investment listings"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    risk_level_display = serializers.CharField(source='get_risk_level_display', read_only=True)
    
    class Meta:
        model = Investment
        fields = [
            'id', 'name', 'type', 'type_display', 'minimum_amount', 
            'expected_return', 'risk_level', 'risk_level_display'
        ]

    