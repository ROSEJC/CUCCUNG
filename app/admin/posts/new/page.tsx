import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PostForm } from "../components/PostForm";

export default async function NewPostPage() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch categories for the dropdown
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    },
    select: {
      id: true,
      name: true
    }
  });

  return (
    <div className="animate-fade-in">
      <PostForm categories={categories} />
    </div>
  );
}
