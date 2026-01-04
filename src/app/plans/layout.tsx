// 'use client'
import Link from 'next/link';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import navLinks from "@/data/navLinks.json";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  const { getUser } = getKindeServerSession();
  const user: KindeUser<Record<string, any>> | null = await getUser();
  const userPicture = user?.picture ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center pt-20 px-6 bg-slate-50">
        {children}
      </main>
      <Footer />
    </>
  );
}