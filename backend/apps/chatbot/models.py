from django.db import models
from apps.accounts.models import Client

class Intent(models.Model):
    """Chat intent classification model"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    keywords = models.JSONField(default=list)
    
    # Training phrases
    training_phrases = models.JSONField(default=list)
    
    # Response configuration
    requires_product_search = models.BooleanField(default=False)
    requires_human_agent = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'intents'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class BotResponse(models.Model):
    """Pre-configured bot responses"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='bot_responses')
    intent = models.ForeignKey(Intent, on_delete=models.CASCADE, related_name='responses')
    
    response_text = models.TextField()
    
    # Mascot customization for this response
    mascot_emotion = models.CharField(
        max_length=20,
        choices=[
            ('happy', 'Happy'),
            ('excited', 'Excited'),
            ('thinking', 'Thinking'),
            ('helpful', 'Helpful'),
            ('celebrating', 'Celebrating'),
        ],
        default='happy'
    )
    
    # Response variations for A/B testing
    variations = models.JSONField(default=list, blank=True)
    
    # Quick replies to show after this response
    quick_replies = models.JSONField(default=list, blank=True)
    
    # Conditions
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bot_responses'
        ordering = ['-priority', 'intent']
        unique_together = ['client', 'intent', 'priority']
    
    def __str__(self):
        return f"{self.client.business_name} - {self.intent.name}"

class ChatFlow(models.Model):
    """Conversation flow templates"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='chat_flows')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Flow configuration
    trigger_intent = models.ForeignKey(Intent, on_delete=models.SET_NULL, null=True, blank=True)
    flow_steps = models.JSONField(default=list)  # List of step configurations
    
    # Mascot behavior in this flow
    mascot_personality = models.CharField(
        max_length=50,
        choices=[
            ('professional', 'Professional'),
            ('friendly', 'Friendly'),
            ('playful', 'Playful'),
            ('empathetic', 'Empathetic'),
        ],
        default='friendly'
    )
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'chat_flows'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.client.business_name} - {self.name}"

class FAQItem(models.Model):
    """Frequently Asked Questions"""
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='faq_items')
    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=100, blank=True)
    
    # Tracking
    times_asked = models.IntegerField(default=0)
    helpful_count = models.IntegerField(default=0)
    not_helpful_count = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'faq_items'
        ordering = ['order', '-times_asked']
    
    def __str__(self):
        return self.question[:100]