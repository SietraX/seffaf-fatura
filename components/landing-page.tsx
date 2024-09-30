"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitBillButton } from "./submit-bill-button";
import { useBillData } from "@/contexts/BillDataContext";
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const useTypewriter = (
  text: string,
  speed: number = 50,
  startDelay: number = 0
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setHasStarted(true), startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, hasStarted, speed, text]);

  return { displayedText, isComplete };
};

export default function LandingPage() {
  const router = useRouter();
  const { averageBill } = useBillData();

  const averageBillText = `Türkiye'de ortalama telefon faturası ₺${averageBill}'dir`;

  const { displayedText: text1, isComplete: isComplete1 } = useTypewriter(
    averageBillText,
    50,
    0
  );
  const { displayedText: text2, isComplete: isComplete2 } = useTypewriter(
    "Son zamlar %100'ün üzerindedir",
    50,
    2000
  );
  const { displayedText: headline, isComplete: isComplete3 } = useTypewriter(
    "FATURANIZI PAYLAŞIN, FARKINDALIK OLUŞTURUN",
    50,
    4000
  );

  const handleCheckStats = () => {
    router.push("/dashboard");
  };

  return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800 p-4 sm:p-8 flex items-center justify-center overflow-auto">
      <div className="max-w-8xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 sm:space-y-8 md:pl-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-semibold"
          >
            {text1}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isComplete1 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-semibold"
          >
            {text2}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: isComplete2 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            {headline}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isComplete3 ? 1 : 0,
              y: isComplete3 ? 0 : 20,
            }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center md:justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8"
          >
            <div className="relative">
              <SubmitBillButton />
            </div>
            <div className="relative">
              <Button
                onClick={handleCheckStats}
                className="landing-button bg-green-500 hover:bg-green-600"
              >
                <Search className="mr-2 h-5 w-5" />
                Faturaları görüntüle
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isComplete3 ? 1 : 0,
            y: isComplete3 ? 0 : 20,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <Image
            src="/dashboard.png"
            alt="Dashboard Screenshot"
            width={1920}
            height={1080}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            quality={100}
            className="rounded-xl"
          />
          <div className="absolute top-[17%] right-[15%] z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-sm"></div>
              <div className="relative bg-red-500 text-white w-20 h-20 rounded-full font-bold text-3xl shadow-lg flex items-center justify-center">
                YENİ
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
