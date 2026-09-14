from django.urls import path
from . import views

urlpatterns = [
    path('schedule/', views.ExamScheduleListCreateView.as_view(), name='exam-schedule-list-create'),
    path('schedule/<int:pk>/', views.ExamScheduleDetailView.as_view(), name='exam-schedule-detail'),
]
