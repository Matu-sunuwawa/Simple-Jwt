from django.urls import path
from .views import Home, Logout


urlpatterns = [
    path('', Home.as_view()),
    path('logout/', Logout.as_view(), name='logout'),
]