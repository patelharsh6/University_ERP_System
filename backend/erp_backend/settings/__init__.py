"""
Settings package initialization.
Loads settings according to DJANGO_ENV ('dev' by default, or 'prod').
"""
import os

env = os.getenv('DJANGO_ENV', 'dev').lower()

if env == 'prod' or env == 'production':
    from .prod import *
else:
    from .dev import *
