from django.contrib import admin
from .models import MedicalClaim, ClaimSection, ClaimDocument

@admin.register(MedicalClaim)
class MedicalClaimAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'montant_frais', 'created_at', 'beneficiary_name']
    list_filter = ['status', 'type_soins', 'created_at']
    search_fields = ['id', 'user__username', 'beneficiary_nom', 'beneficiary_cin']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def beneficiary_name(self, obj):
        return f"{obj.beneficiary_prenom} {obj.beneficiary_nom}"
    beneficiary_name.short_description = 'Bénéficiaire'

@admin.register(ClaimSection)
class ClaimSectionAdmin(admin.ModelAdmin):
    list_display = ['claim', 'section_type', 'status', 'approved_by', 'approved_at']
    list_filter = ['section_type', 'status', 'approved_at']
    search_fields = ['claim__id', 'claim__user__username']

@admin.register(ClaimDocument)
class ClaimDocumentAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'claim', 'section', 'file_size', 'uploaded_at']
    list_filter = ['section__section_type', 'uploaded_at']
    search_fields = ['file_name', 'claim__id']
