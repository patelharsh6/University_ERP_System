from django.db import models


class ExamSchedule(models.Model):
    """Exam timetable / schedule for subjects."""

    EXAM_TYPES = [
        ('midterm', 'Mid-Term Exam'),
        ('endterm', 'End-Term Exam'),
        ('practical', 'Practical Exam'),
        ('quiz', 'Quiz / Unit Test'),
    ]

    subject = models.ForeignKey(
        'courses.Subject',
        on_delete=models.CASCADE,
        related_name='exam_schedules',
    )
    exam_type = models.CharField(
        max_length=20, choices=EXAM_TYPES, default='endterm'
    )
    exam_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    venue = models.CharField(max_length=100, help_text='e.g., Exam Hall A, Room 302')
    seat_number = models.CharField(max_length=50, blank=True)
    semester = models.CharField(max_length=10, blank=True)
    academic_term = models.ForeignKey(
        'courses.AcademicTerm',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='exam_schedules',
    )
    hall_ticket_released = models.BooleanField(
        default=False,
        help_text='Whether hall tickets are released and downloadable for this exam'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['exam_date', 'start_time']

    def __str__(self):
        return f"{self.subject.code} {self.exam_type} on {self.exam_date}"
