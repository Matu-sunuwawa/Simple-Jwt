# 🚀Simple-Jwt

## Project Setup
```
python -m venv env
source env/bin/activate
```
install `django restframework` and `simplejwt`:
```
pip install django djangorestframework djangorestframework_simplejwt
```
create project name jwt_project:
```
django-admin startproject jwt_project
cd jwt_project
```
create app name api:
```
python manage.py startapp api
```
Add `rest_framework`,`rest_framework_simplejwt` and `api` to INSTALLED_APPS in your jwt_project `settings.py` file:
```
INSTALLED_APPS = [
    # All default apps go here

    'rest_framework',
    'rest_framework_simplejwt',

    'api',
]
```
In `settings.py` file, configure Simple-JWT settings:
```
from datetime import timedelta # import this library top of the settings.py file

# put on your settings.py file below INSTALLED_APPS
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),
    'SLIDING_TOKEN_REFRESH_LIFETIME_LATE_USER': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME_LATE_USER': timedelta(days=30),
}
```
Include Simple-JWT token endpoints in your jwt_project `urls.py`:
```
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
    path('', include('api.urls')),
]
```
### Create API Views
Create your API views in `api/views.py` within your app. These are endpoints that will require authentication.
```
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication



class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
```
create `api/urls.py` file in your app:
```
from django.urls import path
from .views import Home


urlpatterns = [
    path('', Home.as_view()),
]
```
RUN:
```
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
test API endpoints using tools like `Postman`. Obtain an access token by making a POST request to http://127.0.0.1:8000/api/token/ with valid user credentials like below screenshot.

<img src="https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/1*Qs3_ZKiHJQfO5ACj4Q30aw.png" alt="post request" />

Then, use this access token to make requests to authenticated endpoints like http://127.0.0.1:8000/ Type need to change as Bearer Token.

<img src="https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/1*Q3zh9tPHDeoFt8c7NO5jwg.png" alt="get request" />

🎉🎉🎉That is it, jwt provides a secure way to authenticate users and access protected resources in your Django API.

next,handle token expiration and refreshing appropriately in your client application.

source: https://medium.com/django-unleashed/securing-django-rest-apis-with-jwt-authentication-using-simple-jwt-a-step-by-step-guide-28efa84666fe
