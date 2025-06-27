from django.contrib import admin
from .models import UtilisateurProfile, Patient, Medecin


@admin.register(UtilisateurProfile)
class UtilisateurProfileAdmin(admin.ModelAdmin):
    list_display = ("identifiant", "first_name", "last_name", "age")
    search_fields = ("identifiant", "first_name", "last_name")


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("dossier", "first_name", "last_name", "utilisateur")
    search_fields = ("dossier", "first_name", "last_name")
    list_filter = ("maladie",)


@admin.register(Medecin)
class MedecinAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "specialite")
    search_fields = ("first_name", "last_name", "specialite") 