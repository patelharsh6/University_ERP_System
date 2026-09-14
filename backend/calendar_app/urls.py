from django.urls import path
from . import views

urlpatterns = [
    path('holidays/', views.HolidayListCreateView.as_view(), name='holiday-list-create'),
    path('holidays/<int:pk>/', views.HolidayDetailView.as_view(), name='holiday-detail'),
]
