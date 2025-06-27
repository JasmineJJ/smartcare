"""ASGI config for SmartCare project."""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smartcare.settings")

application = get_asgi_application() 