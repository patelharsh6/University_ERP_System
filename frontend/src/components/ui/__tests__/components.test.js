import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Skeleton from '../Skeleton';
import Loading from '../Loading';
import ErrorState from '../ErrorState';
import EmptyState from '../EmptyState';
import PageHeader from '../PageHeader';
import StatusPill from '../StatusPill';
import Pagination from '../Pagination';
import Table from '../Table';
import { BrowserRouter } from 'react-router-dom';

describe('Shared UI Components', () => {
  test('Skeleton renders variants without crashing', () => {
    const { container: textSkel } = render(<Skeleton />);
    expect(textSkel.querySelector('.skeleton-line')).toBeInTheDocument();

    const { container: tableSkel } = render(<Skeleton variant="table" rows={3} columns={3} />);
    expect(tableSkel.querySelector('.skeleton-table-container')).toBeInTheDocument();
  });

  test('Loading renders message and spinner', () => {
    render(<Loading message="Loading student records..." />);
    expect(screen.getByText('Loading student records...')).toBeInTheDocument();
  });

  test('ErrorState renders error message and retry button', () => {
    const handleRetry = jest.fn();
    render(<ErrorState error="Failed to load attendance" onRetry={handleRetry} />);

    expect(screen.getByText('Failed to load attendance')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  test('EmptyState renders title, description, and action button', () => {
    const handleAction = jest.fn();
    render(
      <EmptyState
        title="No Assignments Found"
        description="You have no pending assignments."
        actionText="Create Assignment"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No Assignments Found')).toBeInTheDocument();
    expect(screen.getByText('You have no pending assignments.')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /create assignment/i });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  test('PageHeader renders title, subtitle, and badge', () => {
    render(
      <BrowserRouter>
        <PageHeader
          title="Attendance Management"
          subtitle="View and manage daily student attendance records"
          badge="Winter 2026"
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Attendance Management')).toBeInTheDocument();
    expect(screen.getByText('View and manage daily student attendance records')).toBeInTheDocument();
    expect(screen.getByText('Winter 2026')).toBeInTheDocument();
  });

  test('StatusPill renders correct label and status styling', () => {
    render(<StatusPill status="present" />);
    expect(screen.getByText('Present')).toBeInTheDocument();

    render(<StatusPill status="overdue" />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  test('Pagination triggers onPageChange on button click', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        page={1}
        totalPages={5}
        count={100}
        pageSize={20}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test('Table renders data rows, column headers, and empty state', () => {
    const columns = [
      { header: 'Name', accessor: 'name' },
      { header: 'Grade', accessor: 'grade' },
    ];
    const data = [
      { id: 1, name: 'Harsh Patel', grade: 'A' },
      { id: 2, name: 'Alice Smith', grade: 'B' },
    ];

    const { rerender } = render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Harsh Patel')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();

    rerender(<Table columns={columns} data={[]} emptyTitle="No Students" />);
    expect(screen.getByText('No Students')).toBeInTheDocument();
  });
});
