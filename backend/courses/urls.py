from django.urls import path
from . import views

urlpatterns = [
    # Academic Terms
    path('terms/', views.AcademicTermListCreateView.as_view(), name='term-list-create'),
    path('terms/<int:pk>/', views.AcademicTermDetailView.as_view(), name='term-detail'),

    # Subjects
    path('subjects/', views.SubjectListCreateView.as_view(), name='subject-list-create'),
    path('subjects/<int:pk>/', views.SubjectDetailView.as_view(), name='subject-detail'),

    # Courses
    path('', views.CourseListCreateView.as_view(), name='course-list-create'),
    path('<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),

    # Enrollments
    path('enrollments/', views.EnrollmentListCreateView.as_view(), name='enrollment-list-create'),
    path('enrollments/<int:pk>/', views.EnrollmentDetailView.as_view(), name='enrollment-detail'),

    # Assignments & Submissions
    path('assignments/', views.AssignmentListCreateView.as_view(), name='assignment-list-create'),
    path('assignments/<int:pk>/', views.AssignmentDetailView.as_view(), name='assignment-detail'),
    path('submissions/', views.AssignmentSubmissionListCreateView.as_view(), name='submission-list-create'),
    path('submissions/<int:pk>/', views.AssignmentSubmissionDetailView.as_view(), name='submission-detail'),

    # Study Materials
    path('materials/', views.StudyMaterialListCreateView.as_view(), name='material-list-create'),
    path('materials/<int:pk>/', views.StudyMaterialDetailView.as_view(), name='material-detail'),
]
