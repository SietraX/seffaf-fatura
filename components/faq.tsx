'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqData = [
  {
    question: "Bu projenin amacı nedir?",
    answer: "Bu proje, cep telefonu faturalarına ilişkin anonim verileri toplayarak fiyatlandırma eğilimleri hakkında farkındalık yaratmayı ve tüketicilerin bilinçli kararlar vermesine yardımcı olmayı amaçlamaktadır."
  },
  {
    question: "Faturamı ne sıklıkla gönderebilirim?",
    answer: "En güncel bilgilere sahip olmamızı sağlamak için faturanızı 30 günde bir gönderebilirsiniz."
  },
  {
    question: "Verilerim anonim tutuluyor mu?",
    answer: "Evet, gönderilen tüm fatura verileri anonimleştirilmektedir. Bireysel kullanıcıları tanımlayabilecek hiçbir kişisel bilgiyi toplamıyor veya saklamıyoruz."
  },
  {
    question: "Grafiklerden ne tür bilgiler edinebilirim?",
    answer: "Grafiklerimiz, operatörler arasındaki ortalama fatura fiyatları, gigabayt paketlerinin dağılımı ve zaman içindeki fiyat eğilimleri hakkında bilgiler sunarak, planınızı piyasa ortalamaları ile karşılaştırmanıza yardımcı olur."
  },
  {
    question: "Gönderdiğim fatura bilgilerini güncelleyebilir miyim?",
    answer: "Evet, fatura bilgilerinizi her 30 günde bir güncelleyebilirsiniz. Bu, güncel ve doğru verileri korumamıza yardımcı olur."
  }
]

export function FAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto my-8 pt-24">
      <h2 className="text-2xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}