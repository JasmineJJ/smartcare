from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def test_endpoint(request):
    return Response({
        'message': 'SmartCare API test endpoint is working!',
        'method': request.method,
        'status': 'success'
    })
