'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  alt: string;
  onChange: (url: string) => void;
  onAltChange: (alt: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, alt, onChange, onAltChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
      toast.success('Tải ảnh lên thành công');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Ảnh đại diện bài viết (Featured Image) <span className="text-rose-500">*</span>
      </label>

      {value ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 group">
          <Image
            src={value}
            alt={alt || 'Featured image'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition"
              title="Đổi ảnh"
            >
              <Upload className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-rose-500/20 backdrop-blur-md rounded-full hover:bg-rose-500/40 transition"
              title="Xóa ảnh"
            >
              <X className="w-5 h-5 text-rose-500" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`
            aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer
            transition-all duration-300
            ${uploading ? 'bg-zinc-50 border-zinc-200 cursor-not-allowed' : 'bg-zinc-50/50 hover:bg-zinc-50 border-zinc-300 dark:bg-zinc-900/30 dark:border-zinc-800 dark:hover:bg-zinc-900/50'}
          `}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          ) : (
            <>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                <ImageIcon className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nhấn để tải ảnh hoặc kéo thả</p>
                <p className="text-xs text-zinc-400 mt-1">Nên dùng WebP, PNG, JPG (Max 2MB)</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
      />

      {/* Alt Text Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
          <span>Alt Text (Bắt buộc cho SEO)</span>
          {alt.trim().length > 0 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          )}
        </label>
        <input
          type="text"
          value={alt}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Ví dụ: Cách chăm sóc trẻ sơ sinh ngày đầu tiên"
          className={`
            w-full px-4 py-2 bg-white dark:bg-zinc-950 border rounded-lg text-sm focus:outline-none transition-all
            ${alt.trim().length === 0 ? 'border-amber-200 focus:border-amber-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400'}
          `}
        />
        <p className="text-[11px] text-zinc-500">
           Mô tả ngắn gọn nội dung của ảnh để Google hiểu và hiển thị trong Google Images.
        </p>
      </div>
    </div>
  );
};
