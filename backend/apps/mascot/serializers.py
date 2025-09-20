from rest_framework import serializers
from .models import MascotConfiguration, MascotAnimation, MascotInteraction

class MascotConfigurationSerializer(serializers.ModelSerializer):
    """Serializer for mascot configuration"""
    
    class Meta:
        model = MascotConfiguration
        fields = [
            'id', 'name', 'tagline', 'primary_color', 'secondary_color',
            'avatar_style', 'personality_traits', 'formality_level',
            'use_emojis', 'emoji_frequency', 'greetings', 'farewell_messages',
            'encouragement_phrases', 'enable_animations', 'animation_speed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_personality_traits(self, value):
        """Ensure personality traits is a list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Personality traits must be a list")
        return value

class MascotAnimationSerializer(serializers.ModelSerializer):
    """Serializer for mascot animations"""
    
    class Meta:
        model = MascotAnimation
        fields = [
            'id', 'name', 'description', 'animation_data', 'duration',
            'trigger_events', 'is_active', 'created_at'
        ]
        read_only_fields = ['created_at']

class MascotInteractionSerializer(serializers.ModelSerializer):
    """Serializer for tracking mascot interactions"""
    
    class Meta:
        model = MascotInteraction
        fields = [
            'id', 'client', 'lead', 'interaction_type', 'user_sentiment',
            'led_to_conversion', 'interaction_duration', 'created_at'
        ]
        read_only_fields = ['created_at']

class MascotStateSerializer(serializers.Serializer):
    """Serializer for current mascot state in conversation"""
    emotion = serializers.ChoiceField(
        choices=['happy', 'excited', 'thinking', 'helpful', 'celebrating']
    )
    message = serializers.CharField()
    animation = serializers.CharField(required=False)
    quick_replies = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )