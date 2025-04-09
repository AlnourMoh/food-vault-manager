
import React, { useEffect, useState } from 'react';
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
import AddMemberDialog from '@/components/team/AddMemberDialog';
import { useStorageTeam } from '@/hooks/useStorageTeam';

const RestaurantStorageTeam = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const restaurantId = localStorage.getItem('restaurantId');
  
  const {
    teamMembers,
    isLoading,
    fetchTeamMembers,
    addTeamMember
  } = useStorageTeam(restaurantId || undefined);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddMember = (data: any) => {
    addTeamMember(data);
    setShowAddDialog(false);
  };

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">فريق المخزن</h1>
          <Button 
            className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
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
            {isLoading ? (
              <div className="text-center py-4">جاري تحميل البيانات...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-4">لا يوجد أعضاء في الفريق حالياً</div>
            ) : (
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
                      <TableCell>
                        {member.role === 'manager' ? 'مدير المخزن' : 'عضو فريق'}
                      </TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AddMemberDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddMember={handleAddMember}
          isLoading={isLoading}
        />
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantStorageTeam;
