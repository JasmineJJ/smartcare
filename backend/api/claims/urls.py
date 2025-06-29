from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_claims, name='list_claims'),
    path('create/', views.create_claim, name='create_claim'),
    path('upload-documents/', views.upload_documents, name='upload_documents'),
    path('<str:claim_id>/', views.get_claim_detail, name='claim_detail')

]
