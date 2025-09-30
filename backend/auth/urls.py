
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from health import health_check


urlpatterns = [
    path('', health_check, name='health_check'),  # Root health check
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('investments.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
