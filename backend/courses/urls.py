from django.urls import path
from . import views

urlpatterns = [
    # Subjects
    path('subjects/', views.SubjectListCreateView.as_view(), name='subject-list-create'),
    path('subjects/<int:pk>/', views.SubjectDetailView.as_view(), name='subject-detail'),

    # Courses
    path('', views.CourseListCreateView.as_view(), name='course-list-create'),
    path('<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),

    # Enrollments
    path('enrollments/', views.EnrollmentListCreateView.as_view(), name='enrollment-list-create'),

    # Assignments
    path('assignments/', views.AssignmentListCreateView.as_view(), name='assignment-list-create'),
    path('assignments/<int:pk>/', views.AssignmentDetailView.as_view(), name='assignment-detail'),

    # Study Materials
    path('materials/', views.StudyMaterialListCreateView.as_view(), name='material-list-create'),
    path('materials/<int:pk>/', views.StudyMaterialDetailView.as_view(), name='material-detail'),
]
