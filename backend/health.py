from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def health_check(request):
    """Simple health check endpoint for Vercel"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Django backend is running on Vercel'
    })
