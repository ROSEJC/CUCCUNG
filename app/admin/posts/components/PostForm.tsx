'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Send, AlertTriangle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { slugify } from '@/lib/utils/slugify';
import { SEOLiveFeedback } from './SEOLiveFeedback';
import { ImageUpload } from './ImageUpload';
import { MarkdownEditor } from './MarkdownEditor';

interface Category {
  id: string;
  name: string;
}

interface PostFormProps {
  initialData?: any;
  categories: Category[];
}

export const PostForm: React.FC<PostFormProps> = ({ initialData, categories }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAutoSlug, setIsAutoSlug] = useState(!initialData);

  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    categoryId: initialData?.categoryId || '',
    metaImage: initialData?.metaImage || '',
    featuredImageAlt: initialData?.featuredImageAlt || '',
    published: initialData?.published || false,
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (isAutoSlug && formData.title) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title, isAutoSlug]);

  // H2 Heading Check
  const h2Count = (formData.content.match(/^##\s/gm) || []).length;
  const isH2Valid = h2Count >= 3;

  const handleSubmit = async (publish: boolean) => {
    // Validation
    if (!formData.title || !formData.slug || !formData.content || !formData.categoryId) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    if (!formData.metaImage || !formData.featuredImageAlt) {
      toast.error('Ảnh đại diện và Alt text là bắt buộc cho SEO');
      return;
    }

    setLoading(true);
    const method = initialData ? 'PUT' : 'POST';
    
    try {
      const res = await fetch('/api/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, published: publish }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save post');
      }

      toast.success(publish ? 'Bài viết đã được xuất bản!' : 'Đã lưu bản nháp');
      router.push('/admin/posts');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/posts"
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 italic">
              {initialData ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
            </h1>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-tight">Post Editor — Cuccung SEO System</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition disabled:opacity-50 flex items-center gap-2 border border-zinc-200 dark:border-zinc-800"
          >
            <Save className="w-4 h-4" />
            Lưu nháp
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
            Xuất bản
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title Section */}
          <div className="space-y-4 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tiêu đề bài viết (H1) <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ví dụ: 10 điều mẹ bầu cần biết trong 3 tháng đầu"
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-zinc-100 dark:border-zinc-900 focus:border-blue-500 outline-none py-2 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Đường dẫn (Slug)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">cuccung.vn/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, slug: e.target.value }));
                    setIsAutoSlug(false);
                  }}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <p className="text-[10px] text-zinc-400 italic">Slug sẽ hiển thị trên thanh địa chỉ của trình duyệt.</p>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
            <MarkdownEditor 
              value={formData.content}
              onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
            />
            
            {/* H2 Warning */}
            {!isH2Valid && formData.content.length > 200 && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Cần tối ưu cấu trúc bài viết</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Bài viết hiện có {h2Count} tiêu đề H2. Google khuyến nghị nên có ít nhất 3 tiêu đề H2 (##) để nội dung rõ ràng và tối ưu SEO.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* SEO Metadata */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-900 pb-4">SEO Config</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Meta Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Tiêu đề hiển thị trên Google..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Meta Description <span className="text-rose-500">*</span></label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Mô tả ngắn gọn để thu hút click từ Google..."
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <SEOLiveFeedback 
                title={formData.metaTitle} 
                description={formData.metaDescription} 
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
            <ImageUpload 
              value={formData.metaImage}
              alt={formData.featuredImageAlt}
              onChange={(url) => setFormData(prev => ({ ...prev, metaImage: url }))}
              onAltChange={(alt) => setFormData(prev => ({ ...prev, featuredImageAlt: alt }))}
            />
          </div>

          {/* Category Selection */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-sm space-y-4">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              Chủ đề bài viết <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="">Chọn chủ đề...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-400 italic">Mỗi bài viết chỉ thuộc về một chủ đề chính để duy trì cấu trúc Silo Page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
