from django.db import models


class Holiday(models.Model):
    """Academic holidays, examination windows, and university events."""

    CATEGORY_CHOICES = [
        ('holiday', 'Public / Academic Holiday'),
        ('exam', 'Examination Period'),
        ('event', 'University Event / Festival'),
        ('deadline', 'Academic Deadline'),
        ('vacation', 'Semester Break / Vacation'),
    ]

    title = models.CharField(max_length=200)
    date = models.DateField(help_text='Start date of holiday/event')
    end_date = models.DateField(null=True, blank=True, help_text='Optional end date for multi-day events')
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default='holiday'
    )
    department = models.CharField(max_length=100, blank=True, help_text='Leave blank for all departments')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']
        verbose_name = 'Holiday / Academic Event'
        verbose_name_plural = 'Holidays & Academic Events'

    def __str__(self):
        return f"{self.title} ({self.date})"
