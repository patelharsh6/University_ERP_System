from django.db import models
from django.conf import settings


class FacultyProfile(models.Model):
    """Extended faculty profile linked to a User account."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='faculty_profile',
        limit_choices_to={'role': 'faculty'},
    )
    department = models.CharField(max_length=100)
    designation = models.CharField(
        max_length=50, default='Assistant Professor',
        help_text='e.g., Professor, Associate Professor, Assistant Professor'
    )
    specialization = models.CharField(max_length=200, blank=True)
    qualification = models.CharField(max_length=200, blank=True)
    joining_date = models.DateField(blank=True, null=True)
    office_room = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['department', 'user__last_name']
        verbose_name = 'Faculty Profile'
        verbose_name_plural = 'Faculty Profiles'

    def __str__(self):
        return f"{self.designation} {self.user.get_full_name()} - {self.department}"
