import Link from 'next/link';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/dashboard-sidebar';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const { getUser } = getKindeServerSession();
  const user: KindeUser<Record<string, any>> | null = await getUser();
  const userPicture = user?.picture ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";


  if (!user?.id) {
    return redirect("/api/auth/login?"); // Redirect unauthenticated users to the home page
  }

  // params.userId = user.id;

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 h-fit">
        {/* Vertical Sidebar Menu */}
        {/* Vertical Sidebar Menu - Responsive Component */}
        <DashboardSidebar user={user} />
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Child Page Content is rendered here */}
          <div className="p-6 h-fit">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}