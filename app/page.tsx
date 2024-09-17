import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const BillChart = dynamic(() => import('@/components/BillChart'), { ssr: false })

const sampleData = [
  { provider: 'TeleCo', averageBill: 45 },
  { provider: 'MobiNet', averageBill: 52 },
  { provider: 'CellWave', averageBill: 48 },
  { provider: 'PhonePlus', averageBill: 55 },
  { provider: 'ConnectAll', averageBill: 50 },
]

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
          <CardHeader>
            <CardTitle>Sağlayıcıya Göre Ortalama Aylık Faturalar</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <BillChart data={sampleData} />
          </CardContent>
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
      </main>
      
      <footer className="mt-12 text-center text-gray-500">
        © {new Date().getFullYear()} Anonim Mobil Fatura Takipçisi. Tüm hakları saklıdır.
      </footer>
    </div>
  )
}
