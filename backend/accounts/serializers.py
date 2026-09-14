from rest_framework import serializers
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
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.STUDENT)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'phone',
            'enrollment_id', 'employee_id', 'date_of_birth', 'gender',
        ]

    def validate(self, data):
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })

        requested_role = data.get('role', User.Role.STUDENT)
        request = self.context.get('request')
        is_admin = bool(
            request and
            getattr(request, 'user', None) and
            request.user.is_authenticated and
            (getattr(request.user, 'role', None) == 'admin' or request.user.is_superuser)
        )

        # Non-admins cannot register as faculty or admin
        if requested_role != User.Role.STUDENT and not is_admin:
            raise serializers.ValidationError({
                'role': 'Only administrators can create faculty or admin accounts.'
            })

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
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

        if not identifier or not password:
            raise serializers.ValidationError({
                'identifier': 'Both identifier and password are required.'
            })

        # Safe lookup without raising MultipleObjectsReturned
        user = None
        lookup_fields = ['email', 'enrollment_id', 'employee_id', 'username']
        for field in lookup_fields:
            user = User.objects.filter(**{field: identifier}).first()
            if user:
                break

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
