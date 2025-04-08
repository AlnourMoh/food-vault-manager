
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus } from 'lucide-react';

const RestaurantStorageTeam = () => {
  // Mock data - would come from database in real app
  const teamMembers = [
    { id: 1, name: "أحمد محمد", role: "مدير المخزن", phone: "0501234567", email: "ahmed@example.com" },
    { id: 2, name: "سارة خالد", role: "مساعد مدير", phone: "0509876543", email: "sara@example.com" },
    { id: 3, name: "محمد علي", role: "مسؤول الجرد", phone: "0507654321", email: "mohamed@example.com" },
  ];

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">فريق المخزن</h1>
          <Button className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة عضو جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>أعضاء فريق المخزن</CardTitle>
            <CardDescription>قائمة بجميع أعضاء فريق المخزن وأدوارهم</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantStorageTeam;
