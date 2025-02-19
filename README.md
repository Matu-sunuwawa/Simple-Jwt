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


## Fully Functional JWT Authentication in Django (Backend)
Update `settings.py`:
```
INSTALLED_APPS = [
    ...

    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',

    'corsheaders',
    'api',
]

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,  # Rotate refresh tokens to prevent reuse
    'BLACKLIST_AFTER_ROTATION': True,  # Blacklist old refresh tokens after rotation
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

...

CORS_ORIGIN_ALLOW_ALL = True
```

Update `views.py`:
```
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
```
Update `urls.py`:
```
from django.urls import path
from .views import Home, Logout


urlpatterns = [
    path('', Home.as_view()),
    path('logout/', Logout.as_view(), name='logout'),
]
```

Note: For detailed <mark>Very High Security</mark>, you can create a `BlacklistedToken` model and update `views.py`.For more information, check out the <mark>comments</mark> inside the `models.py` and `views.py` files.


RUN:
```
python manage.py migrate
python manage.py runserver
```

#### Generate a new <mark>Access Token</mark> and <mark>Refresh Token</mark> using valid authentication credentials.
![Use Credentials To Generate new access token and new refresh token](https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/Images/Login_Credential.png)

#### Login Using <mark>Access Token</mark>
![Login Using Access Token](https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/Images/Login_With_Access_Token.png)

#### Logout Using <mark>Refresh Token</mark>
![Logout `By adding the refresh token to blacklist` or `blacklisting the refresh token`](https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/Images/Logout_With_Refresh_Token.png)

#### Check <mark>Refresh Token</mark> is Blacklisted
![Check whether it create new Access Token using Blacklisted Refresh Token or Not](https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/Images/Create_Access_Token_After_Logout.png)

#### Before <mark>Access Token</mark> LifeTime Ends
![B4 ACCESS_TOKEN_LIFETIME Ends it can be used for `login`.](https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/Images/B4%20Ending%20Access_Token_Lifetime.png)

#### After <mark>Access Token</mark> LifeTime Ends
![After ACCESS_TOKEN_LIFETIME Ends it can't be used for `login` already it expired.](https://github.com/Matu-sunuwawa/Simple-Jwt/blob/main/Images/After_Access_Token_Ends.png)


## Fully Functional JWT Authentication in React (Frontend)
> [!IMPORTANT]
> Follow the steps below to run the application successfully. Some modules are missing in the repository due to .gitignore, such as `node_modules`.

#### Setting Up the React App
For this tutorial, we’ll use the traditional method of installing React using Create React App (CRA). However, you can also implement the backend logic using the modern Vite build tool.

1. In your desired directory (e.g., Documents), create a folder for your React app
2. Run the following command to create the React app:
```
npx create-react-app frontend
```
3. Install the required dependencies:
```
// install packages
npm i axios bootstrap react-bootstrap react-router-dom
```
4. Start the development server:
```
npm start
```
5. Open your browser and check the app at: `http://localhost:3000/`

<br>

### Project Structure
+ Inside the src folder, create a new folder named `components`.
+ Inside components, create the following files: `Login.js`, `Logout.js`, `Navigation.js`, `Home.js`
+ Next, write the navigation bar code inside `Navigation.js`. [Copy the provided code into Navigation.js].

#### Updating `App.js`
+ Modify `App.js` to include: `useState` and `useEffect` hooks.
+ Modify `App.js` to include: `Route conditions` for authentication handling.
> [!TIP]
> Set the Authorization header globally in Axios:
> ```<mark>axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`<mark>```
> In axios once you <mark>set `Authorization` header globally</mark> with `axios.defaults.headers.common["Authorization"]`.
> This means that for any request (whether it's a GET, POST, etc.) made after this line of code runs,
> axios will automatically attach the `Authorization` header with the `Bearer token`, <mark>so you don't need to manually add the header for every single request.</mark>
> This is what makes axios so convenient. Without this, you'd have to add headers to each request, like:
```
const response = await axios.get(
  "http://localhost:8000/",
  {
    headers: { "Authorization": `Bearer ${accessToken}` },
    withCredentials: true,
  }
);
```
This is one of the key benefits of using 🎉 Axios!
> [!NOTE]
> Inside App.js:
> Use `isAuth` to check if the user is authenticated.
> Pass `setIsAut`h to routes to manage `login/logout` state.
> Use the `access_token` for authentication if it exists.

#### Implementing Authentication Features

Login Functionality (`Login.js`)
+ Uses `useState` for handling `username`, `password`, and `error`.
+ Uses `useNavigate` for redirecting users without a page reload.

Home Page (`Home.js`)
+ Uses `useState` to store and display `messages` from the backend.

#### Handling Access Token Expiration
> [!NOTE]  
> How do we know when the access token expires?
> To handle this, we use `Axios interceptors`.
> Interceptors are functions that run `before` or `after` an API request.
> There are two types of interceptors: `Request interceptor` and `Response interceptor [We use a Response Interceptor to check if the access token has expired.]`

#### Creating an `Axios Interceptor`
1. Inside the src folder, create a new folder named intercepto
2. Inside interceptors, create a file named axios.js.
3. Copy the provided interceptor code into axios.js.

###### The interceptor will:
- <mark>Detect 401 Unauthorized errors</mark>.
- <mark>Automatically handle expired tokens</mark>.

No need to worry `axios.js` takes care of everything for you!

#### Importing the Interceptor
- To apply the Axios interceptor, import it in `index.js`:
```
import './interceptors/axios';
```

#### Logout Functionality (`Logout.js`)
- Uses `useRef` to <mark>track the first render</mark>.
- Prevents the logout request from being sent "twice" by checking `isFirstRender`.

#### Conclusion
- In this guide, we implemented JWT authentication in a React frontend, using `Axios` to handle `API` requests.


I hope this guide was helpful.

Thanks for coding along with me!!!😊

#### source code: 
https://github.com/Matu-sunuwawa/Simple-Jwt

### Author
<h6>Matyas Sina Adugna</h6>
<h6>📧 matyassinaadugna@gmail.com</h6>
<h6>💼 Software Engineer</h6>



#### Tools Used:
* Django
* Django REST Framework
* ReactJS
* Bootstrap
* VS Code
* GitHub
* ChatGPT


### References
https://medium.com/@ronakchitlangya1997/jwt-authentication-with-react-js-and-django-c034aae1e60d
https://medium.com/django-unleashed/securing-django-rest-apis-with-jwt-authentication-using-simple-jwt-a-step-by-step-guide-28efa84666fe
https://www.django-rest-framework.org/
