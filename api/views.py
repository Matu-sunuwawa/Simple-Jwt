
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from rest_framework import status
# from .serializers import UserRegistrationSerializer, CustomTokenObtainPairSerializer
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth.models import User


class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     try:
    #         content = {'message': 'Hello, World!'}
    #         return Response(content)
    #     except Exception as e:
    #         return Response({"error": str(e)}, status=401)
    

    # ACCESS CUSTOM CLAIMS `FROM THE TOKEN PAYLOAD`
    def get(self, request):
        try:
            user = request.user
            custom_data = {
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'message': 'Hello, World!'
            }
            return Response(custom_data)
        except Exception as e:
            return Response({"error": str(e)}, status=401)
    
class Logout(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Now this will work after enabling blacklisting

            return Response({"message": "Successfully logged out."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


# class Register(APIView):
#     def post(self, request):
#         serializer = UserRegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 "user": serializer.data,
#                 "refresh": str(refresh),
#                 "access": str(refresh.access_token),
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class Register(APIView):
#     def post(self, request):
#         serializer = UserRegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()

#             # Use CustomTokenObtainPairSerializer to generate tokens with custom payload
#             refresh = CustomTokenObtainPairSerializer.get_token(user)
#             access = refresh.access_token

#             # Decode the access token to include its payload in the response [ optional ]
#             access_token_payload = AccessToken(str(access)).payload

#             # for further what included in response contents Visit ==> `UserRegistrationSerializer`
#             return Response({
#                 "user": serializer.data,
#                 "refresh": str(refresh),
#                 "access": str(access),
#                 "access_token_payload": access_token_payload
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny, )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():

            user = serializer.create(validated_data=serializer.validated_data)
            refresh = CustomTokenObtainPairSerializer.get_token(user)
            access = refresh.access_token

            # Decode the access token to include its payload in the response [ optional ]
            access_token_payload = AccessToken(str(access)).payload

            # for further what included in response contents Visit ==> `RegisterSerializer`
            return Response({
                "user": serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                "access_token_payload": access_token_payload
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# when Apply `Access Token Blacklisting` needed:
# do not forget the models in `models.py`


# from .models import BlacklistedToken

# class Home(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Check if access token is blacklisted
#         token = request.auth
#         if token and BlacklistedToken.objects.filter(token=str(token)).exists():
#             return Response({"detail": "Token is blacklisted"}, status=401)

#         return Response({'message': 'Hello, World!'})

# class Logout(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             refresh_token = request.data.get("refresh_token")
#             access_token = request.auth  # Get the access token from request

#             # Blacklist refresh token
#             token = RefreshToken(refresh_token)
#             token.blacklist()

#             # Blacklist access token
#             if access_token:
#                 BlacklistedToken.objects.create(token=str(access_token), user=request.user)

#             return Response({"message": "Successfully logged out."}, status=200)
#         except Exception as e:
#             return Response({"error": str(e)}, status=400)
