from django.db import models
from django.conf import settings


class Subject(models.Model):
    """A subject/module within the university curriculum."""

    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    credits = models.PositiveIntegerField(default=3)
    semester = models.CharField(max_length=10)
    description = models.TextField(blank=True)
    is_elective = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"


class Course(models.Model):
    """A course with chapters and content (mapped to the course player in frontend)."""

    title = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='courses_taught',
        limit_choices_to={'role': 'faculty'},
    )
    subject = models.ForeignKey(
        Subject, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='courses',
    )
    semester = models.CharField(max_length=10, blank=True)
    department = models.CharField(max_length=100, blank=True)
    total_chapters = models.PositiveIntegerField(default=0)
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.title}"


class Enrollment(models.Model):
    """Student enrollment in a course."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
        limit_choices_to={'role': 'student'},
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE,
        related_name='enrollments',
    )
    enrolled_date = models.DateTimeField(auto_now_add=True)
    progress = models.FloatField(default=0.0, help_text='Progress percentage 0-100')
    is_completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-enrolled_date']

    def __str__(self):
        return f"{self.student.get_full_name()} → {self.course.title}"


class Assignment(models.Model):
    """Course assignment."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUBMITTED = 'submitted', 'Submitted'
        GRADED = 'graded', 'Graded'

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE,
        related_name='assignments',
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField()
    max_marks = models.PositiveIntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f"{self.title} - {self.course.code}"


class StudyMaterial(models.Model):
    """Study material attached to a course."""

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE,
        related_name='materials',
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='study_materials/', blank=True, null=True)
    link = models.URLField(blank=True)
    material_type = models.CharField(
        max_length=20,
        choices=[
            ('pdf', 'PDF'), ('video', 'Video'),
            ('slides', 'Slides'), ('link', 'External Link'),
        ],
        default='pdf',
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.title} ({self.course.code})"
