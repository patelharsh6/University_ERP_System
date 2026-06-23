from django.contrib import admin
from .models import Subject, Course, Enrollment, Assignment, StudyMaterial


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'department', 'credits', 'semester', 'is_elective']
    list_filter = ['department', 'semester', 'is_elective']
    search_fields = ['name', 'code']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'instructor', 'department', 'semester', 'is_published']
    list_filter = ['department', 'semester', 'is_published']
    search_fields = ['title', 'code']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'enrolled_date', 'progress', 'is_completed']
    list_filter = ['is_completed']


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'due_date', 'max_marks']
    list_filter = ['course']


@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'material_type', 'uploaded_at']
    list_filter = ['material_type', 'course']
