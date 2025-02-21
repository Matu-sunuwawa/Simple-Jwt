
# Customize Token PAYLOAD [ OPTIONAL ]
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# DIFFERENT METHODS TO IMPORT SERIALIZER OBJECTS:

# from rest_framework.serializers import ModelSerializer
# from rest_framework.serializers import CharField, EmailField
from rest_framework import serializers
# from rest_framework.validators import UniqueValidator
from rest_framework import validators
# from rest_framework.exceptions import ValidationError
from rest_framework import exceptions

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token payload
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        # token['custom_data'] = 'This is custom data'
        token['custom_data'] = 'You can guess the password.'

        return token
    

# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
#     password2 = serializers.CharField(write_only=True, required=True)

#     class Meta:
#         model = User
#         fields = ('username', 'email', 'password', 'password2')

#     def validate(self, attrs):
#         if attrs['password'] != attrs['password2']:
#             raise serializers.ValidationError({"password": "Password fields didn't match."})
#         return attrs

#     def create(self, validated_data):
#         user = User.objects.create(
#             username=validated_data['username'],
#             email=validated_data['email']
#         )
#         user.set_password(validated_data['password'])
#         user.save()
#         return user


class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(required=False)
    email = serializers.EmailField(required=True,validators=[validators.UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(required=True,validators=[validate_password])

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'password', 'password_confirmation', 'email',)

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise exceptions.ValidationError({'password': "Password fields didn't match."})
        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
        )

        user.set_password(validated_data.get('password'))
        user.save()

        return user