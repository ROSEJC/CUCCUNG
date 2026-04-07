# 🍼 CucCung SEO Website System

Hệ thống website nội dung cho mẹ và bé, tối ưu hóa SEO vượt trội và áp dụng các tiêu chuẩn E-E-A-T cao nhất.

## 🚀 Tính năng nổi bật

- **Tối ưu SEO Toàn diện**: 
  - Tự động tạo JSON-LD Structured Data (Article, Breadcrumb, FAQ).
  - Tích hợp sitemap.xml và robots.txt tự động.
  - Quản lý Meta Title, Description, Excerpt riêng biệt cho từng bài viết.
- **Hệ thống CMS mạnh mẽ**: 
  - Soạn thảo bằng Markdown (MDX).
  - Tự động tạo mục lục (TOC) từ các thẻ H2, H3.
  - Quản lý bài viết, danh mục, tác giả theo mô hình **Silo Structure**.
- **Hiệu năng vượt trội**:
  - Tải trang siêu nhanh nhờ SSG (Static Site Generation) và ISR.
  - Tự động tối ưu hóa hình ảnh sang WebP/AVIF bằng Sharp.
- **E-E-A-T Compliant**:
  - Quản lý hồ sơ tác giả chuyên sâu với bio và avatar.
  - Hiển thị Author Box cuối mỗi bài viết để tăng độ tin cậy.

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js v14+ (App Router)
- **Database**: Prisma ORM & PostgreSQL
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss) & @tailwindcss/typography
- **Auth**: Next-auth v5
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Cấu trúc Thư mục Chính

- `app/(public)`: Các trang công khai dành cho khách (Trang chủ, Bài viết, Danh mục).
- `app/admin`: Hệ thống quản trị (Dashboard, Quản lý bài viết).
- `prisma`: Schema và các script seed dữ liệu.
- `lib`: Các utility functions và config (DB, Auth).

## 🛠️ Hướng dẫn Cài đặt

1. **Clone repository**:
   ```bash
   git clone <repo-url>
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình môi trường**:
   - Tạo file `.env` từ mẫu `.env.example`.
   - Điền URL của cơ sở dữ liệu và các biến NextAuth.

4. **Setup Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed # Để tạo tài khoản admin và danh mục mẫu
   ```

5. **Chạy server**:
   ```bash
   npm run dev
   ```

## 🔐 Tài khoản Admin mặc định (Sau khi chạy seed)

- **Email**: `admin@cuccung.vn`
- **Password**: `admin123`

---
*Phát triển bởi đội ngũ Cuccung.vn - Cùng mẹ chăm sóc bé yêu mỗi ngày.*
