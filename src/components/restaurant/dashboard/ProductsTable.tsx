
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar } from '@/components/ui/avatar';
import { ArrowDown } from 'lucide-react';
import { Product } from './types';
import { formatDate, getProductInitials } from './utils';

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">لا توجد منتجات مضافة حديثًا</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">المنتج</TableHead>
          <TableHead className="text-right">الصورة</TableHead>
          <TableHead className="text-right">الفئة</TableHead>
          <TableHead className="text-right">الكمية</TableHead>
          <TableHead className="text-right">تاريخ الإضافة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>
              <Avatar className="h-10 w-10">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="h-full w-full object-cover"
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
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
