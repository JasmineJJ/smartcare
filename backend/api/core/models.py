from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import RegexValidator

User = get_user_model()


class Personne(models.Model):
    """Abstract base person model."""

    # Names in French and Arabic
    first_name = models.CharField(max_length=150, verbose_name="Prénom")
    last_name = models.CharField(max_length=150, verbose_name="Nom")
    first_name_ar = models.CharField(max_length=150, verbose_name="الاسم الشخصي", blank=True)
    last_name_ar = models.CharField(max_length=150, verbose_name="الاسم العائلي", blank=True)
    
    cin = models.CharField(
        max_length=20,
        verbose_name="N° CIN / رقم بطاقة التعريف الوطنية",
        validators=[
            RegexValidator(
                regex=r"^[A-Z0-9]+$",
                message="Le CIN doit être alphanumérique en majuscules (A-Z, 0-9).",
            )
        ],
    )
    
    class Meta:
        abstract = True
        ordering = ("last_name", "first_name")

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"

    @property
    def nom_complet(self):
        return f"{self.first_name} {self.last_name}"


class UtilisateurProfile(Personne):
    """Insurance holder profile linked to auth user."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    numero_immatriculation = models.CharField(
        max_length=20, 
        unique=True, 
        verbose_name="N° Immatriculation / رقم التسجيل"
    )
    
    class Meta:
        verbose_name = "Profil Utilisateur"
        verbose_name_plural = "Profils Utilisateurs"


class EtablissementSoins(models.Model):
    """Healthcare establishment model."""
    
    nom = models.CharField(max_length=200, verbose_name="Nom de l'établissement")
    inpe_code = models.CharField(
        max_length=20, 
        verbose_name="INPE et code à barres",
        help_text="Identifiant National des Professionnels de santé et des Établissements"
    )
    adresse = models.TextField(verbose_name="Adresse")
    telephone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        verbose_name = "Établissement de soins"
        verbose_name_plural = "Établissements de soins"
    
    def __str__(self):
        return self.nom


class Medecin(Personne):
    """Medical practitioner model."""
    
    specialite = models.CharField(max_length=150, verbose_name="Spécialité")
    inpe_code = models.CharField(
        max_length=20, 
        verbose_name="INPE et code à barres",
        help_text="Identifiant National des Professionnels de santé"
    )
    etablissement = models.ForeignKey(
        EtablissementSoins, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Établissement de soins"
    )
    
    class Meta:
        verbose_name = "Médecin"
        verbose_name_plural = "Médecins"


class Beneficiaire(Personne):
    """Beneficiary of medical care."""
    
    LIEN_PARENTE_CHOICES = [
        ('conjoint', 'Conjoint / زوج'),
        ('enfant', 'Enfant / ابن'),
        ('titulaire', 'Titulaire / المؤمن له'),
    ]
    
    lien_parente = models.CharField(
        max_length=20, 
        choices=LIEN_PARENTE_CHOICES,
        verbose_name="Lien de parenté avec l'assuré(e) / علاقة القرابة بين المستفيد والمؤمن له"
    )
    inpe_code = models.CharField(
        max_length=20, 
        verbose_name="INPE et code à barres / الرقم الوطني الاستدلالي و الرقم المشفر",
        blank=True
    )
    assure = models.ForeignKey(
        UtilisateurProfile, 
        on_delete=models.CASCADE, 
        related_name="beneficiaires",
        verbose_name="Assuré(e) / المؤمن له"
    )
    
    class Meta:
        verbose_name = "Bénéficiaire de soins / المستفيد من العلاجات"
        verbose_name_plural = "Bénéficiaires de soins / المستفيد من العلاجات"


class FeuilleDesoins(models.Model):
    """Main medical care sheet model."""
    
    TYPE_SOINS_CHOICES = [
        ('maladie', 'Maladie / مرض'),
        ('maternite', 'Maternité / أمومة'),
        ('accident', 'Accident / حادثة'),
        ('hospitalisation', 'Hospitalisation / استشفاء'),
    ]
    
    TYPE_AUTORISATION_CHOICES = [
        ('entente_prealable', 'Entente préalable / موافقة مسبقة'),
        ('execution', 'Exécution / تنفيذ'),
    ]
    
    # Header information
    numero_dossier = models.CharField(max_length=50, verbose_name="N° Dossier / رقم الملف", blank=True)
    type_autorisation = models.CharField(
        max_length=20, 
        choices=TYPE_AUTORISATION_CHOICES,
        verbose_name="Type d'autorisation / نوع الترخيص"
    )
    
    # Insurance holder section
    assure = models.ForeignKey(
        UtilisateurProfile, 
        on_delete=models.CASCADE, 
        related_name="feuilles_soins",
        verbose_name="Assuré(e) / المؤمن له"
    )
    
    # Beneficiary section
    beneficiaire = models.ForeignKey(
        Beneficiaire, 
        on_delete=models.CASCADE, 
        related_name="feuilles_soins",
        verbose_name="Bénéficiaire de soins / المستفيد من العلاجات"
    )
    
    # Type of care
    type_soins = models.CharField(
        max_length=20, 
        choices=TYPE_SOINS_CHOICES,
        verbose_name="Type de soins / نوع العلاجات"
    )
    
    # Medical practitioner
    medecin_traitant = models.ForeignKey(
        Medecin, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name="Médecin traitant / الطبيب المعالج"
    )
    
    etablissement_soins = models.ForeignKey(
        EtablissementSoins, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name="Établissement de soins / المؤسسة العلاجية"
    )
    
    # Financial information
    montant_frais = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name="Montant des frais (Dhs) / مبلغ المصاريف درهم"
    )
    nombre_pieces_jointes = models.PositiveIntegerField(
        default=0,
        verbose_name="Nombre de pièces jointes / عدد الوثائق المرفقة"
    )
    
    # Dates and signatures
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    lieu_signature_assure = models.CharField(max_length=100, verbose_name="Lieu (signature assuré) / مكان توقيع المؤمن له")
    date_signature_assure = models.DateField(verbose_name="Date signature assuré / تاريخ توقيع المؤمن له")
    lieu_signature_medecin = models.CharField(max_length=100, verbose_name="Lieu (signature médecin) / مكان توقيع الطبيب")
    date_signature_medecin = models.DateField(verbose_name="Date signature médecin / تاريخ توقيع الطبيب")
    
    # Administrative section
    date_depot = models.DateField(null=True, blank=True, verbose_name="Date de dépôt du dossier / تاريخ الإيداع")
    date_arrivee = models.DateField(null=True, blank=True, verbose_name="Date d'arrivée / تاريخ الاستلام")
    identification_agent = models.CharField(max_length=100, blank=True, verbose_name="Identification de l'agent / تعريف الوكيل")
    
    class Meta:
        verbose_name = "Feuille de soins / ورقة العلاجات"
        verbose_name_plural = "Feuilles de soins / ورقة العلاجات"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"Feuille de soins #{self.numero_dossier} - {self.beneficiaire.nom_complet}"


class ActeMedical(models.Model):
    """Medical acts performed."""
    
    feuille_soins = models.ForeignKey(
        FeuilleDesoins, 
        on_delete=models.CASCADE, 
        related_name="actes_medicaux",
        verbose_name="Feuille de soins / ورقة العلاجات"
    )
    date_acte = models.DateField(verbose_name="Date des actes / تاريخ العمليات")
    code_acte = models.CharField(max_length=20, verbose_name="Code des actes / رمز العمليات")
    lettre_cle_cotation = models.CharField(
        max_length=10, 
        verbose_name="Lettre clé + cotation NGAP / معامل العمليات"
    )
    montant_facture = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        verbose_name="Montant facturé / المبلغ المفوتر"
    )
    cim_10 = models.CharField(
        max_length=10, 
        blank=True,
        verbose_name="CIM-10",
        help_text="Classification Internationale des Maladies"
    )
    medecin = models.ForeignKey(
        Medecin, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name="Médecin / الطبيب المعالج"
    )
    
    class Meta:
        verbose_name = "Acte médical / وصف العمليات المجراة"
        verbose_name_plural = "Actes médicaux / وصف العمليات المجراة"


class ActeParamedical(models.Model):
    """Paramedical acts performed."""
    
    feuille_soins = models.ForeignKey(
        FeuilleDesoins, 
        on_delete=models.CASCADE, 
        related_name="actes_paramedicaux",
        verbose_name="Feuille de soins / ورقة العلاجات"
    )
    date_acte = models.DateField(verbose_name="Date des actes / تاريخ العمليات")
    code_acte = models.CharField(max_length=20, verbose_name="Code des actes / رمز العمليات")
    lettre_cle_cotation = models.CharField(
        max_length=10, 
        verbose_name="Lettre clé + cotation NGAP / معامل العمليات"
    )
    nombre_actes = models.PositiveIntegerField(verbose_name="Nombre d'actes / عدد العمليات")
    montant_facture = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        verbose_name="Montant facturé / المبلغ المفوتر"
    )
    paramedical_inpe = models.CharField(
        max_length=20, 
        verbose_name="INPE Paramédical / رمز المساعد الطبي"
    )
    
    class Meta:
        verbose_name = "Acte paramédical / عمليات المساعدين الطبيين"
        verbose_name_plural = "Actes paramédicaux / عمليات المساعدين الطبيين"


class ActeBiologieRadiologie(models.Model):
    """Biology, radiology and imaging acts."""
    
    feuille_soins = models.ForeignKey(
        FeuilleDesoins, 
        on_delete=models.CASCADE, 
        related_name="actes_biologie_radiologie",
        verbose_name="Feuille de soins / ورقة العلاجات"
    )
    date_acte = models.DateField(verbose_name="Date des actes / تاريخ العمليات")
    code_acte = models.CharField(max_length=20, verbose_name="Code des actes / رمز العمليات")
    lettre_cle_cotation = models.CharField(
        max_length=15, 
        verbose_name="Lettre clé + cotation NGAP/NABM / معامل العمليات"
    )
    montant_facture = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        verbose_name="Montant facturé / المبلغ المفوتر"
    )
    praticien_inpe = models.CharField(
        max_length=20, 
        verbose_name="INPE Radiologue/Biologiste / رمز طبيب الأشعة أو الإحيائي"
    )
    
    class Meta:
        verbose_name = "Acte de biologie/radiologie / عمليات: الإحياء، الأشعة والصور"
        verbose_name_plural = "Actes de biologie/radiologie / عمليات: الإحياء، الأشعة والصور"


class OrdonnanceExecutee(models.Model):
    """Executed prescriptions and medical devices."""
    
    feuille_soins = models.ForeignKey(
        FeuilleDesoins, 
        on_delete=models.CASCADE, 
        related_name="ordonnances_executees",
        verbose_name="Feuille de soins / ورقة العلاجات"
    )
    date_execution = models.DateField(verbose_name="Date d'exécution / تاريخ التنفيذ")
    prix_facture = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        verbose_name="Prix facturé / الثمن المفوتر"
    )
    pharmacien_inpe = models.CharField(
        max_length=20, 
        verbose_name="INPE Pharmacien / رمز الصيدلي أو ممون التجهيزات الطبية"
    )
    
    class Meta:
        verbose_name = "Ordonnance exécutée / جرد الوصفات التي تم تنفيذها و التجهيزات الطبية الممونة"
        verbose_name_plural = "Ordonnances exécutées / جرد الوصفات التي تم تنفيذها و التجهيزات الطبية الممونة"


class PrestationNonPriseEnCharge(models.Model):
    """Services not covered by insurance."""
    
    feuille_soins = models.ForeignKey(
        FeuilleDesoins, 
        on_delete=models.CASCADE, 
        related_name="prestations_non_couvertes",
        verbose_name="Feuille de soins / ورقة العلاجات"
    )
    nature_prestation = models.CharField(
        max_length=200, 
        verbose_name="Nature de la prestation / طبيعة الخدمة"
    )
    prix_unitaire = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        verbose_name="Prix unitaire / السعر الوحدوي"
    )
    quantite = models.PositiveIntegerField(verbose_name="Quantité / الكمية")
    prix_total = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        verbose_name="Prix total / السعر الإجمالي"
    )
    
    class Meta:
        verbose_name = "Prestation non prise en charge / الخدمات غير المغطاة"
        verbose_name_plural = "Prestations non prises en charge / الخدمات غير المغطاة"
    
    def save(self, *args, **kwargs):
        # Automatically calculate total price
        self.prix_total = self.prix_unitaire * self.quantite
        super().save(*args, **kwargs)