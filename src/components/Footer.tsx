import Link from "next/link";
import { Twitter, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import CartaAILogoSMDark from '@/../public/images/Carta-ai_Logo_sm_dark.png';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-8 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="mb-4 md:mb-0">
          <div className="font-semibold text-white flex flex-row justify-center items-center">
            {/* <span className='font-pacifico text-lg mr-2 font-normal'>Carta</span>
            <div className="h-7 w-7 bg-indigo-600 rounded-tr-sm rounded-bl-sm flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
            </div> */}
            <Image src={CartaAILogoSMDark} 
              className='ml-2 h-6 w-20 md:h-6 md:w-20' alt='Carta-AI Logo at the header' />
          </div>
          <p className="text-xs mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        
        {/* Legal Links  */}
        <div className="flex gap-6 text-sm mb-4 md:mb-0">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
        </div>

        {/* Social Media Buttons  */}
        <div className="flex gap-4">
          <Twitter className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
          <Facebook className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
          <Instagram className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}