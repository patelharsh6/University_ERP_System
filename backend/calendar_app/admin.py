from django.contrib import admin
from .models import Holiday


@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'end_date', 'category', 'department']
    list_filter = ['category', 'date']
    search_fields = ['title', 'description', 'department']
