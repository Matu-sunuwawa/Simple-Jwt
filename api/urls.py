

from django.urls import path
# from .views import Home, Logout, Register
from .views import Home, Logout, RegisterView

urlpatterns = [
    path('', Home.as_view()),
    path('logout/', Logout.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]