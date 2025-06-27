"""Views for user operations."""
from rest_framework import generics, permissions
from django.contrib.auth.models import User

from .serializers import UserRegisterSerializer


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""

    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny] 