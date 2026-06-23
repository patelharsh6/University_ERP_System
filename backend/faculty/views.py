from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import FacultyProfile
from .serializers import FacultyProfileSerializer, FacultyCreateSerializer


class FacultyListCreateView(generics.ListCreateAPIView):
    """List all faculty or create a new faculty profile."""
    queryset = FacultyProfile.objects.select_related('user').all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FacultyCreateSerializer
        return FacultyProfileSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FacultyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a faculty profile."""
    queryset = FacultyProfile.objects.select_related('user').all()
    serializer_class = FacultyProfileSerializer
    permission_classes = [IsAuthenticated]
