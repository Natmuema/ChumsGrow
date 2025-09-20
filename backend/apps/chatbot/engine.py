"""
Chatbot Engine - Core logic for processing messages and generating responses
"""
import re
import json
import random
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timedelta
from django.conf import settings
from apps.leads.models import Lead
from apps.conversations.models import Conversation, Message
from apps.chatbot.models import Intent, BotResponse, FAQItem
from apps.mascot.models import MascotConfiguration, MascotInteraction
from apps.integrations.whatsapp.client import WhatsAppClient

class ChatbotEngine:
    """Main chatbot processing engine with mascot integration"""
    
    def __init__(self, client, lead: Lead = None):
        self.client = client
        self.lead = lead
        self.whatsapp_client = WhatsAppClient()
        self.mascot_config = self._get_mascot_config()
        
    def _get_mascot_config(self) -> MascotConfiguration:
        """Get or create mascot configuration for client"""
        config, created = MascotConfiguration.objects.get_or_create(
            client=self.client,
            defaults={
                'name': 'Nurty',
                'personality_traits': ['friendly', 'helpful', 'enthusiastic'],
                'greetings': [
                    f"Hi! I'm {settings.MASCOT_NAME} 🤖, your personal shopping assistant!",
                    f"Hello! Welcome to {self.client.business_name}! How can I help you today? 😊",
                    f"Hey there! I'm {settings.MASCOT_NAME}, ready to help you find amazing products! 🛍️"
                ],
                'use_emojis': True,
            }
        )
        return config
    
    def process_message(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Process incoming message and generate response"""
        
        # Detect intent
        intent = self._detect_intent(message_text)
        
        # Get appropriate emotion for mascot
        emotion = self._get_mascot_emotion(intent)
        
        # Generate response based on intent
        response = self._generate_response(intent, message_text, conversation)
        
        # Track mascot interaction
        self._track_interaction(intent, emotion, conversation)
        
        # Update lead engagement
        self._update_lead_engagement(conversation)
        
        return {
            'response': response['text'],
            'emotion': emotion,
            'quick_replies': response.get('quick_replies', []),
            'media': response.get('media'),
            'products': response.get('products', []),
            'intent': intent.name if intent else 'unknown',
        }
    
    def _detect_intent(self, message_text: str) -> Optional[Intent]:
        """Detect user intent from message"""
        message_lower = message_text.lower()
        
        # Check for greeting
        greeting_patterns = ['hi', 'hello', 'hey', 'good morning', 'good afternoon']
        if any(pattern in message_lower for pattern in greeting_patterns):
            return self._get_or_create_intent('greeting')
        
        # Check for product inquiry
        product_patterns = ['product', 'show', 'catalog', 'items', 'collection', 'available']
        if any(pattern in message_lower for pattern in product_patterns):
            return self._get_or_create_intent('product_inquiry')
        
        # Check for price inquiry
        price_patterns = ['price', 'cost', 'how much', 'expensive', 'cheap', 'discount']
        if any(pattern in message_lower for pattern in price_patterns):
            return self._get_or_create_intent('price_inquiry')
        
        # Check for order tracking
        order_patterns = ['order', 'track', 'shipping', 'delivery', 'status']
        if any(pattern in message_lower for pattern in order_patterns):
            return self._get_or_create_intent('order_tracking')
        
        # Check for help request
        help_patterns = ['help', 'assist', 'support', 'question', 'problem']
        if any(pattern in message_lower for pattern in help_patterns):
            return self._get_or_create_intent('help_request')
        
        # Check for purchase intent
        purchase_patterns = ['buy', 'purchase', 'order', 'want', 'add to cart']
        if any(pattern in message_lower for pattern in purchase_patterns):
            return self._get_or_create_intent('purchase_intent')
        
        # Default to general inquiry
        return self._get_or_create_intent('general_inquiry')
    
    def _get_or_create_intent(self, intent_name: str) -> Intent:
        """Get or create an intent"""
        intent, created = Intent.objects.get_or_create(
            name=intent_name,
            defaults={'description': f'Intent for {intent_name.replace("_", " ")}'}
        )
        return intent
    
    def _get_mascot_emotion(self, intent: Optional[Intent]) -> str:
        """Determine mascot emotion based on intent"""
        if not intent:
            return 'thinking'
        
        emotion_map = {
            'greeting': 'happy',
            'product_inquiry': 'excited',
            'price_inquiry': 'helpful',
            'order_tracking': 'thinking',
            'help_request': 'helpful',
            'purchase_intent': 'celebrating',
            'general_inquiry': 'happy',
        }
        
        return emotion_map.get(intent.name, 'happy')
    
    def _generate_response(self, intent: Optional[Intent], message_text: str, 
                          conversation: Conversation) -> Dict[str, Any]:
        """Generate response based on intent"""
        
        if not intent:
            return self._get_default_response()
        
        # Try to get custom response for this client and intent
        try:
            bot_response = BotResponse.objects.filter(
                client=self.client,
                intent=intent,
                is_active=True
            ).order_by('-priority').first()
            
            if bot_response:
                return {
                    'text': self._personalize_response(bot_response.response_text),
                    'quick_replies': bot_response.quick_replies,
                }
        except BotResponse.DoesNotExist:
            pass
        
        # Generate response based on intent type
        response_generators = {
            'greeting': self._generate_greeting_response,
            'product_inquiry': self._generate_product_response,
            'price_inquiry': self._generate_price_response,
            'order_tracking': self._generate_order_response,
            'help_request': self._generate_help_response,
            'purchase_intent': self._generate_purchase_response,
            'general_inquiry': self._generate_general_response,
        }
        
        generator = response_generators.get(intent.name, self._generate_general_response)
        return generator(message_text, conversation)
    
    def _generate_greeting_response(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Generate greeting response"""
        greeting = random.choice(self.mascot_config.greetings) if self.mascot_config.greetings else f"Hi! I'm {self.mascot_config.name}!"
        
        return {
            'text': greeting,
            'quick_replies': [
                {'text': '🛍️ Show Products', 'payload': 'show_products'},
                {'text': '📦 Track Order', 'payload': 'track_order'},
                {'text': '❓ FAQ', 'payload': 'show_faq'},
                {'text': '💬 Talk to Human', 'payload': 'request_agent'},
            ]
        }
    
    def _generate_product_response(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Generate product inquiry response"""
        # This would integrate with your product catalog
        response_text = f"Great! Let me show you our amazing collection! 🌟\n\n"
        response_text += "We have:\n"
        response_text += "👕 T-Shirts & Tops\n"
        response_text += "👗 Dresses & Skirts\n"
        response_text += "👖 Pants & Jeans\n"
        response_text += "👟 Shoes & Accessories\n\n"
        response_text += "What category interests you?"
        
        return {
            'text': response_text,
            'quick_replies': [
                {'text': 'T-Shirts', 'payload': 'category_tshirts'},
                {'text': 'Dresses', 'payload': 'category_dresses'},
                {'text': 'Pants', 'payload': 'category_pants'},
                {'text': 'Accessories', 'payload': 'category_accessories'},
            ]
        }
    
    def _generate_price_response(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Generate price inquiry response"""
        return {
            'text': "Our prices are very competitive! 💰\n\n• Most items range from $20-$100\n• Free shipping on orders over $50\n• 10% off for first-time customers!\n\nWould you like to see products in a specific price range?",
            'quick_replies': [
                {'text': 'Under $30', 'payload': 'price_under_30'},
                {'text': '$30-$50', 'payload': 'price_30_50'},
                {'text': '$50-$100', 'payload': 'price_50_100'},
                {'text': 'Show All', 'payload': 'show_all_products'},
            ]
        }
    
    def _generate_order_response(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Generate order tracking response"""
        return {
            'text': "I can help you track your order! 📦\n\nPlease provide your order number or the phone number used for the order.",
            'quick_replies': [
                {'text': 'Enter Order Number', 'payload': 'enter_order_number'},
                {'text': 'Recent Orders', 'payload': 'show_recent_orders'},
                {'text': 'Contact Support', 'payload': 'contact_support'},
            ]
        }
    
    def _generate_help_response(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Generate help response"""
        return {
            'text': f"I'm {self.mascot_config.name}, and I'm here to help! 😊\n\nI can assist you with:\n• Finding products\n• Checking prices\n• Tracking orders\n• Returns & exchanges\n• General questions\n\nWhat would you like help with?",
            'quick_replies': [
                {'text': 'Shopping Help', 'payload': 'help_shopping'},
                {'text': 'Order Help', 'payload': 'help_orders'},
                {'text': 'Returns', 'payload': 'help_returns'},
                {'text': 'Talk to Human', 'payload': 'request_agent'},
            ]
        }
    
    def _generate_purchase_response(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Generate purchase intent response"""
        encouragement = random.choice(self.mascot_config.encouragement_phrases) if self.mascot_config.encouragement_phrases else "Great choice!"
        
        return {
            'text': f"{encouragement} 🎉\n\nLet me help you complete your purchase. Which product are you interested in?",
            'quick_replies': [
                {'text': 'View Cart', 'payload': 'view_cart'},
                {'text': 'Continue Shopping', 'payload': 'continue_shopping'},
                {'text': 'Checkout', 'payload': 'checkout'},
            ]
        }
    
    def _generate_general_response(self, message_text: str, conversation: Conversation) -> Dict[str, Any]:
        """Generate general response"""
        return {
            'text': "That's interesting! Let me help you find what you're looking for. Are you interested in browsing our products or do you have a specific question?",
            'quick_replies': [
                {'text': 'Browse Products', 'payload': 'show_products'},
                {'text': 'Ask Question', 'payload': 'ask_question'},
                {'text': 'Talk to Human', 'payload': 'request_agent'},
            ]
        }
    
    def _get_default_response(self) -> Dict[str, Any]:
        """Get default response when intent cannot be determined"""
        return {
            'text': "I'm not quite sure I understand. Could you please rephrase or choose from these options?",
            'quick_replies': [
                {'text': 'Show Products', 'payload': 'show_products'},
                {'text': 'Help', 'payload': 'help'},
                {'text': 'Talk to Human', 'payload': 'request_agent'},
            ]
        }
    
    def _personalize_response(self, text: str) -> str:
        """Personalize response text with lead information"""
        if self.lead and self.lead.first_name:
            text = text.replace('{name}', self.lead.first_name)
        else:
            text = text.replace('{name}', 'there')
        
        text = text.replace('{business}', self.client.business_name)
        text = text.replace('{mascot}', self.mascot_config.name)
        
        # Add emojis if configured
        if self.mascot_config.use_emojis and self.mascot_config.emoji_frequency in ['often', 'always']:
            if not any(emoji in text for emoji in ['😊', '🤖', '🛍️', '💰', '📦', '🎉', '✨', '🌟']):
                text += ' 😊'
        
        return text
    
    def _track_interaction(self, intent: Optional[Intent], emotion: str, conversation: Conversation):
        """Track mascot interaction for analytics"""
        interaction_type_map = {
            'greeting': 'greeting',
            'product_inquiry': 'product_recommendation',
            'price_inquiry': 'answer_question',
            'purchase_intent': 'encouragement',
            'help_request': 'answer_question',
        }
        
        interaction_type = interaction_type_map.get(intent.name if intent else '', 'answer_question')
        
        MascotInteraction.objects.create(
            client=self.client,
            lead=self.lead,
            interaction_type=interaction_type,
            interaction_duration=0,  # Will be updated when conversation ends
        )
    
    def _update_lead_engagement(self, conversation: Conversation):
        """Update lead engagement metrics"""
        if self.lead:
            self.lead.total_messages += 1
            self.lead.last_interaction = datetime.now()
            self.lead.calculate_score()
            self.lead.save()
            
            # Update conversation metrics
            conversation.total_messages += 1
            conversation.bot_messages += 1
            conversation.last_message_at = datetime.now()
            conversation.save()
    
    def send_whatsapp_message(self, phone_number: str, response: Dict[str, Any]) -> bool:
        """Send response via WhatsApp"""
        try:
            # Send main message
            self.whatsapp_client.send_message(
                to_number=phone_number,
                message=response['response'],
                media_url=response.get('media')
            )
            
            # Send quick replies if available
            if response.get('quick_replies'):
                buttons = [
                    {
                        'type': 'reply',
                        'reply': {
                            'id': reply.get('payload', f"reply_{i}"),
                            'title': reply['text'][:20]  # WhatsApp button text limit
                        }
                    }
                    for i, reply in enumerate(response['quick_replies'][:3])  # WhatsApp allows max 3 buttons
                ]
                
                self.whatsapp_client.send_interactive_message(
                    to_number=phone_number,
                    body="Choose an option:",
                    buttons=buttons
                )
            
            return True
        except Exception as e:
            print(f"Error sending WhatsApp message: {e}")
            return False