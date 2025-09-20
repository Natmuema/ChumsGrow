# Implementation Guide - LeadNurtureBot
## React & Django Technical Specifications

---

## 1. Project Structure

### 1.1 Django Backend Structure
```
leadnurturebot-backend/
├── manage.py
├── requirements.txt
├── .env.example
├── docker-compose.yml
├── Dockerfile
│
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── __init__.py
│   ├── accounts/
│   │   ├── models.py         # Client, User models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── permissions.py
│   │
│   ├── leads/
│   │   ├── models.py         # Lead, LeadScore models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── services.py       # Lead scoring logic
│   │
│   ├── conversations/
│   │   ├── models.py         # Conversation, Message models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── consumers.py      # WebSocket handlers
│   │   └── routing.py
│   │
│   ├── chatbot/
│   │   ├── models.py         # BotResponse, Intent models
│   │   ├── engine.py         # Core chatbot logic
│   │   ├── nlp/
│   │   │   ├── processor.py
│   │   │   ├── intent_classifier.py
│   │   │   └── entity_extractor.py
│   │   └── handlers/
│   │       ├── product_handler.py
│   │       ├── order_handler.py
│   │       └── faq_handler.py
│   │
│   ├── products/
│   │   ├── models.py         # Product, Category models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── recommender.py    # ML recommendation engine
│   │
│   ├── orders/
│   │   ├── models.py         # Order, OrderItem models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── payment.py        # Payment processing
│   │
│   ├── analytics/
│   │   ├── models.py         # Analytics models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── metrics.py        # Metrics calculation
│   │
│   └── integrations/
│       ├── whatsapp/
│       │   ├── client.py     # WhatsApp API client
│       │   ├── webhooks.py   # Webhook handlers
│       │   └── utils.py
│       ├── shopify/
│       │   └── client.py
│       └── payment/
│           ├── stripe.py
│           └── paypal.py
│
├── core/
│   ├── __init__.py
│   ├── exceptions.py
│   ├── middleware.py
│   ├── utils.py
│   └── validators.py
│
├── static/
├── media/
├── templates/
└── tests/
    ├── test_leads/
    ├── test_chatbot/
    └── test_integrations/
```

### 1.2 React Frontend Structure
```
leadnurturebot-frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
│
├── public/
│   ├── index.html
│   └── assets/
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── LoadingSpinner/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardWidget/
│   │   │   ├── MetricsCard/
│   │   │   ├── ConversionFunnel/
│   │   │   └── RevenueChart/
│   │   │
│   │   ├── conversations/
│   │   │   ├── ConversationList/
│   │   │   ├── MessageBubble/
│   │   │   ├── ChatWindow/
│   │   │   └── QuickReplies/
│   │   │
│   │   ├── leads/
│   │   │   ├── LeadTable/
│   │   │   ├── LeadDetails/
│   │   │   ├── LeadScore/
│   │   │   └── LeadFilters/
│   │   │
│   │   └── analytics/
│   │       ├── AnalyticsChart/
│   │       ├── ReportGenerator/
│   │       └── MetricsGrid/
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Conversations/
│   │   ├── Leads/
│   │   ├── Products/
│   │   ├── Analytics/
│   │   ├── Settings/
│   │   └── Login/
│   │
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   ├── useAuth.ts
│   │   ├── useAnalytics.ts
│   │   └── useNotifications.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── leads.ts
│   │   │   ├── conversations.ts
│   │   │   └── analytics.ts
│   │   └── websocket/
│   │       └── client.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── conversationSlice.ts
│   │   │   ├── leadSlice.ts
│   │   │   └── analyticsSlice.ts
│   │   └── middleware/
│   │       └── websocket.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── store.ts
│   │
│   └── styles/
│       ├── globals.css
│       ├── variables.css
│       └── components/
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 2. Key Implementation Files

### 2.1 Django Requirements (requirements.txt)
```txt
# Core
Django==4.2.5
djangorestframework==3.14.0
django-cors-headers==4.2.0
python-decouple==3.8
celery==5.3.1
redis==4.6.0

# Database
psycopg2-binary==2.9.7
django-redis==5.3.0

# Authentication
djangorestframework-simplejwt==5.3.0
django-allauth==0.54.0

# WebSocket
channels==4.0.0
channels-redis==4.1.0
daphne==4.0.0

# WhatsApp Integration
twilio==8.5.0
requests==2.31.0
python-whatsapp-business-api-client==0.5.0

# NLP & ML
spacy==3.6.1
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.25.2
nltk==3.8.1

# API Documentation
drf-spectacular==0.26.4

# Testing
pytest==7.4.0
pytest-django==4.5.2
factory-boy==3.3.0
faker==19.3.0

# Monitoring
django-prometheus==2.3.1
sentry-sdk==1.29.2

# Utils
Pillow==10.0.0
python-dateutil==2.8.2
pytz==2023.3
```

### 2.2 React Package.json
```json
{
  "name": "leadnurturebot-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.2",
    "axios": "^1.4.0",
    "socket.io-client": "^4.5.1",
    "@mui/material": "^5.14.5",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "recharts": "^2.7.3",
    "react-hook-form": "^7.45.4",
    "date-fns": "^2.30.0",
    "react-query": "^3.39.3",
    "react-hot-toast": "^2.4.1",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.17.0",
    "jest": "^29.6.2",
    "jest-environment-jsdom": "^29.6.2"
  }
}
```

### 2.3 Django Settings (config/settings/base.py)
```python
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'channels',
    'drf_spectacular',
    'django_celery_beat',
]

LOCAL_APPS = [
    'apps.accounts',
    'apps.leads',
    'apps.conversations',
    'apps.chatbot',
    'apps.products',
    'apps.orders',
    'apps.analytics',
    'apps.integrations',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': config('REDIS_URL', default='redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Channels
ASGI_APPLICATION = 'config.asgi.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [config('REDIS_URL', default='redis://127.0.0.1:6379/0')],
        },
    },
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# Celery
CELERY_BROKER_URL = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

# WhatsApp Configuration
WHATSAPP_API_URL = config('WHATSAPP_API_URL')
WHATSAPP_API_TOKEN = config('WHATSAPP_API_TOKEN')
WHATSAPP_PHONE_NUMBER = config('WHATSAPP_PHONE_NUMBER')

# CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### 2.4 React API Client (services/api/client.ts)
```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await this.post('/auth/refresh/', { 
                refresh: refreshToken 
              });
              localStorage.setItem('access_token', response.data.access);
              // Retry original request
              error.config.headers.Authorization = `Bearer ${response.data.access}`;
              return this.axiosInstance(error.config);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.clear();
              window.location.href = '/login';
            }
          }
        }
        
        // Show error toast
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

export default new ApiClient();
```

### 2.5 Django WhatsApp Integration (apps/integrations/whatsapp/client.py)
```python
import logging
from typing import Dict, Any, Optional
import requests
from django.conf import settings
from celery import shared_task

logger = logging.getLogger(__name__)

class WhatsAppClient:
    """WhatsApp Business API Client"""
    
    def __init__(self):
        self.api_url = settings.WHATSAPP_API_URL
        self.api_token = settings.WHATSAPP_API_TOKEN
        self.phone_number = settings.WHATSAPP_PHONE_NUMBER
        
    def send_message(self, to_number: str, message: str, 
                    media_url: Optional[str] = None) -> Dict[str, Any]:
        """Send a WhatsApp message"""
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'messaging_product': 'whatsapp',
            'to': to_number,
            'type': 'text',
            'text': {'body': message}
        }
        
        if media_url:
            payload['type'] = 'image'
            payload['image'] = {'link': media_url}
            
        try:
            response = requests.post(
                f'{self.api_url}/messages',
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f'WhatsApp API error: {e}')
            raise
            
    def send_template_message(self, to_number: str, template_name: str,
                            parameters: list) -> Dict[str, Any]:
        """Send a template message"""
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'messaging_product': 'whatsapp',
            'to': to_number,
            'type': 'template',
            'template': {
                'name': template_name,
                'language': {'code': 'en_US'},
                'components': [
                    {
                        'type': 'body',
                        'parameters': parameters
                    }
                ]
            }
        }
        
        try:
            response = requests.post(
                f'{self.api_url}/messages',
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f'WhatsApp template error: {e}')
            raise
            
    def send_interactive_message(self, to_number: str, body: str,
                                buttons: list) -> Dict[str, Any]:
        """Send interactive message with buttons"""
        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'messaging_product': 'whatsapp',
            'to': to_number,
            'type': 'interactive',
            'interactive': {
                'type': 'button',
                'body': {'text': body},
                'action': {
                    'buttons': buttons
                }
            }
        }
        
        try:
            response = requests.post(
                f'{self.api_url}/messages',
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f'WhatsApp interactive message error: {e}')
            raise

@shared_task
def send_whatsapp_message_task(to_number: str, message: str):
    """Celery task to send WhatsApp message"""
    client = WhatsAppClient()
    return client.send_message(to_number, message)
```

### 2.6 React WebSocket Hook (hooks/useWebSocket.ts)
```typescript
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addMessage, updateConversation } from '../store/slices/conversationSlice';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

interface WebSocketMessage {
  type: string;
  payload: any;
}

export const useWebSocket = (conversationId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  
  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token');
    
    socketRef.current = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    
    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      
      if (conversationId) {
        socketRef.current?.emit('join_conversation', { conversationId });
      }
    });
    
    socketRef.current.on('new_message', (data: WebSocketMessage) => {
      dispatch(addMessage(data.payload));
    });
    
    socketRef.current.on('conversation_update', (data: WebSocketMessage) => {
      dispatch(updateConversation(data.payload));
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
    
    socketRef.current.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }, [conversationId, dispatch]);
  
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);
  
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', message);
    }
  }, []);
  
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    socket: socketRef.current,
    sendMessage,
    connect,
    disconnect,
  };
};
```

---

## 3. Docker Configuration

### 3.1 Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy application
COPY . .

# Run migrations and collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]
```

### 3.2 Docker Compose
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: leadnurturebot
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./leadnurturebot-backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./leadnurturebot-backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DEBUG=True
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/leadnurturebot
      - REDIS_URL=redis://redis:6379/0

  celery:
    build: ./leadnurturebot-backend
    command: celery -A config worker -l info
    volumes:
      - ./leadnurturebot-backend:/app
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/leadnurturebot
      - REDIS_URL=redis://redis:6379/0

  celery-beat:
    build: ./leadnurturebot-backend
    command: celery -A config beat -l info
    volumes:
      - ./leadnurturebot-backend:/app
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/leadnurturebot
      - REDIS_URL=redis://redis:6379/0

  frontend:
    build: ./leadnurturebot-frontend
    volumes:
      - ./leadnurturebot-frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api/v1
      - VITE_WS_URL=ws://localhost:8000

volumes:
  postgres_data:
```

---

## 4. Quick Start Guide

### 4.1 Backend Setup
```bash
# Clone repository
git clone https://github.com/your-org/leadnurturebot-backend.git
cd leadnurturebot-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### 4.2 Frontend Setup
```bash
# Clone repository
git clone https://github.com/your-org/leadnurturebot-frontend.git
cd leadnurturebot-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

### 4.3 Docker Setup
```bash
# Clone both repositories
git clone https://github.com/your-org/leadnurturebot-backend.git
git clone https://github.com/your-org/leadnurturebot-frontend.git

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# View logs
docker-compose logs -f
```

---

This implementation guide provides the technical foundation for building LeadNurtureBot with React and Django. The structure is scalable, maintainable, and follows best practices for both frameworks.