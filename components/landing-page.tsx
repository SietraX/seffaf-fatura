"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SubmitBillButton } from './submit-bill-button'

const useTypewriter = (text: string, speed: number = 50, startDelay: number = 0) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setHasStarted(true), startDelay)
    return () => clearTimeout(startTimer)
  }, [startDelay])

  useEffect(() => {
    if (!hasStarted) return

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, hasStarted, speed, text])

  return { displayedText, isComplete }
}

export default function LandingPage() {
  const router = useRouter()
  const { displayedText: text1, isComplete: isComplete1 } = useTypewriter("The average phone bill in Turkey is ₺300", 50, 0)
  const { displayedText: text2, isComplete: isComplete2 } = useTypewriter("Recent price increase: 200%", 50, 2000)
  const { displayedText: headline, isComplete: isComplete3 } = useTypewriter("REVOLUTIONIZE YOUR BILL INSIGHTS", 50, 4000)

  const handleCheckStats = () => {
    router.push('/dashboard')
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-white text-gray-800 p-4 sm:p-8 flex items-center justify-center overflow-auto">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 sm:space-y-8">
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
        </div>
        <div className="relative h-full flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isComplete3 ? 1 : 0, x: isComplete3 ? 0 : 50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <svg width="100" height="50" viewBox="0 0 150 75" className="text-blue-500">
                  <path d="M0,37.5 Q75,0 150,37.5" fill="none" stroke="currentColor" strokeWidth="3" />
                  <polygon points="142.5,33 150,37.5 142.5,42" fill="currentColor" />
                </svg>
                <SubmitBillButton />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isComplete3 ? 1 : 0, x: isComplete3 ? 0 : 50 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <svg width="100" height="50" viewBox="0 0 150 75" className="text-green-500">
                  <path d="M0,37.5 Q75,75 150,37.5" fill="none" stroke="currentColor" strokeWidth="3" />
                  <polygon points="142.5,33 150,37.5 142.5,42" fill="currentColor" />
                </svg>
                <button 
                  onClick={handleCheckStats}
                  className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Check stats
                </button>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isComplete3 ? 1 : 0, scale: isComplete3 ? 1 : 0.9 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 self-end"
          >
            <div className="relative w-full max-w-md aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/placeholder.svg"
                alt="Dashboard Screenshot"
                style={{ objectFit: 'cover' }}
                fill
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-white">DASHBOARD SCREENSHOT</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}