from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmerViewSet, FarmerRegistrationView, ProduceCategoryViewSet,
    ProduceViewSet
)
from .views2 import (
    TransactionViewSet, ConsumerVerificationView, DashboardStatsView
)

router = DefaultRouter()
router.register(r'farmers', FarmerViewSet)
router.register(r'produce-categories', ProduceCategoryViewSet)
router.register(r'produce', ProduceViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', FarmerRegistrationView.as_view(), name='farmer-registration'),
    path('verify/', ConsumerVerificationView.as_view(), name='consumer-verification'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]