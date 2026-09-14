from django.urls import path
from . import views

urlpatterns = [
    # Summary
    path('me/summary/', views.StudentDashboardSummaryView.as_view(), name='student-me-summary'),

    # Profile CRUD
    path('', views.StudentListCreateView.as_view(), name='student-list-create'),
    path('<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),

    # Leave requests
    path('leaves/', views.LeaveRequestListCreateView.as_view(), name='leave-request-list-create'),
    path('leaves/<int:pk>/', views.LeaveRequestDetailView.as_view(), name='leave-request-detail'),

    # Clearance
    path('clearance/', views.ClearanceItemListCreateView.as_view(), name='clearance-list-create'),
    path('clearance/<int:pk>/', views.ClearanceItemDetailView.as_view(), name='clearance-detail'),
]
