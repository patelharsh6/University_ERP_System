from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class CourseFeedback(models.Model):
    """Student feedback for a course/instructor."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='given_feedback',
        limit_choices_to={'role': 'student'},
    )
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='feedback',
    )
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='received_feedback',
        limit_choices_to={'role': 'faculty'},
    )

    # Ratings (1-5)
    teaching_quality = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], default=3
    )
    course_content = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], default=3
    )
    communication = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], default=3
    )
    overall_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], default=3
    )

    comments = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)
    semester = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-created_at']

    def __str__(self):
        name = 'Anonymous' if self.is_anonymous else self.student.get_full_name()
        return f"{name} → {self.course.title} ({self.overall_rating}/5)"
