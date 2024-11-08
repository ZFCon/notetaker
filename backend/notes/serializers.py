from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault(), write_only=True
    )

    class Meta:
        model = Note
        fields = "__all__"
