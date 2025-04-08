
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { getMockData } from '@/services/mockData';
import { 
  Archive, 
  Box, 
  Calendar, 
  ArrowDown, 
  ArrowUp, 
  TrashIcon 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Index = () => {
  // استخدام getMockData للحصول على البيانات
  const { dashboardStats } = getMockData();

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="المطاعم"
            value={dashboardStats.totalRestaurants}
            icon={<Box className="h-4 w-4 text-muted-foreground" />}
            description="إجمالي المطاعم المسجلة"
          />
          <StatsCard
            title="فريق المخزن"
            value={dashboardStats.totalStorageTeamMembers}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            description="إجمالي أعضاء فريق المخزن"
          />
          <StatsCard
            title="المنتجات النشطة"
            value={dashboardStats.totalProducts}
            icon={<Archive className="h-4 w-4 text-muted-foreground" />}
            description="إجمالي المنتجات في المخزون"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="المنتجات المنتهية"
            value={dashboardStats.totalExpiredProducts}
            icon={<TrashIcon className="h-4 w-4 text-muted-foreground" />}
            description="منتجات منتهية الصلاحية"
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">حركة المخزون الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">المطعم</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardStats.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.productName}</TableCell>
                      <TableCell>{transaction.restaurantName}</TableCell>
                      <TableCell>
                        {transaction.type === 'in' ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <ArrowDown className="h-3 w-3 ml-1" />
                            إدخال
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            <ArrowUp className="h-3 w-3 ml-1" />
                            إخراج
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('ar-SA')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">منتجات قريبة من انتهاء الصلاحية</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المنتج</TableHead>
                    <TableHead className="text-right">المطعم</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardStats.expiringProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.restaurantName}</TableCell>
                      <TableCell>{product.quantity} {product.unit}</TableCell>
                      <TableCell>{new Date(product.expiryDate).toLocaleDateString('ar-SA')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
