from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["GET", "POST"])
def test_api(request):
    """Test API endpoint"""
    if request.method == 'GET':
        return JsonResponse({
            'status': 'success',
            'message': 'API is working!',
            'method': 'GET'
        })
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else {}
            return JsonResponse({
                'status': 'success',
                'message': 'POST request received',
                'data': data
            })
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON'
            }, status=400)
