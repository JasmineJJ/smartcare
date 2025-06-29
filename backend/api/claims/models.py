from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime

class MedicalClaim(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under-review', 'Under Review'),
        ('pending-approval', 'Pending Approval'),
        ('approved', 'Approved'),
        ('in-processing', 'In Processing'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    TYPE_SOINS_CHOICES = [
        ('maladie', 'Maladie'),
        ('maternite', 'Maternité'),
        ('accident', 'Accident'),
        ('hospitalisation', 'Hospitalisation'),
    ]

    LIEN_PARENTE_CHOICES = [
        ('conjoint', 'Conjoint'),
        ('enfant', 'Enfant'),
    ]

    SEXE_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]

    # Primary fields
    id = models.CharField(max_length=20, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_claims')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Beneficiary information
    beneficiary_nom = models.CharField(max_length=100)
    beneficiary_prenom = models.CharField(max_length=100)
    beneficiary_date_naissance = models.DateField()
    beneficiary_cin = models.CharField(max_length=20)
    beneficiary_sexe = models.CharField(max_length=1, choices=SEXE_CHOICES)
    lien_parente = models.CharField(max_length=20, choices=LIEN_PARENTE_CHOICES)
    
    # Medical information
    montant_frais = models.DecimalField(max_digits=10, decimal_places=2)
    type_soins = models.JSONField(default=list)
    description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    
    # CNSS processing
    cnss_reference = models.CharField(max_length=50, blank=True)
    processing_notes = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        if not self.id:
            year = datetime.now().year
            count = MedicalClaim.objects.filter(
                created_at__year=year
            ).count() + 1
            self.id = f"CLM-{year}-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Medical Claim {self.id} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']


class ClaimSection(models.Model):
    SECTION_TYPES = [
        ('doctor', 'Doctor'),
        ('pharmacy', 'Pharmacy'),
        ('radiology', 'Radiology'),
        ('laboratory', 'Laboratory'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    claim = models.ForeignKey(MedicalClaim, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['claim', 'section_type']


class ClaimDocument(models.Model):
    claim = models.ForeignKey(MedicalClaim, on_delete=models.CASCADE, related_name='documents')
    section = models.ForeignKey(ClaimSection, on_delete=models.CASCADE, related_name='documents')
    
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    file_size = models.IntegerField()
    file_type = models.CharField(max_length=50)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.file_name} - {self.claim.id}"
