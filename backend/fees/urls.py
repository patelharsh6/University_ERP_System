from django.urls import path
from . import views

urlpatterns = [
    path('', views.FeePaymentListCreateView.as_view(), name='fee-payment-list-create'),
    path('<int:pk>/', views.FeePaymentDetailView.as_view(), name='fee-payment-detail'),
    path('structure/', views.FeeStructureListCreateView.as_view(), name='fee-structure-list'),
]
