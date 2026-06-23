from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with role-based access for the University ERP.
    Supports login via email, enrollment_id, or employee_id.
    """

    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        FACULTY = 'faculty', 'Faculty'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT,
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
    enrollment_id = models.CharField(
        max_length=20, unique=True, blank=True, null=True,
        help_text='Unique enrollment ID for students (e.g., 21CS049)'
    )
    employee_id = models.CharField(
        max_length=20, unique=True, blank=True, null=True,
        help_text='Unique employee ID for faculty (e.g., EMP001)'
    )
    profile_picture = models.ImageField(
        upload_to='profile_pics/', blank=True, null=True
    )
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')],
        blank=True, null=True
    )
    is_active_account = models.BooleanField(
        default=True,
        help_text='Designates whether this account is active. Inactive accounts cannot login.'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
