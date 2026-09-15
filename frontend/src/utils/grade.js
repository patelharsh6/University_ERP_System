// src/utils/grade.js

export const GRADE_SCALE = [
  { minPercentage: 90, grade: 'A+', points: 10, label: 'Outstanding', color: 'var(--success)' },
  { minPercentage: 80, grade: 'A',  points: 9,  label: 'Excellent',   color: 'var(--primary)' },
  { minPercentage: 70, grade: 'B+', points: 8,  label: 'Very Good',   color: '#0d9488' },
  { minPercentage: 60, grade: 'B',  points: 7,  label: 'Good',        color: '#0284c7' },
  { minPercentage: 50, grade: 'C+', points: 6,  label: 'Average',     color: 'var(--warning)' },
  { minPercentage: 40, grade: 'C',  points: 5,  label: 'Pass',        color: '#eab308' },
  { minPercentage: 0,  grade: 'F',  points: 0,  label: 'Fail',        color: 'var(--danger)' },
];

/**
 * Calculate grade and grade points from marks obtained and maximum marks.
 */
export function calculateGrade(marks, maxMarks = 100) {
  if (marks === null || marks === undefined || !maxMarks) {
    return { grade: '—', points: 0, label: 'N/A', color: 'var(--text-secondary)' };
  }
  const percentage = (Number(marks) / Number(maxMarks)) * 100;
  for (const tier of GRADE_SCALE) {
    if (percentage >= tier.minPercentage) {
      return { ...tier, percentage };
    }
  }
  return { grade: 'F', points: 0, label: 'Fail', color: 'var(--danger)', percentage };
}

/**
 * Get CSS badge class name for a given grade string.
 */
export function getGradeBadgeClass(grade) {
  if (!grade) return 'badge-neutral';
  const cleanGrade = String(grade).toUpperCase().trim();
  switch (cleanGrade) {
    case 'A+':
    case 'O':
      return 'badge-grade-aplus';
    case 'A':
      return 'badge-grade-a';
    case 'B+':
      return 'badge-grade-bplus';
    case 'B':
      return 'badge-grade-b';
    case 'C+':
    case 'C':
      return 'badge-grade-c';
    case 'F':
      return 'badge-grade-f';
    default:
      return 'badge-neutral';
  }
}
