from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from .models import UtilisateurProfile

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    # Profile fields
    first_name_ar = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name_ar = serializers.CharField(max_length=150, required=False, allow_blank=True)
    cin = serializers.CharField(
        max_length=20,
        validators=[RegexValidator(r'^[A-Z0-9]+$', 'CIN must contain only letters and numbers')]
    )
    date_naissance = serializers.DateField()
    sexe = serializers.ChoiceField(choices=[('M', 'Masculin'), ('F', 'Féminin')])
    adresse = serializers.CharField()
    numero_immatriculation = serializers.CharField(max_length=20)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'first_name_ar', 'last_name_ar',
            'cin', 'date_naissance', 'sexe', 'adresse', 'numero_immatriculation'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs

    def validate_numero_immatriculation(self, value):
        if UtilisateurProfile.objects.filter(numero_immatriculation=value).exists():
            raise serializers.ValidationError("Ce numéro d'immatriculation existe déjà.")
        return value

    def validate_cin(self, value):
        if UtilisateurProfile.objects.filter(cin=value).exists():
            raise serializers.ValidationError("Ce numéro de CIN existe déjà.")
        return value

    def create(self, validated_data):
        # Remove password_confirm and profile fields
        password = validated_data.pop('password')
        validated_data.pop('password_confirm')
        
        # Extract profile fields
        profile_fields = {
            'first_name_ar': validated_data.pop('first_name_ar', ''),
            'last_name_ar': validated_data.pop('last_name_ar', ''),
            'cin': validated_data.pop('cin'),
            'date_naissance': validated_data.pop('date_naissance'),
            'sexe': validated_data.pop('sexe'),
            'adresse': validated_data.pop('adresse'),
            'numero_immatriculation': validated_data.pop('numero_immatriculation'),
        }

        # Create user
        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        # Create profile
        UtilisateurProfile.objects.create(
            user=user,
            first_name=user.first_name,
            last_name=user.last_name,
            **profile_fields
        )

        return user