
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getMockData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus } from 'lucide-react';

const StorageTeam = () => {
  const { storageTeamMembers } = getMockData();

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">فريق المخزن</h1>
          <Button className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة عضو جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">أعضاء فريق المخزن</CardTitle>
            <CardDescription>قائمة بجميع أعضاء فريق المخزن المسجلين في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">المطعم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">تاريخ الانضمام</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storageTeamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.restaurantName}</TableCell>
                    <TableCell>
                      {member.role === 'manager' ? 'مدير المخزن' : 'عضو فريق'}
                    </TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {new Date(member.joinDate).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      {member.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          غير نشط
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StorageTeam;
