from django.contrib import admin
from .models import FeeStructure, FeePayment


@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ['name', 'amount', 'course_name', 'semester', 'academic_year']
    list_filter = ['academic_year', 'course_name']


@admin.register(FeePayment)
class FeePaymentAdmin(admin.ModelAdmin):
    list_display = ['student', 'fee_structure', 'total_amount', 'amount_paid', 'status', 'due_date']
    list_filter = ['status', 'payment_method']
    search_fields = ['student__first_name', 'student__last_name', 'transaction_id']
