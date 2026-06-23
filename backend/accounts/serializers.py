from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model — used for profile retrieval and listing."""

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'enrollment_id', 'employee_id',
            'profile_picture', 'date_of_birth', 'gender',
            'is_active_account', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'phone',
            'enrollment_id', 'employee_id', 'date_of_birth', 'gender',
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for login — accepts email, enrollment_id, or employee_id."""
    identifier = serializers.CharField(
        help_text='Email, Enrollment ID, or Employee ID'
    )
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get('identifier', '').strip()
        password = data.get('password')

        # Try to find user by email, enrollment_id, or employee_id
        user = None
        lookup_fields = ['email', 'enrollment_id', 'employee_id', 'username']
        for field in lookup_fields:
            try:
                user = User.objects.get(**{field: identifier})
                break
            except User.DoesNotExist:
                continue

        if user is None:
            raise serializers.ValidationError({
                'identifier': 'No account found with this email/ID.'
            })

        if not user.is_active_account:
            raise serializers.ValidationError({
                'identifier': 'Your account is inactive. Contact the admin.'
            })

        if not user.check_password(password):
            raise serializers.ValidationError({
                'password': 'Invalid password.'
            })

        data['user'] = user
        return data


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'profile_picture',
            'date_of_birth', 'gender',
        ]
