import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mb-10 px-4 pb-8 pt-16 text-center text-gray-500">
      <small className="mb-2 block text-xs">
        &copy; 2024 Mobil Fatura Paylaşım Platformu. Tüm hakları saklıdır.
      </small>
      <p className="text-xs">
        <Link
          href="https://x.com/Sietradev"
          target="_blank"
          className="font-semibold text-gray-400 hover:text-gray-300 transition-colors"
        >
          @Sietra
        </Link>
      </p>
    </footer>
  )
}