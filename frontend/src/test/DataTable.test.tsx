import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/ui/DataTable';

interface TestItem {
  id: number;
  name: string;
  email: string;
}

const columnHelper = createColumnHelper<TestItem>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Nama',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
];

const data: TestItem[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

describe('DataTable', () => {
  it('should render table headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Nama')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should render table data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<DataTable columns={columns} data={[]} isLoading={true} />);
    expect(screen.getByText('Memuat data...')).toBeInTheDocument();
  });

  it('should show empty message when no data', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Tidak ada data" />);
    expect(screen.getByText('Tidak ada data')).toBeInTheDocument();
  });

  it('should show custom empty message', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Data kosong" />);
    expect(screen.getByText('Data kosong')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(<DataTable columns={columns} data={data} title="Daftar User" />);
    expect(screen.getByText('Daftar User')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<DataTable columns={columns} data={data} description="Total 2 user" />);
    expect(screen.getByText('Total 2 user')).toBeInTheDocument();
  });

  it('should show pagination when pageCount > 1', () => {
    render(<DataTable columns={columns} data={data} pageCount={3} pageIndex={0} />);
    expect(screen.getByText('Halaman 1 dari 3')).toBeInTheDocument();
    expect(screen.getByText('Sebelumnya')).toBeInTheDocument();
    expect(screen.getByText('Selanjutnya')).toBeInTheDocument();
  });

  it('should call onPageChange with next page on click', () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        pageCount={3}
        pageIndex={0}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByText('Selanjutnya'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable previous button on first page', () => {
    render(<DataTable columns={columns} data={data} pageCount={3} pageIndex={0} />);
    expect(screen.getByText('Sebelumnya')).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<DataTable columns={columns} data={data} pageCount={3} pageIndex={2} />);
    expect(screen.getByText('Selanjutnya')).toBeDisabled();
  });

  it('should render correct page info', () => {
    render(<DataTable columns={columns} data={data} pageCount={5} pageIndex={2} />);
    expect(screen.getByText('Halaman 3 dari 5')).toBeInTheDocument();
  });
});
