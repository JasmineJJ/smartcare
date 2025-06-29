from rest_framework import serializers
from .models import MedicalClaim, ClaimSection, ClaimDocument
from django.contrib.auth.models import User
from django.utils import timezone

class ClaimDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimDocument
        fields = ['id', 'file_name', 'file_size', 'file_type', 'uploaded_at']

class ClaimSectionSerializer(serializers.ModelSerializer):
    documents = ClaimDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = ClaimSection
        fields = ['section_type', 'status', 'approved_by', 'approved_at', 'comment', 'documents']

class MedicalClaimSerializer(serializers.ModelSerializer):
    sections = ClaimSectionSerializer(many=True, read_only=True)
    documents = ClaimDocumentSerializer(many=True, read_only=True)
    beneficiary_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalClaim
        fields = [
            'id', 'status', 'beneficiary_nom', 'beneficiary_prenom', 'beneficiary_name',
            'beneficiary_date_naissance', 'beneficiary_cin', 'beneficiary_sexe',
            'lien_parente', 'montant_frais', 'type_soins', 'description',
            'created_at', 'updated_at', 'submitted_at', 'cnss_reference',
            'sections', 'documents'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_beneficiary_name(self, obj):
        return f"{obj.beneficiary_prenom} {obj.beneficiary_nom}"

class CreateClaimSerializer(serializers.ModelSerializer):
    beneficiaryInfo = serializers.DictField(write_only=True)
    medicalInfo = serializers.DictField(write_only=True)
    sections = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = MedicalClaim
        fields = ['beneficiaryInfo', 'medicalInfo', 'sections']

    def create(self, validated_data):
        user = self.context['request'].user
        beneficiary_info = validated_data.pop('beneficiaryInfo')
        medical_info = validated_data.pop('medicalInfo')
        sections_data = validated_data.pop('sections', {})

        claim = MedicalClaim.objects.create(
            user=user,
            beneficiary_nom=beneficiary_info.get('nom', ''),
            beneficiary_prenom=beneficiary_info.get('prenom', ''),
            beneficiary_date_naissance=beneficiary_info.get('dateNaissance'),
            beneficiary_cin=beneficiary_info.get('cin', ''),
            beneficiary_sexe=beneficiary_info.get('sexe', ''),
            lien_parente=beneficiary_info.get('lienParente', 'conjoint'),
            montant_frais=medical_info.get('montantFrais', 0),
            type_soins=medical_info.get('typeSoins', []),
            description=medical_info.get('description', ''),
            status='submitted',
            submitted_at=timezone.now()
        )

        section_types = ['doctor', 'pharmacy', 'radiology', 'laboratory']
        for section_type in section_types:
            ClaimSection.objects.create(
                claim=claim,
                section_type=section_type,
                status='pending'
            )

        return claim
