import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { sampleData } from "@/mock/data"
import { useState } from 'react'
import { Input } from "@/components/ui/input"

const BillChart = dynamic(() => import('@/components/bill-chart'), { ssr: false })

function OTPTest() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')

  const sendOTP = async () => {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    })
    const data = await res.json()
    setMessage(data.message || data.error)
  }

  const verifyOTP = async () => {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp }),
    })
    const data = await res.json()
    setMessage(data.message || data.error)
  }

  return (
    <div className="space-y-4">
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />
      <Button onClick={sendOTP}>Send OTP</Button>
      <Input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <Button onClick={verifyOTP}>Verify OTP</Button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <main className="max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Anonim Mobil Fatura Takipçisi
        </h1>
        <p className="text-xl text-center text-gray-600">
          Mobil telefon faturanızı anonim olarak diğerleriyle karşılaştırın ve bilinçli kararlar verin.
        </p>
        
        <Card className="w-full">
            <BillChart data={sampleData} />
        </Card>
        
        <div className="flex justify-center">
          <Link href="/share-bill">
            <Button size="lg" className="text-lg">
              Faturanı Anonim Olarak Paylaş
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Neden Faturanızı Paylaşmalısınız?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Diğerlerine mobil planları hakkında bilinçli kararlar vermeleri için yardımcı olun</li>
              <li>Harcamalarınızı topluluk ortalaması ile karşılaştırın</li>
              <li>Mobil hizmet sektöründe fiyat şeffaflığına katkıda bulunun</li>
              <li>Tamamen anonim - kişisel bilgileriniz toplanmaz</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test OTP</CardTitle>
          </CardHeader>
          <CardContent>
            <OTPTest />
          </CardContent>
        </Card>
      </main>
      
      <footer className="mt-12 text-center text-gray-500">
        © {new Date().getFullYear()} Anonim Mobil Fatura Takipçisi. Tüm hakları saklıdır.
      </footer>
    </div>
  )
}
