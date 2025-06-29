from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    '''Register a new user'''
    try:
        data = request.data
        logger.info(f'Registration attempt: {data.get(username, unknown)}')
        
        # Basic validation
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return Response({
                'errors': {'general': f'Missing required fields: {missing_fields}'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        if User.objects.filter(username=data['username']).exists():
            return Response({
                'errors': {'username': 'User already exists'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=data['email']).exists():
            return Response({
                'errors': {'email': 'Email already exists'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        logger.info(f'User registered successfully: {user.username}')
        
        return Response({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile': {
                    'cin': '',
                    'sexe': '',
                    'numero_immatriculation': '',
                    'date_naissance': '',
                    'adresse': '',
                },
                'beneficiaires': []
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f'Registration error: {str(e)}')
        return Response({
            'errors': {'general': f'Registration failed: {str(e)}'}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    '''Login user'''
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        logger.info(f'Login attempt: {username}')
        
        if not username or not password:
            return Response({
                'errors': {'general': 'Username and password required'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            
            logger.info(f'User logged in successfully: {user.username}')
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile': {
                        'cin': '',
                        'sexe': '',
                        'numero_immatriculation': '',
                        'date_naissance': '',
                        'adresse': '',
                    },
                    'beneficiaires': []
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'errors': {'general': 'Invalid credentials'}
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        logger.error(f'Login error: {str(e)}')
        return Response({
            'errors': {'general': f'Login failed: {str(e)}'}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    '''Get user profile'''
    user = request.user
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile': {
                'cin': '',
                'sexe': '',
                'numero_immatriculation': '',
                'date_naissance': '',
                'adresse': '',
            },
            'beneficiaires': []
        }
    })
