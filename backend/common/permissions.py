"""
Declarative role-based and object-level permissions.
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Allows access only to users with role='admin' or superusers."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'admin' or request.user.is_superuser)
        )


class IsFaculty(BasePermission):
    """Allows access only to faculty members."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'faculty'
        )


class IsStudent(BasePermission):
    """Allows access only to students."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )


class IsFacultyOrAdmin(BasePermission):
    """Allows access to faculty or admin users."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in ('faculty', 'admin') or request.user.is_superuser)
        )


class ReadOnlyOrFacultyAdmin(BasePermission):
    """
    Safe methods (GET, HEAD, OPTIONS) permitted for any authenticated user;
    Write/modify methods require faculty or admin role.
    """

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ('faculty', 'admin') or request.user.is_superuser


class ReadOnlyOrAdmin(BasePermission):
    """
    Safe methods permitted for any authenticated user;
    Write/modify methods require admin role.
    """

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role == 'admin' or request.user.is_superuser


class IsOwnerOrStaff(BasePermission):
    """
    Object-level permission:
    - Object owner (e.g. obj.user, obj.student, obj.recipient, obj.author)
    - Or staff/admin (user.role in ('faculty', 'admin') or is_superuser)
    """

    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'admin' or request.user.is_superuser:
            return True

        # Check typical ownership attributes
        owner = getattr(obj, 'student', None) or getattr(obj, 'user', None) or getattr(obj, 'recipient', None) or getattr(obj, 'author', None)
        if owner == request.user:
            return True

        # Faculty staff access check if applicable
        if request.user.role == 'faculty':
            instructor = getattr(obj, 'instructor', None) or getattr(getattr(obj, 'course', None), 'instructor', None)
            if instructor == request.user:
                return True

        return False
