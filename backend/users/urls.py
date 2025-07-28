from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('api/register/', views.register_view, name='register'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
    path('api/profile/', views.profile_view, name='profile'),
    path('api/profile/update/', views.update_profile_view, name='update_profile'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]