from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'smartcare_app'

urlpatterns = [
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/profile/', views.get_user_profile, name='profile'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('test/', views.test_endpoint, name='test'),
]
