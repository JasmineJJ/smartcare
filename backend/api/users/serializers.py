"""Serializers for user registration and profile."""
from django.contrib.auth.models import User
from rest_framework import serializers
from api.core.models import UtilisateurProfile, Beneficiaire


class BeneficiaireInputSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    first_name_ar = serializers.CharField(max_length=150, allow_blank=True)
    last_name_ar = serializers.CharField(max_length=150, allow_blank=True)
    cin = serializers.CharField(max_length=20, allow_blank=True)
    date_naissance = serializers.DateField(required=False, allow_null=True)
    sexe = serializers.ChoiceField(choices=["M", "F"], allow_blank=True)
    lien_parente = serializers.CharField(max_length=20)


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    # insurance holder fields
    numero_immatriculation = serializers.CharField(max_length=20)
    cin = serializers.CharField(max_length=20)
    sexe = serializers.CharField(max_length=1)
    date_naissance = serializers.DateField()
    adresse = serializers.CharField(allow_blank=True)
    first_name_ar = serializers.CharField(max_length=150, allow_blank=True, required=False)
    last_name_ar = serializers.CharField(max_length=150, allow_blank=True, required=False)

    beneficiaries = BeneficiaireInputSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "numero_immatriculation",
            "cin",
            "sexe",
            "date_naissance",
            "adresse",
            "first_name_ar",
            "last_name_ar",
            "beneficiaries",
        )
        extra_kwargs = {
            "email": {"required": True},
        }

    def create(self, validated_data):
        beneficiaries_data = validated_data.pop("beneficiaries", [])
        numero_immatriculation = validated_data.pop("numero_immatriculation")
        cin = validated_data.pop("cin")
        sexe = validated_data.pop("sexe")
        date_naissance = validated_data.pop("date_naissance")
        adresse = validated_data.pop("adresse")
        first_name_ar = validated_data.pop("first_name_ar", "")
        last_name_ar = validated_data.pop("last_name_ar", "")

        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # create insurance holder profile
        profile = UtilisateurProfile.objects.create(
            user=user,
            numero_immatriculation=numero_immatriculation,
            cin=cin,
            sexe=sexe,
            first_name=user.first_name,
            last_name=user.last_name,
            first_name_ar=first_name_ar,
            last_name_ar=last_name_ar,
        )

        # create beneficiaries
        for b in beneficiaries_data:
            Beneficiaire.objects.create(
                assure=profile,
                first_name=b["first_name"],
                last_name=b["last_name"],
                first_name_ar=b.get("first_name_ar", ""),
                last_name_ar=b.get("last_name_ar", ""),
                cin=b.get("cin", ""),
                date_naissance=b.get("date_naissance"),
                sexe=b.get("sexe", ""),
                lien_parente=b.get("lien_parente", ""),
            )

        return user 