import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartaVideo from "@/components/ui/carta-video";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header /> {/* Global Header [cite: 9] */}
      
      <main className="mb-8 flex-1 flex flex-col items-center pt-10 px-6 bg-slate-50">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 text-center">
          Write Better Emails, <span className="text-indigo-600">Faster.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl text-center mb-6">
          Stop staring at a blank screen. Let our AI draft professional, friendly, or urgent emails for you in seconds.
        </p>
        
        {/* Intro Video Placeholder [cite: 13] */}
        {/* <div className="mb-12 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border flex items-center justify-center relative overflow- group"> */}
          {/* <div className="bg-red-300 flex items-center justify-center"> */}
             {/* <span className="text-slate-400 font-medium">Introductory Video Clip [cite: 13]</span> */}
             {/* Simulate Play Button */}
             {/* <div className="absolute w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
             </div> */}
             <CartaVideo />
          {/* </div> */}
        {/* </div> */}
      </main>

      <Footer /> {/* Global Footer  */}
    </div>
  );
}