from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active_account', 'created_at']
    list_filter = ['role', 'is_active_account', 'gender']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'enrollment_id', 'employee_id']
    ordering = ['-created_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('ERP Profile', {
            'fields': (
                'role', 'phone', 'enrollment_id', 'employee_id',
                'profile_picture', 'date_of_birth', 'gender', 'is_active_account',
            ),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('ERP Profile', {
            'fields': (
                'email', 'first_name', 'last_name', 'role', 'phone',
                'enrollment_id', 'employee_id',
            ),
        }),
    )
