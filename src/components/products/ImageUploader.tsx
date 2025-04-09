
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (file: File | null, url: string) => void;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onImageChange, error }) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(file, url);
    }
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      onImageChange(file, url);
    }
  };
  
  const removeImage = () => {
    onImageChange(null, '');
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="image" className={error ? "text-destructive" : ""}>صورة المنتج</Label>
      
      {!imageUrl ? (
        <div 
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md h-40 transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-border'} ${error ? 'border-destructive' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input 
            id="image" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            اسحب وأفلت الصورة هنا أو
          </p>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-2"
            onClick={() => document.getElementById('image')?.click()}
          >
            اختر ملف
          </Button>
        </div>
      ) : (
        <div className="relative h-40 w-full">
          <img 
            src={imageUrl} 
            alt="صورة المنتج" 
            className="h-full w-full object-contain rounded-md border border-border"
          />
          <Button 
            type="button" 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
