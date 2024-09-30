import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/hakkimizda" className="text-base text-gray-500 hover:text-gray-900">
              Hakkımızda
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/gizlilik" className="text-base text-gray-500 hover:text-gray-900">
              Gizlilik Politikası
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/kullanim-kosullari" className="text-base text-gray-500 hover:text-gray-900">
              Kullanım Koşulları
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2024 Mobil Fatura Takipçisi. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}