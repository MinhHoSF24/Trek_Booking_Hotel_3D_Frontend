import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
const inter = Inter({ subsets: ["latin"] });
import { Roboto } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Trekbooking",
  description: "Generated by create next app",
};
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{
  return (
    <div className={roboto.className}>

      <Navbar title="" />
      {children}
      <Footer />
  
  </div>
  );
}