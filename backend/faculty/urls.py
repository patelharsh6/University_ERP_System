from django.urls import path
from . import views

urlpatterns = [
    path('me/summary/', views.FacultyDashboardSummaryView.as_view(), name='faculty-me-summary'),
    path('', views.FacultyListCreateView.as_view(), name='faculty-list-create'),
    path('<int:pk>/', views.FacultyDetailView.as_view(), name='faculty-detail'),
]
