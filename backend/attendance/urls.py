from django.urls import path
from . import views

urlpatterns = [
    path('summary/', views.AttendanceSummaryView.as_view(), name='attendance-summary'),
    path('', views.AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('<int:pk>/', views.AttendanceDetailView.as_view(), name='attendance-detail'),
    path('timetable/', views.TimetableListCreateView.as_view(), name='timetable-list-create'),
    path('timetable/<int:pk>/', views.TimetableDetailView.as_view(), name='timetable-detail'),
]
