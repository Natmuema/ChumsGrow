from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MascotConfigurationViewSet,
    MascotAnimationViewSet,
    MascotInteractionViewSet
)

router = DefaultRouter()
router.register(r'config', MascotConfigurationViewSet, basename='mascot-config')
router.register(r'animations', MascotAnimationViewSet, basename='mascot-animations')
router.register(r'interactions', MascotInteractionViewSet, basename='mascot-interactions')

urlpatterns = [
    path('', include(router.urls)),
]