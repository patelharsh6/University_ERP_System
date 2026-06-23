from django.db import models
from django.conf import settings


class FeeStructure(models.Model):
    """Fee structure for a course/semester."""

    name = models.CharField(max_length=100, help_text='e.g., Tuition Fee, Hostel Fee')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    course_name = models.CharField(max_length=100, blank=True)
    semester = models.CharField(max_length=10, blank=True)
    academic_year = models.CharField(max_length=10, default='2024-25')
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - ₹{self.amount}"


class FeePayment(models.Model):
    """Individual fee payment record."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        OVERDUE = 'overdue', 'Overdue'
        PARTIAL = 'partial', 'Partial'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fee_payments',
        limit_choices_to={'role': 'student'},
    )
    fee_structure = models.ForeignKey(
        FeeStructure, on_delete=models.CASCADE,
        related_name='payments',
    )
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    payment_date = models.DateField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    transaction_id = models.CharField(max_length=50, blank=True)
    payment_method = models.CharField(
        max_length=20,
        choices=[
            ('online', 'Online'), ('cash', 'Cash'),
            ('cheque', 'Cheque'), ('upi', 'UPI'),
        ],
        blank=True,
    )
    receipt_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.fee_structure.name} ({self.status})"
