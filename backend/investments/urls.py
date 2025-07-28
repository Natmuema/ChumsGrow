from django.urls import path
from . import views

app_name = 'investments'

urlpatterns = [
    # Risk Profile Management
    path('api/risk-profile/', views.create_risk_profile, name='create_risk_profile'),
    path('api/risk-profile/me/', views.get_user_profile, name='get_user_profile'),
    path('api/risk-profile/update/', views.update_risk_profile, name='update_risk_profile'),
    
    # Investment Information
    path('api/investment-types/', views.get_investment_types, name='get_investment_types'),
    path('api/investments/', views.get_investments, name='get_investments'),
    
    # Legacy endpoint (kept for backward compatibility)
    path('api/investment-recommendations/', views.get_investment_types, name='get_investment_recommendations'),
]