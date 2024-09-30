import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import LandingPage from "@/components/landing-page";

export default function Home() {
  return (
    <main className="h-full overflow-hidden">
      <LandingPage />
      <FAQ />
    </main>
  );
}
