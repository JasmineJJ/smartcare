from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.utils import timezone
import logging
from .models import MedicalClaim, ClaimSection, ClaimDocument
from .serializers import MedicalClaimSerializer, CreateClaimSerializer, ClaimDocumentSerializer

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_claims(request):
    try:
        claims = MedicalClaim.objects.filter(user=request.user)
        serializer = MedicalClaimSerializer(claims, many=True)
        
        return Response({
            'claims': serializer.data,
            'total': claims.count()
        })
    except Exception as e:
        logger.error(f'Error listing claims: {str(e)}')
        return Response({
            'error': 'Failed to fetch claims'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_claim(request):
    try:
        serializer = CreateClaimSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            claim = serializer.save()
            response_serializer = MedicalClaimSerializer(claim)
            
            logger.info(f'Medical claim created: {claim.id} by user {request.user.username}')
            
            return Response({
                'message': 'Medical claim created successfully',
                'claim': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': 'Invalid data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f'Error creating claim: {str(e)}')
        return Response({
            'error': 'Failed to create claim'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_claim_detail(request, claim_id):
    try:
        claim = MedicalClaim.objects.get(id=claim_id, user=request.user)
        serializer = MedicalClaimSerializer(claim)
        
        return Response({
            'claim': serializer.data
        })
    except MedicalClaim.DoesNotExist:
        return Response({
            'error': 'Claim not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f'Error fetching claim detail: {str(e)}')
        return Response({
            'error': 'Failed to fetch claim details'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_documents(request):
    try:
        section_type = request.data.get('section')
        files = request.FILES.getlist('documents')
        
        if not section_type or not files:
            return Response({
                'error': 'Section type and documents are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        uploaded_files = []
        for file in files:
            uploaded_files.append({
                'name': file.name,
                'size': file.size,
                'type': file.content_type,
                'uploaded_at': timezone.now().isoformat()
            })
        
        return Response({
            'message': 'Documents uploaded successfully',
            'uploaded_files': uploaded_files
        })
        
    except Exception as e:
        logger.error(f'Error uploading documents: {str(e)}')
        return Response({
            'error': 'Failed to upload documents'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
