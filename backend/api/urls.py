from django.urls import path, include

urlpatterns = [
    path('auth/', include('api.users.urls')),
    path('claims/', include('api.claims.urls')),
    path('', include('api.core.urls')),
]
