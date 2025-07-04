# Generated by Django 4.2.23 on 2025-06-29 16:27

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Beneficiaire',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=150, verbose_name='Prénom')),
                ('last_name', models.CharField(max_length=150, verbose_name='Nom')),
                ('first_name_ar', models.CharField(blank=True, max_length=150, verbose_name='الاسم الشخصي')),
                ('last_name_ar', models.CharField(blank=True, max_length=150, verbose_name='الاسم العائلي')),
                ('cin', models.CharField(max_length=20, validators=[django.core.validators.RegexValidator(message='Le CIN doit être alphanumérique en majuscules (A-Z, 0-9).', regex='^[A-Z0-9]+$')], verbose_name='N° CIN / رقم بطاقة التعريف الوطنية')),
                ('lien_parente', models.CharField(choices=[('conjoint', 'Conjoint / زوج'), ('enfant', 'Enfant / ابن'), ('titulaire', 'Titulaire / المؤمن له')], max_length=20, verbose_name="Lien de parenté avec l'assuré(e) / علاقة القرابة بين المستفيد والمؤمن له")),
                ('inpe_code', models.CharField(blank=True, max_length=20, verbose_name='INPE et code à barres / الرقم الوطني الاستدلالي و الرقم المشفر')),
            ],
            options={
                'verbose_name': 'Bénéficiaire de soins / المستفيد من العلاجات',
                'verbose_name_plural': 'Bénéficiaires de soins / المستفيد من العلاجات',
            },
        ),
        migrations.CreateModel(
            name='EtablissementSoins',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=200, verbose_name="Nom de l'établissement")),
                ('inpe_code', models.CharField(help_text='Identifiant National des Professionnels de santé et des Établissements', max_length=20, verbose_name='INPE et code à barres')),
                ('adresse', models.TextField(verbose_name='Adresse')),
                ('telephone', models.CharField(blank=True, max_length=20)),
            ],
            options={
                'verbose_name': 'Établissement de soins',
                'verbose_name_plural': 'Établissements de soins',
            },
        ),
        migrations.CreateModel(
            name='FeuilleDesoins',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_dossier', models.CharField(blank=True, max_length=50, verbose_name='N° Dossier / رقم الملف')),
                ('type_autorisation', models.CharField(choices=[('entente_prealable', 'Entente préalable / موافقة مسبقة'), ('execution', 'Exécution / تنفيذ')], max_length=20, verbose_name="Type d'autorisation / نوع الترخيص")),
                ('type_soins', models.CharField(choices=[('maladie', 'Maladie / مرض'), ('maternite', 'Maternité / أمومة'), ('accident', 'Accident / حادثة'), ('hospitalisation', 'Hospitalisation / استشفاء')], max_length=20, verbose_name='Type de soins / نوع العلاجات')),
                ('montant_frais', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Montant des frais (Dhs) / مبلغ المصاريف درهم')),
                ('nombre_pieces_jointes', models.PositiveIntegerField(default=0, verbose_name='Nombre de pièces jointes / عدد الوثائق المرفقة')),
                ('date_creation', models.DateTimeField(auto_now_add=True)),
                ('date_modification', models.DateTimeField(auto_now=True)),
                ('lieu_signature_assure', models.CharField(max_length=100, verbose_name='Lieu (signature assuré) / مكان توقيع المؤمن له')),
                ('date_signature_assure', models.DateField(verbose_name='Date signature assuré / تاريخ توقيع المؤمن له')),
                ('lieu_signature_medecin', models.CharField(max_length=100, verbose_name='Lieu (signature médecin) / مكان توقيع الطبيب')),
                ('date_signature_medecin', models.DateField(verbose_name='Date signature médecin / تاريخ توقيع الطبيب')),
                ('date_depot', models.DateField(blank=True, null=True, verbose_name='Date de dépôt du dossier / تاريخ الإيداع')),
                ('date_arrivee', models.DateField(blank=True, null=True, verbose_name="Date d'arrivée / تاريخ الاستلام")),
                ('identification_agent', models.CharField(blank=True, max_length=100, verbose_name="Identification de l'agent / تعريف الوكيل")),
            ],
            options={
                'verbose_name': 'Feuille de soins / ورقة العلاجات',
                'verbose_name_plural': 'Feuilles de soins / ورقة العلاجات',
                'ordering': ['-date_creation'],
            },
        ),
        migrations.CreateModel(
            name='UtilisateurProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=150, verbose_name='Prénom')),
                ('last_name', models.CharField(max_length=150, verbose_name='Nom')),
                ('first_name_ar', models.CharField(blank=True, max_length=150, verbose_name='الاسم الشخصي')),
                ('last_name_ar', models.CharField(blank=True, max_length=150, verbose_name='الاسم العائلي')),
                ('cin', models.CharField(max_length=20, validators=[django.core.validators.RegexValidator(message='Le CIN doit être alphanumérique en majuscules (A-Z, 0-9).', regex='^[A-Z0-9]+$')], verbose_name='N° CIN / رقم بطاقة التعريف الوطنية')),
                ('numero_immatriculation', models.CharField(max_length=20, unique=True, verbose_name='N° Immatriculation / رقم التسجيل')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Profil Utilisateur',
                'verbose_name_plural': 'Profils Utilisateurs',
            },
        ),
        migrations.CreateModel(
            name='PrestationNonPriseEnCharge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nature_prestation', models.CharField(max_length=200, verbose_name='Nature de la prestation / طبيعة الخدمة')),
                ('prix_unitaire', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Prix unitaire / السعر الوحدوي')),
                ('quantite', models.PositiveIntegerField(verbose_name='Quantité / الكمية')),
                ('prix_total', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Prix total / السعر الإجمالي')),
                ('feuille_soins', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prestations_non_couvertes', to='core.feuilledesoins', verbose_name='Feuille de soins / ورقة العلاجات')),
            ],
            options={
                'verbose_name': 'Prestation non prise en charge / الخدمات غير المغطاة',
                'verbose_name_plural': 'Prestations non prises en charge / الخدمات غير المغطاة',
            },
        ),
        migrations.CreateModel(
            name='OrdonnanceExecutee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_execution', models.DateField(verbose_name="Date d'exécution / تاريخ التنفيذ")),
                ('prix_facture', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Prix facturé / الثمن المفوتر')),
                ('pharmacien_inpe', models.CharField(max_length=20, verbose_name='INPE Pharmacien / رمز الصيدلي أو ممون التجهيزات الطبية')),
                ('feuille_soins', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ordonnances_executees', to='core.feuilledesoins', verbose_name='Feuille de soins / ورقة العلاجات')),
            ],
            options={
                'verbose_name': 'Ordonnance exécutée / جرد الوصفات التي تم تنفيذها و التجهيزات الطبية الممونة',
                'verbose_name_plural': 'Ordonnances exécutées / جرد الوصفات التي تم تنفيذها و التجهيزات الطبية الممونة',
            },
        ),
        migrations.CreateModel(
            name='Medecin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=150, verbose_name='Prénom')),
                ('last_name', models.CharField(max_length=150, verbose_name='Nom')),
                ('first_name_ar', models.CharField(blank=True, max_length=150, verbose_name='الاسم الشخصي')),
                ('last_name_ar', models.CharField(blank=True, max_length=150, verbose_name='الاسم العائلي')),
                ('cin', models.CharField(max_length=20, validators=[django.core.validators.RegexValidator(message='Le CIN doit être alphanumérique en majuscules (A-Z, 0-9).', regex='^[A-Z0-9]+$')], verbose_name='N° CIN / رقم بطاقة التعريف الوطنية')),
                ('specialite', models.CharField(max_length=150, verbose_name='Spécialité')),
                ('inpe_code', models.CharField(help_text='Identifiant National des Professionnels de santé', max_length=20, verbose_name='INPE et code à barres')),
                ('etablissement', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.etablissementsoins', verbose_name='Établissement de soins')),
            ],
            options={
                'verbose_name': 'Médecin',
                'verbose_name_plural': 'Médecins',
            },
        ),
        migrations.AddField(
            model_name='feuilledesoins',
            name='assure',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feuilles_soins', to='core.utilisateurprofile', verbose_name='Assuré(e) / المؤمن له'),
        ),
        migrations.AddField(
            model_name='feuilledesoins',
            name='beneficiaire',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feuilles_soins', to='core.beneficiaire', verbose_name='Bénéficiaire de soins / المستفيد من العلاجات'),
        ),
        migrations.AddField(
            model_name='feuilledesoins',
            name='etablissement_soins',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.etablissementsoins', verbose_name='Établissement de soins / المؤسسة العلاجية'),
        ),
        migrations.AddField(
            model_name='feuilledesoins',
            name='medecin_traitant',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.medecin', verbose_name='Médecin traitant / الطبيب المعالج'),
        ),
        migrations.AddField(
            model_name='beneficiaire',
            name='assure',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='beneficiaires', to='core.utilisateurprofile', verbose_name='Assuré(e) / المؤمن له'),
        ),
        migrations.CreateModel(
            name='ActeParamedical',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_acte', models.DateField(verbose_name='Date des actes / تاريخ العمليات')),
                ('code_acte', models.CharField(max_length=20, verbose_name='Code des actes / رمز العمليات')),
                ('lettre_cle_cotation', models.CharField(max_length=10, verbose_name='Lettre clé + cotation NGAP / معامل العمليات')),
                ('nombre_actes', models.PositiveIntegerField(verbose_name="Nombre d'actes / عدد العمليات")),
                ('montant_facture', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Montant facturé / المبلغ المفوتر')),
                ('paramedical_inpe', models.CharField(max_length=20, verbose_name='INPE Paramédical / رمز المساعد الطبي')),
                ('feuille_soins', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actes_paramedicaux', to='core.feuilledesoins', verbose_name='Feuille de soins / ورقة العلاجات')),
            ],
            options={
                'verbose_name': 'Acte paramédical / عمليات المساعدين الطبيين',
                'verbose_name_plural': 'Actes paramédicaux / عمليات المساعدين الطبيين',
            },
        ),
        migrations.CreateModel(
            name='ActeMedical',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_acte', models.DateField(verbose_name='Date des actes / تاريخ العمليات')),
                ('code_acte', models.CharField(max_length=20, verbose_name='Code des actes / رمز العمليات')),
                ('lettre_cle_cotation', models.CharField(max_length=10, verbose_name='Lettre clé + cotation NGAP / معامل العمليات')),
                ('montant_facture', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Montant facturé / المبلغ المفوتر')),
                ('cim_10', models.CharField(blank=True, help_text='Classification Internationale des Maladies', max_length=10, verbose_name='CIM-10')),
                ('feuille_soins', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actes_medicaux', to='core.feuilledesoins', verbose_name='Feuille de soins / ورقة العلاجات')),
                ('medecin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.medecin', verbose_name='Médecin / الطبيب المعالج')),
            ],
            options={
                'verbose_name': 'Acte médical / وصف العمليات المجراة',
                'verbose_name_plural': 'Actes médicaux / وصف العمليات المجراة',
            },
        ),
        migrations.CreateModel(
            name='ActeBiologieRadiologie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_acte', models.DateField(verbose_name='Date des actes / تاريخ العمليات')),
                ('code_acte', models.CharField(max_length=20, verbose_name='Code des actes / رمز العمليات')),
                ('lettre_cle_cotation', models.CharField(max_length=15, verbose_name='Lettre clé + cotation NGAP/NABM / معامل العمليات')),
                ('montant_facture', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Montant facturé / المبلغ المفوتر')),
                ('praticien_inpe', models.CharField(max_length=20, verbose_name='INPE Radiologue/Biologiste / رمز طبيب الأشعة أو الإحيائي')),
                ('feuille_soins', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actes_biologie_radiologie', to='core.feuilledesoins', verbose_name='Feuille de soins / ورقة العلاجات')),
            ],
            options={
                'verbose_name': 'Acte de biologie/radiologie / عمليات: الإحياء، الأشعة والصور',
                'verbose_name_plural': 'Actes de biologie/radiologie / عمليات: الإحياء، الأشعة والصور',
            },
        ),
    ]
