
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Movement } from './types';
import { formatDate } from './utils';

interface MovementsTableProps {
  movements: Movement[];
}

const MovementsTable: React.FC<MovementsTableProps> = ({ movements }) => {
  if (movements.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">لا توجد حركات مخزون حديثة</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">المنتج</TableHead>
          <TableHead className="text-right">نوع الحركة</TableHead>
          <TableHead className="text-right">التاريخ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((movement) => (
          <TableRow key={movement.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{movement.product_name}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                movement.scan_type === 'in' 
                  ? 'bg-green-100 text-green-800' 
                  : movement.scan_type === 'out'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
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
        ))}
      </TableBody>
    </Table>
  );
};

export default MovementsTable;
