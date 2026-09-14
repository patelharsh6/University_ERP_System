"""
System-wide constants and computation helpers.
"""

ROLE_STUDENT = 'student'
ROLE_FACULTY = 'faculty'
ROLE_ADMIN = 'admin'

ROLES = (
    (ROLE_STUDENT, 'Student'),
    (ROLE_FACULTY, 'Faculty'),
    (ROLE_ADMIN, 'Admin'),
)

ATTENDANCE_THRESHOLD = 75  # Percentage threshold for attendance warnings

# Grade table: (min_percentage, grade_code, grade_point)
GRADE_TABLE = [
    (90.0, 'A+', 10.0),
    (80.0, 'A', 9.0),
    (70.0, 'B+', 8.0),
    (60.0, 'B', 7.0),
    (50.0, 'C', 6.0),
    (40.0, 'D', 5.0),
    (0.0, 'F', 0.0),
]


def compute_grade_and_points(percentage: float):
    """
    Given a percentage (0-100), return (grade_code, grade_point).
    """
    for min_pct, grade_code, points in GRADE_TABLE:
        if percentage >= min_pct:
            return grade_code, points
    return 'F', 0.0
