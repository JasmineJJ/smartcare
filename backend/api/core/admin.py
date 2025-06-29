from django.contrib import admin
from .models import UtilisateurProfile, Medecin


@admin.register(UtilisateurProfile)
class UtilisateurProfileAdmin(admin.ModelAdmin):
    list_display = ("numero_immatriculation", "first_name", "last_name")
    search_fields = ("numero_immatriculation", "first_name", "last_name")


@admin.register(Medecin)
class MedecinAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "specialite")
    search_fields = ("first_name", "last_name", "specialite") 