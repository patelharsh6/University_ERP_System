"""
Pagination classes for standard API responses.
"""
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination with configurable page_size parameter.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
