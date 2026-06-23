from django.contrib import admin
from .models import CourseFeedback


@admin.register(CourseFeedback)
class CourseFeedbackAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'overall_rating', 'teaching_quality', 'is_anonymous', 'created_at']
    list_filter = ['overall_rating', 'is_anonymous', 'semester']
    search_fields = ['student__first_name', 'course__title', 'comments']
