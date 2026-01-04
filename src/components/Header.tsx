import Link from "next/link";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import UserIcon from "./UserIcon";
import { UserNav } from "./UserNav";
import Logo from "./Logo";
import { MobileMenu } from "./mobile-menu";



async function Header() {
  const { getUser } = getKindeServerSession();
  const user: KindeUser<Record<string, any>> | null = await getUser();
  const userPicture = user?.picture ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <header className="w-full border-b bg-white p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Menu Links [cite: 11] */}
      <nav className="flex gap-6 text-sm font-medium text-gray-600 items-center">
        <Logo />
        <div className="hidden md:flex gap-6 ml-4">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          {
            user?.id ? <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
              : <span className="text-gray-300">Dashboard</span>
          }

          <Link href="/plans" className="hover:text-indigo-600">Pricing</Link>
        </div>
      </nav>

      <div className="flex items-center gap-4">
        <MobileMenu user={user} />
        {/* Auth Buttons  */}
        {
          user ?
            <UserNav />
            :
            <>
              <LoginLink className="text-sm text-gray-700 hover:underline hidden sm:block">Sign In</LoginLink>
              <RegisterLink className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors">
                Get Started
              </RegisterLink>
            </>
        }
      </div>
    </header>
  );
}

export default Header;