from django.urls import path
from . import views

urlpatterns = [
    path('', views.FeedbackListCreateView.as_view(), name='feedback-list-create'),
    path('<int:pk>/', views.FeedbackDetailView.as_view(), name='feedback-detail'),
]
