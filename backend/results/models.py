from django.db import models
from django.conf import settings


class ExamResult(models.Model):
    """Student exam result for a subject."""

    GRADE_CHOICES = [
        ('A+', 'A+'), ('A', 'A'), ('A-', 'A-'),
        ('B+', 'B+'), ('B', 'B'), ('B-', 'B-'),
        ('C+', 'C+'), ('C', 'C'), ('C-', 'C-'),
        ('D', 'D'), ('F', 'F'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='exam_results',
        limit_choices_to={'role': 'student'},
    )
    subject = models.ForeignKey(
        'courses.Subject',
        on_delete=models.CASCADE,
        related_name='exam_results',
    )
    exam_type = models.CharField(
        max_length=20,
        choices=[
            ('midterm', 'Mid-Term'), ('endterm', 'End-Term'),
            ('quiz', 'Quiz'), ('practical', 'Practical'),
            ('assignment', 'Assignment'),
        ],
        default='endterm',
    )
    semester = models.CharField(max_length=10, blank=True)
    marks_obtained = models.FloatField()
    max_marks = models.FloatField(default=100)
    grade = models.CharField(max_length=3, choices=GRADE_CHOICES, blank=True)
    grade_points = models.FloatField(default=0.0)
    remarks = models.CharField(max_length=200, blank=True)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.subject.code} ({self.exam_type}: {self.marks_obtained}/{self.max_marks})"
