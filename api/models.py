
# when Apply `Access Token Blacklisting` needed:

# from django.db import models
# from django.contrib.auth.models import User

# class BlacklistedToken(models.Model):
#     token = models.CharField(max_length=500, unique=True)
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     blacklisted_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.token
