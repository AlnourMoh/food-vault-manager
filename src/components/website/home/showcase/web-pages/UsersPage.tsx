
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const UsersPage = () => {
  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/2 relative">
            <input className="w-full pl-8 pr-3 py-2 border rounded-lg" placeholder="بحث بالاسم..." />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <Button size="sm" className="bg-primary">إضافة مستخدم</Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-right">الاسم</th>
                <th className="p-3 text-right">البريد الإلكتروني</th>
                <th className="p-3 text-right">الدور</th>
                <th className="p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "أحمد محمد", email: "ahmed@example.com", role: "مدير" },
                { name: "محمد علي", email: "mohamed@example.com", role: "مشرف مخزون" },
                { name: "فاطمة أحمد", email: "fatima@example.com", role: "موظف مخزون" },
                { name: "خالد محمود", email: "khaled@example.com", role: "مدير مبيعات" },
              ].map((user, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">تعديل</Button>
                      <Button variant="outline" size="sm" className="text-red-500">حذف</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
