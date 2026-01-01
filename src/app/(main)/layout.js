import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../../app/globals.css";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Advocate - Your AI-powered legal guide.",
  description: "Get started with AI-powered legal guidance today.",
};

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}