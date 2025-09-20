from django.db import models
from apps.accounts.models import Client

class MascotConfiguration(models.Model):
    """Mascot configuration and personality settings"""
    client = models.OneToOneField(Client, on_delete=models.CASCADE, related_name='mascot_config')
    
    # Basic info
    name = models.CharField(max_length=50, default='Nurty')
    tagline = models.CharField(max_length=200, default="Your AI Shopping Assistant")
    
    # Appearance
    primary_color = models.CharField(max_length=7, default='#6366F1')  # Hex color
    secondary_color = models.CharField(max_length=7, default='#8B5CF6')
    avatar_style = models.CharField(
        max_length=20,
        choices=[
            ('robot', 'Robot'),
            ('animal', 'Animal'),
            ('character', 'Character'),
            ('abstract', 'Abstract'),
        ],
        default='robot'
    )
    
    # Personality traits
    personality_traits = models.JSONField(
        default=list,
        help_text="List of personality traits like: friendly, professional, humorous"
    )
    
    # Communication style
    formality_level = models.IntegerField(
        default=3,
        help_text="1=Very Casual, 5=Very Formal"
    )
    use_emojis = models.BooleanField(default=True)
    emoji_frequency = models.CharField(
        max_length=20,
        choices=[
            ('never', 'Never'),
            ('rarely', 'Rarely'),
            ('sometimes', 'Sometimes'),
            ('often', 'Often'),
            ('always', 'Always'),
        ],
        default='sometimes'
    )
    
    # Greetings and phrases
    greetings = models.JSONField(
        default=list,
        help_text="List of greeting messages"
    )
    farewell_messages = models.JSONField(
        default=list,
        help_text="List of farewell messages"
    )
    encouragement_phrases = models.JSONField(
        default=list,
        help_text="Phrases to encourage purchases"
    )
    
    # Animation settings
    enable_animations = models.BooleanField(default=True)
    animation_speed = models.CharField(
        max_length=20,
        choices=[
            ('slow', 'Slow'),
            ('normal', 'Normal'),
            ('fast', 'Fast'),
        ],
        default='normal'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'mascot_configurations'
    
    def __str__(self):
        return f"{self.client.business_name} - {self.name}"
    
    def get_greeting(self):
        """Get a random greeting"""
        import random
        if self.greetings:
            return random.choice(self.greetings)
        return f"Hi! I'm {self.name} 🤖"
    
    def get_farewell(self):
        """Get a random farewell message"""
        import random
        if self.farewell_messages:
            return random.choice(self.farewell_messages)
        return "Thanks for chatting! Have a great day! 👋"

class MascotAnimation(models.Model):
    """Predefined mascot animations"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    animation_data = models.JSONField()  # Lottie or CSS animation data
    duration = models.FloatField(default=1.0)  # in seconds
    
    # When to use this animation
    trigger_events = models.JSONField(
        default=list,
        help_text="Events that trigger this animation: greeting, thinking, celebrating, etc."
    )
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mascot_animations'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class MascotInteraction(models.Model):
    """Track mascot interactions for analytics"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='mascot_interactions')
    lead = models.ForeignKey('leads.Lead', on_delete=models.CASCADE, null=True, blank=True)
    
    interaction_type = models.CharField(
        max_length=50,
        choices=[
            ('greeting', 'Greeting'),
            ('product_recommendation', 'Product Recommendation'),
            ('answer_question', 'Answer Question'),
            ('celebration', 'Celebration'),
            ('encouragement', 'Encouragement'),
            ('farewell', 'Farewell'),
        ]
    )
    
    # User response
    user_sentiment = models.CharField(
        max_length=20,
        choices=[
            ('positive', 'Positive'),
            ('neutral', 'Neutral'),
            ('negative', 'Negative'),
        ],
        null=True,
        blank=True
    )
    
    # Effectiveness
    led_to_conversion = models.BooleanField(default=False)
    interaction_duration = models.IntegerField(default=0)  # in seconds
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mascot_interactions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.interaction_type} - {self.created_at}"