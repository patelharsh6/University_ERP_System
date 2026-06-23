from django.urls import path
from . import views

urlpatterns = [
    path('', views.StudentListCreateView.as_view(), name='student-list-create'),
    path('<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),
    path('leaves/', views.LeaveRequestListCreateView.as_view(), name='leave-list-create'),
    path('leaves/<int:pk>/', views.LeaveRequestDetailView.as_view(), name='leave-detail'),
]
