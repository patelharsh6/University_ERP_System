from rest_framework import generics
from common.permissions import ReadOnlyOrFacultyAdmin
from .models import Holiday
from .serializers import HolidaySerializer


class HolidayListCreateView(generics.ListCreateAPIView):
    """List holidays/events (all authenticated) or create (faculty/admin only)."""
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]


class HolidayDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve or modify holiday/event (faculty/admin only for writes)."""
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
