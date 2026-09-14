from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrAdmin, IsAdmin
from .models import FeeStructure, FeePayment
from .serializers import FeeStructureSerializer, FeePaymentSerializer
from .filters import FeePaymentFilter, FeeStructureFilter


class FeeStructureListCreateView(generics.ListCreateAPIView):
    """List fee structures (all auth) or create (admin only)."""
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filterset_class = FeeStructureFilter
    search_fields = ['name', 'course_name', 'academic_year']
    ordering_fields = ['amount', 'semester', 'academic_year']


class FeeStructureDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve fee structure (all auth) or update/delete (admin only)."""
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [ReadOnlyOrAdmin]


class FeePaymentListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List fee payments (scoped to student) or record payment."""
    queryset = FeePayment.objects.select_related('student', 'fee_structure').all()
    serializer_class = FeePaymentSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    filterset_class = FeePaymentFilter
    search_fields = ['transaction_id', 'fee_structure__name', 'student__first_name', 'student__last_name']
    ordering_fields = ['due_date', 'amount_paid', 'total_amount', 'created_at']

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            serializer.save(student=user)
        else:
            target_student = serializer.validated_data.get('student', user)
            serializer.save(student=target_student)


class FeePaymentDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateAPIView):
    """Retrieve or update fee payment (scoped to requesting student)."""
    queryset = FeePayment.objects.select_related('student', 'fee_structure').all()
    serializer_class = FeePaymentSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
