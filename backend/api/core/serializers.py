from rest_framework import serializers
from .models import UtilisateurProfile, Patient, Medecin


class UtilisateurProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UtilisateurProfile
        fields = "__all__"
        read_only_fields = ("user",)


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class MedecinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medecin
        fields = "__all__" 