from django.db import models
from apps.leads.models import Lead
from apps.accounts.models import User

class Conversation(models.Model):
    """Chat conversation thread model"""
    CONVERSATION_STATUS = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('transferred', 'Transferred to Human'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='conversations')
    status = models.CharField(max_length=20, choices=CONVERSATION_STATUS, default='active')
    
    # Tracking
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    last_message_at = models.DateTimeField(null=True, blank=True)
    
    # Assignment
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    transferred_at = models.DateTimeField(null=True, blank=True)
    
    # Metrics
    total_messages = models.IntegerField(default=0)
    bot_messages = models.IntegerField(default=0)
    human_messages = models.IntegerField(default=0)
    response_time_avg = models.FloatField(default=0)  # in seconds
    
    # Context
    context = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'conversations'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"Conversation {self.id} - {self.lead.get_full_name()}"

class Message(models.Model):
    """Individual message in conversation"""
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('document', 'Document'),
        ('location', 'Location'),
        ('product', 'Product Card'),
        ('carousel', 'Product Carousel'),
        ('buttons', 'Quick Reply Buttons'),
        ('payment', 'Payment Link'),
    ]
    
    SENDER_TYPES = [
        ('bot', 'Bot'),
        ('user', 'User'),
        ('agent', 'Agent'),
        ('system', 'System'),
    ]
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender_type = models.CharField(max_length=10, choices=SENDER_TYPES)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    
    # Content
    content = models.TextField()
    media_url = models.URLField(blank=True, null=True)
    
    # For structured messages
    payload = models.JSONField(default=dict, blank=True)
    
    # WhatsApp specific
    whatsapp_message_id = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Mascot emotion (for bot messages)
    mascot_emotion = models.CharField(
        max_length=20,
        choices=[
            ('happy', 'Happy'),
            ('excited', 'Excited'),
            ('thinking', 'Thinking'),
            ('helpful', 'Helpful'),
            ('celebrating', 'Celebrating'),
        ],
        default='happy',
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender_type}: {self.content[:50]}..."

class QuickReply(models.Model):
    """Quick reply options for messages"""
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='quick_replies')
    text = models.CharField(max_length=100)
    payload = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'quick_replies'
        ordering = ['order']