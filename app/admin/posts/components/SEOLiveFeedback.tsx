'use client';

import React from 'react';

interface SEOLiveFeedbackProps {
  title: string;
  description: string;
}

export const SEOLiveFeedback: React.FC<SEOLiveFeedbackProps> = ({ title, description }) => {
  const titleLength = title.length;
  const descLength = description.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { label: 'Rỗng', color: 'text-zinc-400' };
    if (titleLength < 50) return { label: 'Quá ngắn', color: 'text-amber-500' };
    if (titleLength >= 50 && titleLength <= 60) return { label: 'Tối ưu', color: 'text-emerald-500' };
    return { label: 'Quá dài', color: 'text-rose-500' };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { label: 'Rỗng', color: 'text-zinc-400' };
    if (descLength < 140) return { label: 'Quá ngắn', color: 'text-amber-500' };
    if (descLength >= 150 && descLength <= 160) return { label: 'Tối ưu', color: 'text-emerald-500' };
    return { label: 'Tốt', color: 'text-emerald-400' };
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();

  return (
    <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        Phân tích SEO Real-time
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meta Title Feedback */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Meta Title</span>
            <span className={`text-xs font-bold ${titleStatus.color}`}>
              {titleLength} / 60
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                titleLength > 60 ? 'bg-rose-500' : 
                titleLength >= 50 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
          <p className={`text-[10px] font-medium ${titleStatus.color}`}>
            {titleStatus.label}
          </p>
        </div>

        {/* Meta Description Feedback */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Meta Description</span>
            <span className={`text-xs font-bold ${descStatus.color}`}>
              {descLength} / 160
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                descLength > 160 ? 'bg-rose-500' : 
                descLength >= 150 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
          <p className={`text-[10px] font-medium ${descStatus.color}`}>
            {descStatus.label}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-[11px] text-zinc-400 italic">
          * Tiêu chí tối ưu giúp bài viết có tỉ lệ click (CTR) cao hơn trên Google.
        </p>
      </div>
    </div>
  );
};
