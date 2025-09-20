from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import MascotConfiguration, MascotAnimation, MascotInteraction
from .serializers import (
    MascotConfigurationSerializer,
    MascotAnimationSerializer,
    MascotInteractionSerializer,
    MascotStateSerializer
)
import random

class MascotConfigurationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing mascot configuration"""
    serializer_class = MascotConfigurationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get mascot config for current user's client"""
        if hasattr(self.request.user, 'client_profile'):
            return MascotConfiguration.objects.filter(
                client=self.request.user.client_profile
            )
        return MascotConfiguration.objects.none()
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current mascot configuration"""
        if hasattr(request.user, 'client_profile'):
            config, created = MascotConfiguration.objects.get_or_create(
                client=request.user.client_profile,
                defaults={
                    'greetings': [
                        "Hi there! I'm Nurty 🤖, your personal shopping assistant!",
                        "Hello! Welcome to our store! I'm here to help you find exactly what you need 😊",
                        "Hey! I'm Nurty, and I'm excited to help you shop today! 🛍️"
                    ],
                    'farewell_messages': [
                        "Thanks for shopping with us! Have a wonderful day! 👋",
                        "It was great helping you today! Come back soon! 😊",
                        "Bye for now! Remember, I'm always here if you need help! 🤖"
                    ],
                    'encouragement_phrases': [
                        "Great choice! This is one of our bestsellers! 🌟",
                        "You have excellent taste! This would look amazing on you! ✨",
                        "This item is flying off our shelves! Don't miss out! 🚀"
                    ],
                    'personality_traits': ['friendly', 'helpful', 'enthusiastic']
                }
            )
            serializer = self.get_serializer(config)
            return Response(serializer.data)
        return Response(
            {"error": "No client profile found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    @action(detail=False, methods=['post'])
    def get_greeting(self, request):
        """Get a random greeting message"""
        if hasattr(request.user, 'client_profile'):
            config = get_object_or_404(
                MascotConfiguration,
                client=request.user.client_profile
            )
            greeting = config.get_greeting()
            
            # Track interaction
            MascotInteraction.objects.create(
                client=request.user.client_profile,
                interaction_type='greeting'
            )
            
            return Response({
                'message': greeting,
                'emotion': 'happy',
                'animation': 'wave'
            })
        return Response(
            {"error": "No client profile found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    @action(detail=False, methods=['post'])
    def get_encouragement(self, request):
        """Get an encouragement phrase"""
        if hasattr(request.user, 'client_profile'):
            config = get_object_or_404(
                MascotConfiguration,
                client=request.user.client_profile
            )
            
            if config.encouragement_phrases:
                phrase = random.choice(config.encouragement_phrases)
            else:
                phrase = "You're making a great choice! 🌟"
            
            # Track interaction
            MascotInteraction.objects.create(
                client=request.user.client_profile,
                interaction_type='encouragement'
            )
            
            return Response({
                'message': phrase,
                'emotion': 'excited',
                'animation': 'thumbsup'
            })
        return Response(
            {"error": "No client profile found"},
            status=status.HTTP_404_NOT_FOUND
        )

class MascotAnimationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for mascot animations"""
    queryset = MascotAnimation.objects.filter(is_active=True)
    serializer_class = MascotAnimationSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_trigger(self, request):
        """Get animations by trigger event"""
        trigger = request.query_params.get('trigger')
        if not trigger:
            return Response(
                {"error": "Trigger parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        animations = self.get_queryset().filter(
            trigger_events__contains=trigger
        )
        serializer = self.get_serializer(animations, many=True)
        return Response(serializer.data)

class MascotInteractionViewSet(viewsets.ModelViewSet):
    """ViewSet for tracking mascot interactions"""
    serializer_class = MascotInteractionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get interactions for current user's client"""
        if hasattr(self.request.user, 'client_profile'):
            return MascotInteraction.objects.filter(
                client=self.request.user.client_profile
            )
        return MascotInteraction.objects.none()
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get mascot interaction analytics"""
        if hasattr(request.user, 'client_profile'):
            interactions = self.get_queryset()
            
            # Calculate analytics
            total_interactions = interactions.count()
            positive_interactions = interactions.filter(
                user_sentiment='positive'
            ).count()
            conversions = interactions.filter(
                led_to_conversion=True
            ).count()
            
            # Group by type
            interaction_types = {}
            for interaction_type in ['greeting', 'product_recommendation', 
                                    'answer_question', 'celebration', 
                                    'encouragement', 'farewell']:
                count = interactions.filter(
                    interaction_type=interaction_type
                ).count()
                interaction_types[interaction_type] = count
            
            return Response({
                'total_interactions': total_interactions,
                'positive_interactions': positive_interactions,
                'conversion_rate': (conversions / total_interactions * 100) if total_interactions > 0 else 0,
                'interaction_types': interaction_types,
                'average_duration': interactions.aggregate(
                    avg=models.Avg('interaction_duration')
                )['avg'] or 0
            })
        return Response(
            {"error": "No client profile found"},
            status=status.HTTP_404_NOT_FOUND
        )