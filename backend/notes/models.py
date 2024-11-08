from django.contrib.auth.models import User
from django.db import models


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=255)
    description = models.TextField()
    audio = models.FileField(upload_to="audio_files/", blank=True, null=True)

    def __str__(self):
        return self.title
