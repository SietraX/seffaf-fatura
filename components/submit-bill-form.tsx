"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePastMonths } from "@/utils/generatePastMonths";
import { useSubmitBill } from "@/hooks/useSubmitBill";
import { ReCaptcha } from "@/components/recaptcha";
import { BillFormData } from "@/types/bill";
import { useToast } from "@/hooks/use-toast";
import { generateBillStartDate } from "@/utils/generateBillStartDate";
import { monthNameToNumber } from "@/utils/monthNameToNumber";

const providers = ["Turkcell", "Türk Telekom", "Vodafone", "Netgsm"];
const gigabytePackages = [
  4, 5, 6, 8, 10, 12, 15, 16, 20, 25, 30, 40, 50, 60, 75, 80, 100, 150,
];

interface SubmitBillFormProps {
  onSubmissionComplete: () => void;
}

export function SubmitBillForm({ onSubmissionComplete }: SubmitBillFormProps) {
  const [formData, setFormData] = useState<BillFormData>({
    provider_name: "",
    gigabyte_package: 4,
    voice_call_limit: 100,
    sms_limit: 100,
    bill_price: 0,
    contract_start_month: "",
  });
  const [startMonths] = useState<string[]>(generatePastMonths(12));
  const { isSubmissionAllowed, submitBill } = useSubmitBill();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { toast } = useToast(); // Add this line to use the toast hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      toast({
        title: "Hata",
        description: "Lütfen reCAPTCHA doğrulamasını tamamlayın.",
        variant: "destructive",
      });
      return;
    }
    const monthName = formData.contract_start_month.split(" ")[0];
    const monthNumber = monthNameToNumber[monthName];
    if (!monthNumber) {
      toast({
        title: "Hata",
        description: "Geçersiz ay seçimi.",
        variant: "destructive",
      });
      return;
    }
    const contractStartDate = generateBillStartDate(monthNumber);
    const success = await submitBill({
      ...formData,
      recaptchaToken,
      contract_start_date: contractStartDate,
    });
    if (success) {
      onSubmissionComplete();
    } else {
      toast({
        title: "Hata",
        description:
          "Fatura gönderimi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const findClosestGBPackage = (value: number) => {
    return gigabytePackages.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-[80%]">
      <div className="flex items-center space-x-4">
        <Label htmlFor="provider_name" className="w-1/3">
          Operatör
        </Label>
        <Select
          onValueChange={(value) => handleInputChange("provider_name", value)}
        >
          <SelectTrigger id="provider_name" className="w-2/3">
            <SelectValue placeholder="Operatörü seçiniz" />
          </SelectTrigger>
          <SelectContent className="bg-gray-100">
            {providers.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="gigabyte_package" className="w-1/3">
          GB Paketi
        </Label>
        <Select
          onValueChange={(value) =>
            handleInputChange("gigabyte_package", Number(value))
          }
        >
          <SelectTrigger id="gigabyte_package" className="w-2/3">
            <SelectValue placeholder="Paketinizi seçiniz" />
          </SelectTrigger>
          <SelectContent className="bg-gray-100">
            {gigabytePackages.map((gb) => (
              <SelectItem key={gb} value={gb.toString()}>
                {gb} GB
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="voice_call_limit" className="w-1/3">
          Dakika Limiti
        </Label>
        <div className="w-2/3 space-y-2">
          <SliderPrimitive.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            defaultValue={[formData.voice_call_limit]}
            max={5000}
            min={100}
            step={100}
            onValueChange={(value) =>
              handleInputChange("voice_call_limit", value[0])
            }
          >
            <SliderPrimitive.Track className="bg-gray-200 relative grow rounded-full h-2">
              <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full focus:outline-none"
              aria-label="Voice call limit"
            />
          </SliderPrimitive.Root>
          <div className="text-sm text-muted-foreground text-right">
            {formData.voice_call_limit} dakika
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="sms_limit" className="w-1/3">
          SMS Limiti
        </Label>
        <div className="w-2/3 space-y-2">
          <SliderPrimitive.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            defaultValue={[formData.sms_limit]}
            max={5000}
            min={100}
            step={100}
            onValueChange={(value) => handleInputChange("sms_limit", value[0])}
          >
            <SliderPrimitive.Track className="bg-gray-200 relative grow rounded-full h-2">
              <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full focus:outline-none"
              aria-label="SMS limit"
            />
          </SliderPrimitive.Root>
          <div className="text-sm text-muted-foreground text-right">
            {formData.sms_limit} SMS
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="bill_price" className="w-1/3">
          Fatura Tutarı
        </Label>
        <div className="w-2/3">
          <Input
            type="number"
            id="bill_price"
            value={formData.bill_price}
            onChange={(e) =>
              handleInputChange("bill_price", Number(e.target.value))
            }
            className="w-full text-right"
            min={0}
            max={2000}
            step={1}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="contract_start_month" className="w-1/3">
          Sözleşme yenileme tarihi
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-2/3 justify-start">
              {formData.contract_start_month || "Ay seçiniz"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0 bg-gray-100">
            <div className="grid grid-cols-3 gap-2 p-2">
              {startMonths.map((month) => (
                <Button
                  key={month}
                  size="sm"
                  variant={
                    formData.contract_start_month === month
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleInputChange("contract_start_month", month)
                  }
                  className="w-full"
                >
                  {month}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-center mt-6">
        <ReCaptcha onVerify={handleRecaptchaVerify} />
      </div>

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={!isSubmissionAllowed || !recaptchaToken}
      >
        Paylaş
      </Button>
    </form>
  );
}
