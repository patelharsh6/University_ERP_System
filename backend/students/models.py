from django.db import models
from django.conf import settings


class StudentProfile(models.Model):
    """Extended student profile linked to a User account."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile',
        limit_choices_to={'role': 'student'},
    )
    admission_year = models.PositiveIntegerField(default=2024)
    semester = models.CharField(max_length=10, default='1st')
    department = models.CharField(max_length=100, blank=True)
    course_name = models.CharField(
        max_length=100, default='B.Tech (CSE)',
        help_text='e.g., B.Tech (CSE), B.Tech (ECE)'
    )
    previous_qualification = models.TextField(blank=True)
    guardian_name = models.CharField(max_length=100, blank=True)
    guardian_phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    id_proof = models.FileField(upload_to='student_docs/', blank=True, null=True)
    is_enrolled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.user.enrollment_id or 'N/A'}"


class LeaveRequest(models.Model):
    """Student leave request."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_requests',
        limit_choices_to={'role': 'student'},
    )
    leave_type = models.CharField(max_length=50, default='personal')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reviewed_leaves',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.start_date} to {self.end_date}"
