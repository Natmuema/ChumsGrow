"""
WhatsApp Webhook Handler for receiving and processing messages
"""
import json
import logging
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from apps.accounts.models import Client
from apps.leads.models import Lead
from apps.conversations.models import Conversation, Message
from apps.chatbot.engine import ChatbotEngine
from celery import shared_task

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def whatsapp_webhook(request):
    """Main webhook endpoint for WhatsApp Business API"""
    
    if request.method == "GET":
        # Webhook verification
        return verify_webhook(request)
    
    elif request.method == "POST":
        # Process incoming message
        return process_webhook(request)

def verify_webhook(request):
    """Verify webhook for WhatsApp Business API"""
    mode = request.GET.get('hub.mode')
    token = request.GET.get('hub.verify_token')
    challenge = request.GET.get('hub.challenge')
    
    if mode == 'subscribe' and token == settings.WHATSAPP_VERIFY_TOKEN:
        logger.info('WhatsApp webhook verified')
        return HttpResponse(challenge)
    else:
        logger.error('WhatsApp webhook verification failed')
        return HttpResponse(status=403)

def process_webhook(request):
    """Process incoming WhatsApp messages"""
    try:
        body = json.loads(request.body.decode('utf-8'))
        
        # Extract message details
        if 'entry' in body:
            for entry in body['entry']:
                for change in entry.get('changes', []):
                    value = change.get('value', {})
                    
                    # Process messages
                    if 'messages' in value:
                        for message in value['messages']:
                            process_message.delay(
                                message_data=message,
                                metadata=value.get('metadata', {})
                            )
                    
                    # Process status updates
                    if 'statuses' in value:
                        for status in value['statuses']:
                            process_status_update.delay(status)
        
        return JsonResponse({'status': 'success'})
    
    except Exception as e:
        logger.error(f'Error processing WhatsApp webhook: {str(e)}')
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@shared_task
def process_message(message_data: dict, metadata: dict):
    """Process individual WhatsApp message"""
    try:
        phone_number = message_data.get('from')
        message_id = message_data.get('id')
        message_type = message_data.get('type')
        timestamp = message_data.get('timestamp')
        
        # Get or create client (based on WhatsApp business number)
        business_number = metadata.get('phone_number_id')
        client = Client.objects.filter(whatsapp_number=business_number).first()
        
        if not client:
            logger.error(f'No client found for WhatsApp number: {business_number}')
            return
        
        # Get or create lead
        lead, created = Lead.objects.get_or_create(
            client=client,
            phone_number=phone_number,
            defaults={
                'source': 'whatsapp',
                'status': 'new',
            }
        )
        
        if created:
            logger.info(f'New lead created: {phone_number}')
        
        # Get or create conversation
        conversation = Conversation.objects.filter(
            lead=lead,
            status__in=['active', 'paused']
        ).first()
        
        if not conversation:
            conversation = Conversation.objects.create(
                lead=lead,
                status='active'
            )
        
        # Extract message content based on type
        message_content = extract_message_content(message_data)
        
        # Save incoming message
        incoming_message = Message.objects.create(
            conversation=conversation,
            sender_type='user',
            message_type=message_type,
            content=message_content,
            whatsapp_message_id=message_id,
            payload=message_data
        )
        
        # Process with chatbot engine
        chatbot = ChatbotEngine(client=client, lead=lead)
        response = chatbot.process_message(message_content, conversation)
        
        # Save bot response
        bot_message = Message.objects.create(
            conversation=conversation,
            sender_type='bot',
            message_type='text',
            content=response['response'],
            mascot_emotion=response['emotion'],
            payload={
                'quick_replies': response.get('quick_replies', []),
                'intent': response.get('intent')
            }
        )
        
        # Send response via WhatsApp
        success = chatbot.send_whatsapp_message(phone_number, response)
        
        if success:
            logger.info(f'Response sent to {phone_number}')
        else:
            logger.error(f'Failed to send response to {phone_number}')
        
        # Update lead status
        if lead.status == 'new':
            lead.status = 'contacted'
            lead.save()
    
    except Exception as e:
        logger.error(f'Error processing message: {str(e)}')
        raise

def extract_message_content(message_data: dict) -> str:
    """Extract content from different message types"""
    message_type = message_data.get('type')
    
    if message_type == 'text':
        return message_data.get('text', {}).get('body', '')
    
    elif message_type == 'image':
        caption = message_data.get('image', {}).get('caption', '')
        return f"[Image] {caption}" if caption else "[Image]"
    
    elif message_type == 'video':
        caption = message_data.get('video', {}).get('caption', '')
        return f"[Video] {caption}" if caption else "[Video]"
    
    elif message_type == 'audio':
        return "[Audio message]"
    
    elif message_type == 'document':
        filename = message_data.get('document', {}).get('filename', '')
        return f"[Document: {filename}]" if filename else "[Document]"
    
    elif message_type == 'location':
        location = message_data.get('location', {})
        return f"[Location: {location.get('latitude')}, {location.get('longitude')}]"
    
    elif message_type == 'button':
        return message_data.get('button', {}).get('text', '')
    
    elif message_type == 'interactive':
        interactive = message_data.get('interactive', {})
        if interactive.get('type') == 'button_reply':
            return interactive.get('button_reply', {}).get('title', '')
        elif interactive.get('type') == 'list_reply':
            return interactive.get('list_reply', {}).get('title', '')
    
    return "[Unsupported message type]"

@shared_task
def process_status_update(status_data: dict):
    """Process message status updates (delivered, read, etc.)"""
    try:
        message_id = status_data.get('id')
        status = status_data.get('status')
        timestamp = status_data.get('timestamp')
        
        # Update message status
        message = Message.objects.filter(whatsapp_message_id=message_id).first()
        if message:
            if status == 'read':
                message.is_read = True
                message.read_at = timestamp
                message.save()
                
                logger.info(f'Message {message_id} marked as read')
            elif status == 'delivered':
                logger.info(f'Message {message_id} delivered')
            elif status == 'failed':
                logger.error(f'Message {message_id} failed to deliver')
    
    except Exception as e:
        logger.error(f'Error processing status update: {str(e)}')

@shared_task
def send_broadcast_message(client_id: int, message_template: str, lead_filters: dict = None):
    """Send broadcast messages to multiple leads"""
    try:
        client = Client.objects.get(id=client_id)
        chatbot = ChatbotEngine(client=client)
        
        # Get leads based on filters
        leads = Lead.objects.filter(client=client)
        if lead_filters:
            if 'status' in lead_filters:
                leads = leads.filter(status=lead_filters['status'])
            if 'source' in lead_filters:
                leads = leads.filter(source=lead_filters['source'])
            if 'min_score' in lead_filters:
                leads = leads.filter(score__gte=lead_filters['min_score'])
        
        success_count = 0
        for lead in leads:
            try:
                # Personalize message
                message = message_template.replace('{name}', lead.get_full_name())
                message = message.replace('{business}', client.business_name)
                
                # Send via WhatsApp
                response = {
                    'response': message,
                    'emotion': 'happy',
                    'quick_replies': []
                }
                
                if chatbot.send_whatsapp_message(lead.phone_number, response):
                    success_count += 1
                    
                    # Log the broadcast message
                    conversation = Conversation.objects.filter(
                        lead=lead,
                        status__in=['active', 'paused']
                    ).first()
                    
                    if conversation:
                        Message.objects.create(
                            conversation=conversation,
                            sender_type='bot',
                            message_type='text',
                            content=message,
                            mascot_emotion='happy'
                        )
                
            except Exception as e:
                logger.error(f'Error sending broadcast to {lead.phone_number}: {str(e)}')
                continue
        
        logger.info(f'Broadcast sent to {success_count}/{leads.count()} leads')
        return success_count
    
    except Exception as e:
        logger.error(f'Error in broadcast task: {str(e)}')
        raise