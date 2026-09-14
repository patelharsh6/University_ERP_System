"""
Base abstract models for reuse across apps.
"""
from django.db import models


class TimeStampedModel(models.Model):
    """Abstract model providing automatic timestamp tracking."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """Abstract model supporting soft-deletion."""
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True
