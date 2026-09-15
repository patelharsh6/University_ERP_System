import { calculateGrade, getGradeBadgeClass } from '../grade';

describe('Grade Utilities', () => {
  test('calculateGrade returns correct tier and points', () => {
    const aPlus = calculateGrade(95, 100);
    expect(aPlus.grade).toBe('A+');
    expect(aPlus.points).toBe(10);

    const b = calculateGrade(65, 100);
    expect(b.grade).toBe('B');
    expect(b.points).toBe(7);

    const f = calculateGrade(35, 100);
    expect(f.grade).toBe('F');
    expect(f.points).toBe(0);
  });

  test('getGradeBadgeClass returns appropriate CSS class', () => {
    expect(getGradeBadgeClass('A+')).toBe('badge-grade-aplus');
    expect(getGradeBadgeClass('A')).toBe('badge-grade-a');
    expect(getGradeBadgeClass('F')).toBe('badge-grade-f');
    expect(getGradeBadgeClass(null)).toBe('badge-neutral');
  });
});
