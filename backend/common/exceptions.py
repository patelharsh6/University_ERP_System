"""
Custom DRF exception handler standardizing all error responses.
"""
from rest_framework.views import exception_handler
from rest_framework.exceptions import (
    AuthenticationFailed, NotAuthenticated, PermissionDenied,
    NotFound, MethodNotAllowed, ValidationError
)


def custom_exception_handler(exc, context):
    """
    Returns a unified error envelope for all DRF exceptions:
    {
        "error": {
            "code": "error_code",
            "message": "Human readable message",
            "details": { ... }
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Determine error code
        code = getattr(exc, 'default_code', None)
        if not code:
            if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
                code = 'not_authenticated'
            elif isinstance(exc, PermissionDenied):
                code = 'permission_denied'
            elif isinstance(exc, NotFound):
                code = 'not_found'
            elif isinstance(exc, ValidationError):
                code = 'validation_error'
            elif isinstance(exc, MethodNotAllowed):
                code = 'method_not_allowed'
            else:
                code = 'error'

        message = ''
        details = {}

        if isinstance(response.data, dict):
            if 'detail' in response.data:
                message = str(response.data['detail'])
                # If there are other keys beside 'detail'
                extra = {k: v for k, v in response.data.items() if k != 'detail'}
                if extra:
                    details = extra
            elif 'non_field_errors' in response.data:
                errors = response.data['non_field_errors']
                message = errors[0] if isinstance(errors, list) and errors else str(errors)
                details = response.data
            else:
                # Validation error dict (field -> list of errors)
                first_key = next(iter(response.data))
                first_err = response.data[first_key]
                first_msg = first_err[0] if isinstance(first_err, list) and first_err else str(first_err)
                message = f"{first_key}: {first_msg}"
                details = response.data
        elif isinstance(response.data, list):
            message = str(response.data[0]) if response.data else "Validation error occurred."
            details = {"errors": response.data}
        else:
            message = str(response.data)

        response.data = {
            'error': {
                'code': str(code),
                'message': message,
                'details': details,
            }
        }

    return response
