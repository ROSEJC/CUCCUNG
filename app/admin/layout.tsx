import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, User as UserIcon, FileText, Settings } from "lucide-react";
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col pt-8 sticky top-0 h-screen">
        <div className="px-8 mb-10 flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-gray-800">CucCung</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center space-x-3 px-4 py-3 hover:bg-pink-50 hover:text-pink-600 text-gray-500 rounded-xl font-medium transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/admin/posts" 
            className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-all"
          >
            <FileText className="w-5 h-5" />
            <span>Bài viết</span>
          </Link>
          <Link 
            href="/admin/profile" 
            className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-all"
          >
            <UserIcon className="w-5 h-5" />
            <span>Hồ sơ</span>
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl font-medium transition-all"
          >
            <Settings className="w-5 h-5" />
            <span>Cài đặt</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
