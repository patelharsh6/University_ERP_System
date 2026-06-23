from django.contrib import admin
from .models import ExamResult


@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'subject', 'exam_type', 'marks_obtained', 'max_marks', 'grade', 'is_published']
    list_filter = ['exam_type', 'grade', 'is_published', 'semester']
    search_fields = ['student__first_name', 'student__last_name', 'subject__name']
