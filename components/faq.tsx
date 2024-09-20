'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqData = [
  {
    question: "What is the purpose of this project?",
    answer: "This project aims to collect anonymous data on mobile phone bills to raise awareness about pricing trends and help consumers make informed decisions."
  },
  {
    question: "How often can I submit my bill?",
    answer: "You can submit your bill once every 30 days to ensure we have the most up-to-date information."
  },
  {
    question: "Is my data kept anonymous?",
    answer: "Yes, all submitted bill data is anonymized. We do not collect or store any personal information that could identify individual users."
  },
  {
    question: "What kind of insights can I gain from the charts?",
    answer: "Our charts provide insights on average bill prices across providers, distribution of gigabyte packages, and price trends over time, helping you compare your plan with market averages."
  },
  {
    question: "Can I update my submitted bill information?",
    answer: "Yes, you can update your bill information every 30 days. This helps us maintain current and accurate data."
  }
]

export function FAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
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