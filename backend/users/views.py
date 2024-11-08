from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserRegistrationSerializer


class RegisterView(APIView):

    @swagger_auto_schema(
        operation_description="Register a new user.",
        request_body=UserRegistrationSerializer,
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description="User successfully registered",
                examples={
                    "application/json": {
                        "user": {
                            "id": 1,
                            "username": "testuser",
                            "email": "test@example.com",
                        },
                        "refresh": "<refresh_token>",
                        "access": "<access_token>",
                    }
                },
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid input",
                examples={
                    "application/json": {
                        "username": ["This field is required."],
                        "email": ["Enter a valid email address."],
                    }
                },
            ),
        },
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "user": serializer.data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
