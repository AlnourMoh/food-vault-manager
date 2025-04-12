
import React, { useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Movement, PaginationState, SortState } from './types';
import { formatDate } from './utils';
import TablePagination from './TablePagination';

interface MovementsTableProps {
  movements: Movement[];
  pagination: PaginationState;
  sort: SortState;
  onPageChange: (page: number) => void;
  onSortChange: (column: string) => void;
}

const MovementsTable: React.FC<MovementsTableProps> = React.memo(({ 
  movements, 
  pagination, 
  sort, 
  onPageChange, 
  onSortChange 
}) => {
  const hasMovements = useMemo(() => movements.length > 0, [movements.length]);
  
  if (!hasMovements) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">لا توجد حركات مخزون حديثة</p>
      </div>
    );
  }
  
  const renderSortIcon = (column: string) => {
    if (sort.column !== column) return null;
    
    return sort.direction === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4 inline" /> 
      : <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onSortChange('product_name')}
            >
              المنتج {renderSortIcon('product_name')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onSortChange('scan_type')}
            >
              نوع الحركة {renderSortIcon('scan_type')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onSortChange('created_at')}
            >
              التاريخ {renderSortIcon('created_at')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <MovementRow key={movement.id} movement={movement} />
          ))}
        </TableBody>
      </Table>
      
      <TablePagination 
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </>
  );
});

// Extract row component to benefit from memoization
const MovementRow = React.memo(({ movement }: { movement: Movement }) => {
  // Memoize scan type styling
  const scanTypeStyle = useMemo(() => {
    return movement.scan_type === 'in' 
      ? 'bg-green-100 text-green-800' 
      : movement.scan_type === 'out'
        ? 'bg-red-100 text-red-800'
        : 'bg-blue-100 text-blue-800';
  }, [movement.scan_type]);

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">{movement.product_name}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${scanTypeStyle}`}>
          {movement.scan_type === 'in' ? (
            <>
              <ArrowDown className="h-3 w-3 ml-1" />
              دخول
            </>
          ) : movement.scan_type === 'out' ? (
            <>
              <ArrowUp className="h-3 w-3 ml-1" />
              خروج
            </>
          ) : (
            'فحص'
          )}
        </span>
      </TableCell>
      <TableCell>{formatDate(movement.created_at)}</TableCell>
    </TableRow>
  );
});

MovementsTable.displayName = 'MovementsTable';
MovementRow.displayName = 'MovementRow';

export default MovementsTable;
