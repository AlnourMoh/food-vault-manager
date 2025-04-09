
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormData, Unit } from '@/components/products/types';

interface UnitSelectorProps {
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  formData: FormData;
  handleSelectChange: (name: string, value: string) => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ 
  units, 
  setUnits, 
  formData, 
  handleSelectChange 
}) => {
  const { toast } = useToast();
  const [newUnit, setNewUnit] = useState<Unit>({ value: '', label: '' });
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);

  // Handle adding a new unit
  const handleAddUnit = () => {
    if (newUnit.value.trim() !== '' && newUnit.label.trim() !== '' && 
        !units.some(unit => unit.value === newUnit.value)) {
      setUnits([...units, newUnit]);
      handleSelectChange('unit', newUnit.value);
      setNewUnit({ value: '', label: '' });
      setUnitDialogOpen(false);
      
      toast({
        title: "تم إضافة وحدة القياس بنجاح",
        description: `تم إضافة وحدة "${newUnit.label}" إلى قائمة وحدات القياس`,
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="unit">وحدة القياس</Label>
      <div className="flex gap-2">
        <Select 
          value={formData.unit} 
          onValueChange={(value) => handleSelectChange('unit', value)}
        >
          <SelectTrigger id="unit" className="flex-1">
            <SelectValue placeholder="اختر وحدة القياس" />
          </SelectTrigger>
          <SelectContent position="popper">
            {units.map((unit, index) => (
              <SelectItem key={index} value={unit.value}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={unitDialogOpen} onOpenChange={setUnitDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" title="إضافة وحدة قياس جديدة">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة وحدة قياس جديدة</DialogTitle>
              <DialogDescription>
                أدخل اسم وحدة القياس الجديدة ورمزها لإضافتها إلى القائمة
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="new-unit-label">اسم وحدة القياس</Label>
                <Input 
                  id="new-unit-label"
                  value={newUnit.label}
                  onChange={(e) => setNewUnit(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="مثال: كرتونة"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="new-unit-value">رمز وحدة القياس</Label>
                <Input 
                  id="new-unit-value"
                  value={newUnit.value}
                  onChange={(e) => setNewUnit(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="مثال: crt"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUnitDialogOpen(false)}>إلغاء</Button>
              <Button 
                onClick={handleAddUnit}
                className="bg-fvm-primary hover:bg-fvm-primary-light"
                disabled={!newUnit.value.trim() || !newUnit.label.trim()}
              >
                إضافة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UnitSelector;
