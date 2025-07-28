from django.shortcuts import render, get_object_or_404
import json
import logging
from decimal import Decimal, InvalidOperation
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from openai import OpenAI
from .models import RiskProfile, Investment, InvestmentRecommendation
from .serializers import (
    RiskProfileSerializer, 
    RiskProfileCreateSerializer,
    InvestmentSerializer, 
    InvestmentRecommendationSerializer,
    InvestmentSummarySerializer
)

# Set up logging
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=getattr(settings, 'OPENAI_API_KEY', None))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_risk_profile(request):
    """
    Create a new risk profile and get AI-generated investment recommendations.
    """
    try:
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required',
                'message': 'Please provide a valid JWT token to create a risk profile'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        existing_profile = RiskProfile.objects.filter(user=request.user).first()
        if existing_profile:
            return Response({
                'error': 'Risk profile already exists for this user',
                'profile_id': existing_profile.id
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Use create serializer that doesn't include user field
        serializer = RiskProfileCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                # Save profile with current user
                profile = serializer.save(user=request.user)
                
                logger.info(f"Created risk profile for user {request.user.id}")
                
                # Generate AI recommendations based on the risk profile
                recommendations = generate_ai_recommendations(profile)
                
                # Save recommendations to the database
                saved_recommendations = []
                for rec in recommendations:
                    try:
                        # Get or create investment
                        investment, created = Investment.objects.get_or_create(
                            name=rec['name'],
                            defaults={
                                'type': rec['type'],
                                'minimum_amount': rec['minimum_amount'],
                                'expected_return': rec['expected_return'],
                                'risk_level': rec['risk_level'],
                                'description': rec['description'],
                                'local_description': rec['local_description'],
                            }
                        )
                        
                        # Create recommendation
                        recommendation = InvestmentRecommendation.objects.create(
                            risk_profile=profile,
                            investment=investment,
                            recommended_amount=rec['recommended_amount'],
                            ai_rationale=rec['rationale'],
                            confidence_score=rec.get('confidence_score', 0.8)
                        )
                        saved_recommendations.append(recommendation)
                        
                    except Exception as e:
                        logger.error(f"Error creating recommendation: {e}")
                        continue
                
                # Serialize the response
                profile_serializer = RiskProfileSerializer(profile)
                rec_serializer = InvestmentRecommendationSerializer(saved_recommendations, many=True)
                
                return Response({
                    'profile': profile_serializer.data,
                    'recommendations': rec_serializer.data,
                    'message': f'Successfully created {len(saved_recommendations)} recommendations'
                }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error in create_risk_profile: {e}")
        return Response({
            'error': 'An unexpected error occurred',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user's risk profile and recommendations"""
    try:
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required',
                'message': 'Please provide a valid JWT token to access your profile'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = get_object_or_404(RiskProfile, user=request.user)
        recommendations = InvestmentRecommendation.objects.filter(
            risk_profile=profile, 
            is_active=True
        ).select_related('investment')
        
        profile_serializer = RiskProfileSerializer(profile)
        rec_serializer = InvestmentRecommendationSerializer(recommendations, many=True)
        
        return Response({
            'profile': profile_serializer.data,
            'recommendations': rec_serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in get_user_profile: {e}")
        return Response({
            'error': 'Error retrieving profile',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_risk_profile(request):
    """Update existing risk profile and regenerate recommendations"""
    try:
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required',
                'message': 'Please provide a valid JWT token to update your profile'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = get_object_or_404(RiskProfile, user=request.user)
        serializer = RiskProfileCreateSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            with transaction.atomic():
                profile = serializer.save()
                
                # Deactivate old recommendations
                InvestmentRecommendation.objects.filter(
                    risk_profile=profile
                ).update(is_active=False)
                
                # Generate new recommendations
                recommendations = generate_ai_recommendations(profile)
                
                # Save new recommendations
                saved_recommendations = []
                for rec in recommendations:
                    try:
                        investment, created = Investment.objects.get_or_create(
                            name=rec['name'],
                            defaults={
                                'type': rec['type'],
                                'minimum_amount': rec['minimum_amount'],
                                'expected_return': rec['expected_return'],
                                'risk_level': rec['risk_level'],
                                'description': rec['description'],
                                'local_description': rec['local_description'],
                            }
                        )
                        
                        recommendation = InvestmentRecommendation.objects.create(
                            risk_profile=profile,
                            investment=investment,
                            recommended_amount=rec['recommended_amount'],
                            ai_rationale=rec['rationale'],
                            confidence_score=rec.get('confidence_score', 0.8)
                        )
                        saved_recommendations.append(recommendation)
                        
                    except Exception as e:
                        logger.error(f"Error creating recommendation: {e}")
                        continue
                
                profile_serializer = RiskProfileSerializer(profile)
                rec_serializer = InvestmentRecommendationSerializer(saved_recommendations, many=True)
                
                return Response({
                    'profile': profile_serializer.data,
                    'recommendations': rec_serializer.data,
                    'message': 'Profile updated successfully'
                }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error in update_risk_profile: {e}")
        return Response({
            'error': 'Error updating profile',
            'detail': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ... rest of your functions remain the same ...

def generate_ai_recommendations(profile):
    """Generate personalized investment recommendations using OpenAI API"""
    
    if not client or not hasattr(settings, 'OPENAI_API_KEY'):
        logger.warning("OpenAI API key not configured, using fallback recommendations")
        return get_fallback_recommendations(profile)
    
    prompt = f"""
    Based on the following risk profile, generate personalized investment recommendations for Kenya:
    
    - Age: {profile.age} years
    - Monthly Income: KSh {profile.monthly_income:,.2f}
    - Available Investment Amount: KSh {profile.investment_amount:,.2f}
    - Risk Tolerance: {profile.risk_tolerance}
    - Investment Timeline: {profile.investment_timeline} months ({profile.investment_timeline_years} years)
    - Financial Goals: {profile.financial_goals}
    
    Provide 3-5 specific investment recommendations suitable for Kenya. For each recommendation, include:
    1. name: Creative but realistic investment name
    2. type: One of (stocks, bonds, real_estate, money_market, mutual_funds, fixed_deposit, business, agriculture, digital_assets)
    3. minimum_amount: Minimum investment required (number only)
    4. expected_return: Expected annual return percentage (number only)
    5. risk_level: One of (conservative, moderate, aggressive) - matching their risk tolerance
    6. description: Detailed English description
    7. local_description: Description in Swahili
    8. recommended_amount: Specific amount to invest from their available capital (number only)
    9. rationale: Clear explanation why this is recommended for their profile
    10. confidence_score: Your confidence in this recommendation (0.0 to 1.0)
    
    Guidelines:
    - Focus on Kenyan market opportunities (NSE, money market funds, SACCOs, etc.)
    - Consider entry-level investments starting from KSh 1,000
    - Total recommended amounts should not exceed their available investment amount
    - Match risk levels to their tolerance
    - Be practical and accessible
    - Ensure recommended amounts meet minimum requirements
    
    Return ONLY a valid JSON array of investment objects with no additional text.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using correct model name
            max_tokens=2000,
            temperature=0.7,
            messages=[
                {
                    "role": "system", 
                    "content": "You are a financial advisor specializing in Kenyan investments. Return only valid JSON arrays."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ]
        )
        
        # Parse the AI response
        ai_response = response.choices[0].message.content.strip()
        
        # Clean the response to extract JSON
        json_start = ai_response.find('[')
        json_end = ai_response.rfind(']') + 1
        
        if json_start == -1 or json_end == 0:
            raise ValueError("No valid JSON array found in AI response")
        
        json_str = ai_response[json_start:json_end]
        recommendations = json.loads(json_str)
        
        # Process and validate recommendations
        processed_recommendations = []
        total_recommended = Decimal('0')
        
        for rec in recommendations:
            try:
                recommended_amount = Decimal(str(rec.get('recommended_amount', 5000)))
                
                # Check if we're not exceeding the total investment amount
                if total_recommended + recommended_amount > profile.investment_amount:
                    recommended_amount = profile.investment_amount - total_recommended
                    if recommended_amount <= 0:
                        continue
                
                processed_rec = {
                    'name': rec.get('name', 'Investment Option'),
                    'type': rec.get('type', 'mutual_funds'),
                    'minimum_amount': Decimal(str(rec.get('minimum_amount', 1000))),
                    'expected_return': Decimal(str(rec.get('expected_return', 8))),
                    'risk_level': rec.get('risk_level', profile.risk_tolerance),
                    'description': rec.get('description', 'Investment opportunity'),
                    'local_description': rec.get('local_description', 'Fursa ya uwekezaji'),
                    'recommended_amount': recommended_amount,
                    'rationale': rec.get('rationale', 'AI-generated recommendation'),
                    'confidence_score': min(max(float(rec.get('confidence_score', 0.8)), 0.0), 1.0)
                }
                
                total_recommended += recommended_amount
                processed_recommendations.append(processed_rec)
                
            except (ValueError, InvalidOperation, TypeError) as e:
                logger.error(f"Error processing recommendation: {e}")
                continue
        
        if not processed_recommendations:
            logger.warning("No valid recommendations generated, using fallback")
            return get_fallback_recommendations(profile)
        
        logger.info(f"Generated {len(processed_recommendations)} AI recommendations")
        return processed_recommendations
        
    except Exception as e:
        logger.error(f"AI recommendation error: {e}")
        return get_fallback_recommendations(profile)

def get_fallback_recommendations(profile):
    """Fallback recommendations if AI service fails"""
    logger.info("Using fallback recommendations")
    
    # Adjust recommendations based on risk tolerance
    if profile.risk_tolerance == 'conservative':
        base_recommendations = [
            {
                'name': 'Money Market Fund - Conservative',
                'type': 'money_market',
                'minimum_amount': Decimal('1000'),
                'expected_return': Decimal('7.5'),
                'risk_level': 'conservative',
                'description': 'Low-risk investment in short-term securities with stable returns',
                'local_description': 'Uwekezaji wa hatari kidogo katika dhamana za muda mfupi',
                'recommended_amount': min(profile.investment_amount * Decimal('0.6'), Decimal('100000')),
                'rationale': 'Safe starting point for conservative investors seeking capital preservation',
                'confidence_score': 0.9
            },
            {
                'name': 'Fixed Deposit Account',
                'type': 'fixed_deposit',
                'minimum_amount': Decimal('5000'),
                'expected_return': Decimal('9.0'),
                'risk_level': 'conservative',
                'description': 'Fixed-term deposits with guaranteed returns',
                'local_description': 'Amana za muda maalum na mapato ya hakika',
                'recommended_amount': min(profile.investment_amount * Decimal('0.4'), Decimal('50000')),
                'rationale': 'Guaranteed returns with capital protection',
                'confidence_score': 0.95
            }
        ]
    elif profile.risk_tolerance == 'moderate':
        base_recommendations = [
            {
                'name': 'Balanced Mutual Fund',
                'type': 'mutual_funds',
                'minimum_amount': Decimal('2000'),
                'expected_return': Decimal('12.0'),
                'risk_level': 'moderate',
                'description': 'Diversified portfolio of stocks and bonds',
                'local_description': 'Mfuko wa uwekezaji wenye mchanganyiko wa hisa na dhamana',
                'recommended_amount': min(profile.investment_amount * Decimal('0.5'), Decimal('75000')),
                'rationale': 'Balanced approach with moderate risk and return potential',
                'confidence_score': 0.85
            },
            {
                'name': 'SACCO Investment Shares',
                'type': 'business',
                'minimum_amount': Decimal('1000'),
                'expected_return': Decimal('15.0'),
                'risk_level': 'moderate',
                'description': 'Cooperative society investment with annual dividends',
                'local_description': 'Uwekezaji katika shirika la ushirika na mgao wa kila mwaka',
                'recommended_amount': min(profile.investment_amount * Decimal('0.3'), Decimal('40000')),
                'rationale': 'Community-based investment with steady dividend income',
                'confidence_score': 0.8
            }
        ]
    else:  # aggressive
        base_recommendations = [
            {
                'name': 'NSE Equity Fund',
                'type': 'stocks',
                'minimum_amount': Decimal('5000'),
                'expected_return': Decimal('18.0'),
                'risk_level': 'aggressive',
                'description': 'Investment in Nairobi Securities Exchange listed companies',
                'local_description': 'Uwekezaji katika makampuni yaliyoorodheshwa NSE',
                'recommended_amount': min(profile.investment_amount * Decimal('0.4'), Decimal('80000')),
                'rationale': 'High growth potential through equity market exposure',
                'confidence_score': 0.75
            },
            {
                'name': 'Real Estate Investment Trust',
                'type': 'real_estate',
                'minimum_amount': Decimal('10000'),
                'expected_return': Decimal('16.0'),
                'risk_level': 'aggressive',
                'description': 'Investment in commercial and residential properties',
                'local_description': 'Uwekezaji katika mali za kibiashara na za makazi',
                'recommended_amount': min(profile.investment_amount * Decimal('0.3'), Decimal('60000')),
                'rationale': 'Diversification into real estate with potential for capital appreciation',
                'confidence_score': 0.7
            }
        ]
    
    return base_recommendations

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # This can stay AllowAny since it doesn't use request.user
def get_investment_types(request):
    """Get available investment types with descriptions"""
    investment_types = [
        {
            'type': 'stocks',
            'name': 'Stocks',
            'name_sw': 'Hisa za Kampuni',
            'description': 'Shares in publicly traded companies on the Nairobi Securities Exchange',
            'local_description': 'Hisa katika kampuni zinazoorodheshwa NSE',
            'risk_level': 'aggressive',
            'typical_return': '15-25%',
            'minimum_investment': 5000
        },
        {
            'type': 'bonds',
            'name': 'Bonds',
            'name_sw': 'Dhamana',
            'description': 'Government and corporate bonds with fixed returns',
            'local_description': 'Dhamana za serikali na makampuni na mapato ya kudumu',
            'risk_level': 'conservative',
            'typical_return': '8-12%',
            'minimum_investment': 1000
        },
        {
            'type': 'real_estate',
            'name': 'Real Estate',
            'name_sw': 'Mali Isiyohamishika',
            'description': 'Property investments and REITs',
            'local_description': 'Uwekezaji wa mali isiyohamishika na REITs',
            'risk_level': 'moderate',
            'typical_return': '12-18%',
            'minimum_investment': 10000
        },
        {
            'type': 'money_market',
            'name': 'Money Market Fund',
            'name_sw': 'Soko la Fedha',
            'description': 'Short-term, low-risk investments in treasury bills and commercial papers',
            'local_description': 'Uwekezaji wa muda mfupi, hatari kidogo katika hundi za hazina',
            'risk_level': 'conservative',
            'typical_return': '6-9%',
            'minimum_investment': 1000
        },
        {
            'type': 'mutual_funds',
            'name': 'Mutual Funds',
            'name_sw': 'Mfuko wa Uongozi',
            'description': 'Professionally managed investment portfolios',
            'local_description': 'Mfuko wa uwekezaji unaoongozwa na wataalamu',
            'risk_level': 'moderate',
            'typical_return': '10-15%',
            'minimum_investment': 2000
        },
        {
            'type': 'fixed_deposit',
            'name': 'Fixed Deposit',
            'name_sw': 'Amana ya Muda',
            'description': 'Fixed-term deposits with guaranteed returns',
            'local_description': 'Amana za muda maalum na mapato ya hakika',
            'risk_level': 'conservative',
            'typical_return': '7-10%',
            'minimum_investment': 5000
        },
        {
            'type': 'business',
            'name': 'Business Investment',
            'name_sw': 'Biashara',
            'description': 'Investment in business ventures, SACCOs, or cooperative societies',
            'local_description': 'Uwekezaji katika biashara, SACCO, au vyama vya ushirika',
            'risk_level': 'moderate',
            'typical_return': '12-20%',
            'minimum_investment': 1000
        },
        {
            'type': 'agriculture',
            'name': 'Agriculture',
            'name_sw': 'Kilimo',
            'description': 'Investment in agricultural projects and agribusiness',
            'local_description': 'Uwekezaji katika miradi ya kilimo na biashara za kilimo',
            'risk_level': 'moderate',
            'typical_return': '10-16%',
            'minimum_investment': 3000
        },
        {
            'type': 'digital_assets',
            'name': 'Digital Assets',
            'name_sw': 'Mali za Kidijitali',
            'description': 'Investment in digital currencies and blockchain-based assets',
            'local_description': 'Uwekezaji katika sarafu za kidijitali na mali za blockchain',
            'risk_level': 'aggressive',
            'typical_return': '15-30%',
            'minimum_investment': 1000
        }
    ]
    
    return Response({
        'investment_types': investment_types,
        'message': 'Available investment types for Kenya',
        'total_types': len(investment_types)
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # This can stay AllowAny since it doesn't use request.user
def get_investments(request):
    """Get all available investments"""
    investments = Investment.objects.filter(is_active=True)
    serializer = InvestmentSummarySerializer(investments, many=True)
    
    return Response({
        'investments': serializer.data,
        'total_count': investments.count()
    }, status=status.HTTP_200_OK)