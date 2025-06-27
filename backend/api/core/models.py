from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Personne(models.Model):
    """Abstract base person model."""

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    age = models.PositiveIntegerField()

    class Meta:
        abstract = True
        ordering = ("last_name", "first_name")

    def __str__(self) -> str:  # type: ignore[override]
        return f"{self.first_name} {self.last_name}"


class UtilisateurProfile(Personne):
    """Insurance holder profile linked to auth user."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    identifiant = models.CharField(max_length=100, unique=True)
    # mot_de_passe stored in auth User model


class Patient(Personne):
    dossier = models.CharField(max_length=100)
    maladie = models.CharField(max_length=255)
    utilisateur = models.ForeignKey(UtilisateurProfile, on_delete=models.CASCADE, related_name="patients")


class Medecin(Personne):
    specialite = models.CharField(max_length=150) 