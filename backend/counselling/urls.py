from django.urls import path
from . import views

urlpatterns = [
    path('sessions/', views.CounsellingSessionListCreateView.as_view(), name='counselling-session-list-create'),
    path('sessions/<int:pk>/', views.CounsellingSessionDetailView.as_view(), name='counselling-session-detail'),
]
