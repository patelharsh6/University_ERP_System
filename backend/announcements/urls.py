from django.urls import path
from . import views

urlpatterns = [
    path('', views.AnnouncementListCreateView.as_view(), name='announcement-list-create'),
    path('<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
]
