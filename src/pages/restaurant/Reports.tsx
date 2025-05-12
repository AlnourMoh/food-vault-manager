
import React, { useState } from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ChevronDown, Download, FileSpreadsheet } from 'lucide-react';
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// بيانات تجريبية للعرض
const sampleInventoryData = [
  { id: 1, name: 'طماطم', category: 'خضروات', initialQuantity: 50, currentQuantity: 30, unit: 'كجم', status: 'متوفر' },
  { id: 2, name: 'بطاطس', category: 'خضروات', initialQuantity: 40, currentQuantity: 15, unit: 'كجم', status: 'منخفض' },
  { id: 3, name: 'دجاج', category: 'لحوم', initialQuantity: 30, currentQuantity: 10, unit: 'كجم', status: 'منخفض' },
  { id: 4, name: 'لحم بقري', category: 'لحوم', initialQuantity: 25, currentQuantity: 20, unit: 'كجم', status: 'متوفر' },
  { id: 5, name: 'أرز', category: 'حبوب', initialQuantity: 100, currentQuantity: 80, unit: 'كجم', status: 'متوفر' },
];

const sampleUsageData = [
  { name: 'طماطم', usage: 20, category: 'خضروات' },
  { name: 'بطاطس', usage: 25, category: 'خضروات' },
  { name: 'دجاج', usage: 20, category: 'لحوم' },
  { name: 'لحم بقري', usage: 5, category: 'لحوم' },
  { name: 'أرز', usage: 20, category: 'حبوب' },
];

const sampleChartData = [
  { name: 'يناير', خضروات: 40, لحوم: 30, حبوب: 20 },
  { name: 'فبراير', خضروات: 35, لحوم: 25, حبوب: 15 },
  { name: 'مارس', خضروات: 45, لحوم: 35, حبوب: 25 },
  { name: 'أبريل', خضروات: 50, لحوم: 40, حبوب: 30 },
  { name: 'مايو', خضروات: 55, لحوم: 45, حبوب: 35 },
];

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const chartConfig = {
    خضروات: { 
      label: 'خضروات', 
      color: '#22c55e'
    },
    لحوم: { 
      label: 'لحوم', 
      color: '#ef4444'
    },
    حبوب: { 
      label: 'حبوب',
      color: '#f59e0b'
    },
  };

  const handleGenerateReport = () => {
    setIsLoading(true);
    // محاكاة عملية توليد التقرير
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const formatDate = (date?: Date) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">تقارير المخزون</h1>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>تصدير التقرير</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>اكسل (XLSX)</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList>
            <TabsTrigger value="inventory">تقرير المخزون</TabsTrigger>
            <TabsTrigger value="usage">استهلاك المواد</TabsTrigger>
            <TabsTrigger value="trend">اتجاهات الاستهلاك</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تقرير المخزون الحالي</CardTitle>
                <CardDescription>
                  عرض حالة المخزون الحالية والكميات المتبقية من كل صنف
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصنف</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>الكمية الأولية</TableHead>
                        <TableHead>الكمية الحالية</TableHead>
                        <TableHead>الوحدة</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleInventoryData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.initialQuantity}</TableCell>
                          <TableCell>{item.currentQuantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'متوفر' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تقرير استهلاك المواد</CardTitle>
                <CardDescription>
                  عرض استهلاك المواد الغذائية خلال الفترة المحددة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصنف</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>الكمية المستهلكة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleUsageData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.usage} كجم</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trend" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>اتجاهات استهلاك المواد</CardTitle>
                <CardDescription>
                  عرض اتجاهات استهلاك المواد الغذائية حسب الفئة
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ChartContainer className="h-80" config={chartConfig}>
                    <BarChart data={sampleChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip
                        content={props => <ChartTooltipContent className="w-fit" {...props} />}
                      />
                      <Bar dataKey="خضروات" fill="#22c55e" />
                      <Bar dataKey="لحوم" fill="#ef4444" />
                      <Bar dataKey="حبوب" fill="#f59e0b" />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RestaurantLayout>
  );
};

export default Reports;
