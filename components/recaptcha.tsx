'use client'

import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface ReCaptchaProps {
  onVerify: (token: string | null) => void
}

export function ReCaptcha({ onVerify }: ReCaptchaProps) {
  return (
    <ReCAPTCHA
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      onChange={onVerify}
    />
  )
}