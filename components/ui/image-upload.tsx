'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  bucket?: string;
}

export function ImageUpload({ value, onChange, placeholder = 'Upload or paste image URL', bucket = 'images' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Make sure the storage bucket exists.');
    } finally {
      setIsUploading(false);
      // Reset input so the same file could be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-slate-900/50 pr-[120px]"
        />
        
        <div className="absolute right-1 top-1 bottom-1 flex items-center">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-full px-2 text-slate-400 hover:text-white"
              onClick={() => onChange('')}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-full bg-slate-800 hover:bg-slate-700 pointer-events-auto"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleFileSelect}
      />
      
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
      
      {value && (
        <div className="relative w-16 h-16 rounded-md border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement?.classList.add('image-error');
            }}
          />
          <ImageIcon className="w-6 h-6 text-slate-700 absolute -z-10" />
        </div>
      )}
    </div>
  );
}
