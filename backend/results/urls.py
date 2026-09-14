from django.urls import path
from . import views

urlpatterns = [
    path('transcript/', views.TranscriptView.as_view(), name='result-transcript'),
    path('', views.ExamResultListCreateView.as_view(), name='result-list-create'),
    path('<int:pk>/', views.ExamResultDetailView.as_view(), name='result-detail'),
]
