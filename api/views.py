from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
    
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
