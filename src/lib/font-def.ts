import { Inter } from "next/font/google";
import {
  Kalam,
  Pacifico,
  Caveat,
  Amatic_SC,
} from "next/font/google"; // Import all four fonts

// 1. Kalam (Handwritten, casual)
export const fontKalam = Kalam({
  weight: ["400", "700"], // Loading necessary weights
  subsets: ["latin"],
  variable: "--font-kalam", // Define CSS variable
});

// 2. Pacifico (Smooth script, retro feel)
export const fontPacifico = Pacifico({
  weight: "400", // Pacifico only has one weight
  subsets: ["latin"],
  variable: "--font-pacifico",
});

// 3. Caveat (Loose, friendly handwriting)
export const fontCaveat = Caveat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
});

// 4. Amatic SC (Tall, condensed display style)
export const fontAmaticSC = Amatic_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-amatic-sc",
});

const inter = Inter({ subsets: ["latin"] });

export default inter;