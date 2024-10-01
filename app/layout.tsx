import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { BillDataProvider } from "@/contexts/BillDataContext";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Fatura | Telefon Faturası Kıyaslama Sayfası",
  description: "Fatura, telefon faturası kıyaslaması sayfasıdır",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en" className="h-full">
        <body className="flex flex-col h-full md:bg-gray-100">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BillDataProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
            </BillDataProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
