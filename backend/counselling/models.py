from django.db import models
from django.conf import settings


class CounsellingSession(models.Model):
    """1-on-1 student counselling / mentoring session."""

    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Scheduled'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
        NO_SHOW = 'no_show', 'No Show'

    class Mode(models.TextChoices):
        ONLINE = 'online', 'Online (Video/Audio)'
        IN_PERSON = 'in_person', 'In-Person (Office)'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='counselling_sessions',
        limit_choices_to={'role': 'student'},
    )
    counsellor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conducted_counselling_sessions',
        limit_choices_to={'role': 'faculty'},
    )
    slot_start = models.DateTimeField()
    slot_end = models.DateTimeField()
    mode = models.CharField(
        max_length=20, choices=Mode.choices, default=Mode.IN_PERSON
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.SCHEDULED
    )
    student_concern = models.TextField(help_text='Reason / topic for counselling requested by student')
    private_notes = models.TextField(
        blank=True,
        help_text='Private confidential notes recorded by counsellor (hidden from student)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-slot_start']

    def __str__(self):
        return f"{self.student.get_full_name()} with {self.counsellor.get_full_name()} ({self.slot_start})"
