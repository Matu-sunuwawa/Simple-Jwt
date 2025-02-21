
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from django.urls import path, include

# CUSTOMIZE TOKEN PAYLOAD [ OPTIONAL ]
from api.serializers import CustomTokenObtainPairSerializer

urlpatterns = [
    path('admin/', admin.site.urls),

    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # CUSTOMIZE TOKEN PAYLOAD [ OPTIONAL ]
    path('api/token/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),

    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('api.urls')),
]
