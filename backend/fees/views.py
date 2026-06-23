from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import FeeStructure, FeePayment
from .serializers import FeeStructureSerializer, FeePaymentSerializer


class FeeStructureListCreateView(generics.ListCreateAPIView):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [IsAuthenticated]


class FeePaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = FeePaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return FeePayment.objects.filter(student=user).select_related('fee_structure')
        return FeePayment.objects.select_related('student', 'fee_structure').all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class FeePaymentDetailView(generics.RetrieveUpdateAPIView):
    queryset = FeePayment.objects.all()
    serializer_class = FeePaymentSerializer
    permission_classes = [IsAuthenticated]
