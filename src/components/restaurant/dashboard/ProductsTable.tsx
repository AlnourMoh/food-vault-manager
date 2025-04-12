
import React, { useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, PaginationState, SortState } from './types';
import { formatDate, getProductInitials } from './utils';
import TablePagination from './TablePagination';

interface ProductsTableProps {
  products: Product[];
  pagination: PaginationState;
  sort: SortState;
  onPageChange: (page: number) => void;
  onSortChange: (column: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = React.memo(({ 
  products, 
  pagination, 
  sort, 
  onPageChange, 
  onSortChange 
}) => {
  const hasProducts = useMemo(() => products.length > 0, [products.length]);

  if (!hasProducts) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">لا توجد منتجات مضافة حديثًا</p>
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
              onClick={() => onSortChange('name')}
            >
              المنتج {renderSortIcon('name')}
            </TableHead>
            <TableHead className="text-right">الصورة</TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onSortChange('category')}
            >
              الفئة {renderSortIcon('category')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onSortChange('quantity')}
            >
              الكمية {renderSortIcon('quantity')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onSortChange('created_at')}
            >
              تاريخ الإضافة {renderSortIcon('created_at')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
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
const ProductRow = React.memo(({ product }: { product: Product }) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Avatar className="h-10 w-10">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy" // Add lazy loading for images
            />
          ) : (
            <div className="h-full w-full bg-primary text-white flex items-center justify-center">
              {getProductInitials(product.name)}
            </div>
          )}
        </Avatar>
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <ArrowDown className="h-3 w-3 ml-1" />
          {product.quantity} {product.unit || 'قطعة'}
        </span>
      </TableCell>
      <TableCell>{formatDate(product.created_at)}</TableCell>
    </TableRow>
  );
});

ProductsTable.displayName = 'ProductsTable';
ProductRow.displayName = 'ProductRow';

export default ProductsTable;
