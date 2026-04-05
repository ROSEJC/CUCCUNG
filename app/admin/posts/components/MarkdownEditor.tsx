'use client';

import React from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2 prose-zinc dark:prose-invert max-w-none">
      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Nội dung bài viết (Markdown) <span className="text-rose-500">*</span>
      </label>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden min-h-[500px]">
        <MdEditor
          modelValue={value}
          onChange={onChange}
          language="en-US"
          toolbars={[
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            '-',
            'title',
            'sub',
            'sup',
            'quote',
            'unorderedList',
            'orderedList',
            'task',
            '-',
            'codeRow',
            'code',
            'link',
            'image',
            'table',
            'mermaid',
            'katex',
            '-',
            'revoke',
            'next',
            'save',
            '=',
            'pageFullscreen',
            'fullscreen',
            'preview',
            'htmlPreview',
            'catalog',
          ]}
          style={{ height: '500px' }}
          theme={undefined} // Auto detect or can be controlled via context
        />
      </div>
      <p className="text-[11px] text-zinc-500 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
        Sử dụng ## cho tiêu đề H2 và ### cho tiêu đề H3 để tối ưu cấu trúc nội dung.
      </p>
    </div>
  );
};
