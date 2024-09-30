"use client";

import React, { useState, useEffect } from "react";
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
import { generatePastMonths } from "@/utils/generatePastMonths";
import { useSubmitBill } from "@/hooks/useSubmitBill";
import { ReCaptcha } from "@/components/recaptcha";
import { BillFormData } from "@/types/bill";
import { useToast } from "@/hooks/use-toast";
import { generateBillStartDate } from "@/utils/generateBillStartDate";
import { monthNameToNumber } from "@/utils/monthNameToNumber";
import { Send } from "lucide-react"; // Import the Send icon

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
    gigabyte_package: null,
    voice_call_limit: 100,
    sms_limit: 100,
    bill_price: null,
    contract_start_month: "",
  });
  const [errors, setErrors] = useState<{[key in keyof BillFormData]?: string}>({});
  const [isTouched, setIsTouched] = useState<{[key in keyof BillFormData]?: boolean}>({});
  const [startMonths] = useState<string[]>(generatePastMonths(12));
  const { isSubmissionAllowed, submitBill } = useSubmitBill();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();
  const [isMonthPopoverOpen, setIsMonthPopoverOpen] = useState(false);

  const handleInputChange = (name: keyof BillFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name: keyof BillFormData, value: string | number) => {
    let error = '';
    switch (name) {
      case 'provider_name':
        error = value ? '' : 'Operatör seçimi zorunludur';
        break;
      case 'gigabyte_package':
        error = value && value !== 0 ? '' : 'GB paketi seçimi zorunludur';
        break;
      case 'voice_call_limit':
      case 'sms_limit':
        if (typeof value === 'number') {
          error = value < 100 || value > 5000 ? `${name === 'voice_call_limit' ? 'Dakika' : 'SMS'} limiti 100 ile 5000 arasında olmalıdır` : '';
        }
        break;
      case 'bill_price':
        if (value === null) {
          error = 'Fatura tutarı zorunludur';
        } else if (typeof value === 'number') {
          error = value < 0 || value > 2000 ? 'Fatura tutarı 0 ile 2000 arasında olmalıdır' : '';
        }
        break;
      case 'contract_start_month':
        error = value ? '' : 'Sözleşme yenileme tarihi seçimi zorunludur';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name: keyof BillFormData) => {
    setIsTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name] as string | number);
  };

  useEffect(() => {
    Object.keys(formData).forEach((key) => {
      validateField(key as keyof BillFormData, formData[key as keyof BillFormData] as string | number);
    });
  }, [formData]);

  const validateForm = () => {
    const newErrors: {[key in keyof BillFormData]?: string} = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof BillFormData;
      const value = formData[fieldName];

      if (value === "" || value === null) {
        newErrors[fieldName] = "Bu alan zorunludur";
        isValid = false;
      } else {
        switch (fieldName) {
          case 'voice_call_limit':
          case 'sms_limit':
            if (typeof value === 'number' && (value < 100 || value > 5000)) {
              newErrors[fieldName] = `${fieldName === 'voice_call_limit' ? 'Dakika' : 'SMS'} limiti 100 ile 5000 arasında olmalıdır`;
              isValid = false;
            }
            break;
          case 'bill_price':
            if (typeof value === 'number' && (value < 0 || value > 2000)) {
              newErrors[fieldName] = 'Fatura tutarı 0 ile 2000 arasında olmalıdır';
              isValid = false;
            }
            break;
        }
      }
    });

    setErrors(newErrors);
    setIsTouched(Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {}));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doğru şekilde doldurun.",
        variant: "destructive",
      });
      return;
    }
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
      recaptchaToken: recaptchaToken,
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

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
  };

  // Add this useEffect to check for token expiration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recaptchaToken) {
      // reCAPTCHA tokens typically expire after 2 minutes
      timer = setTimeout(() => {
        setRecaptchaToken(null);
      }, 2 * 60 * 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [recaptchaToken]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col justify-between py-6 sm:py-0 h-full sm:h-auto">
      <div className="space-y-6">
        {/* Provider Name */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="provider_name" className="w-full sm:w-1/3 mb-2 sm:mb-0">
            Operatör
          </Label>
          <div className="w-full sm:w-2/3">
            <Select
              onValueChange={(value) => handleInputChange("provider_name", value)}
              onOpenChange={() => handleBlur("provider_name")}
            >
              <SelectTrigger id="provider_name" className={`w-full ${errors.provider_name && isTouched.provider_name ? 'border-red-500' : ''}`}>
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
            {errors.provider_name && isTouched.provider_name && (
              <p className="text-red-500 text-sm mt-1">{errors.provider_name}</p>
            )}
          </div>
        </div>

        {/* Gigabyte Package */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="gigabyte_package" className="w-full sm:w-1/3 mb-2 sm:mb-0">
            GB Paketi
          </Label>
          <div className="w-full sm:w-2/3">
            <Select
              onValueChange={(value) =>
                handleInputChange("gigabyte_package", Number(value))
              }
              onOpenChange={() => handleBlur("gigabyte_package")}
            >
              <SelectTrigger id="gigabyte_package" className={`w-full ${errors.gigabyte_package && isTouched.gigabyte_package ? 'border-red-500' : ''}`}>
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
            {errors.gigabyte_package && isTouched.gigabyte_package && (
              <p className="text-red-500 text-sm mt-1">{errors.gigabyte_package}</p>
            )}
          </div>
        </div>

        {/* Voice Call Limit */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="voice_call_limit" className="w-full sm:w-1/3 mb-2 sm:mb-0">
            Dakika Limiti
          </Label>
          <div className="w-full sm:w-2/3 space-y-2">
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

        {/* SMS Limit */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="sms_limit" className="w-full sm:w-1/3 mb-2 sm:mb-0">
            SMS Limiti
          </Label>
          <div className="w-full sm:w-2/3 space-y-2">
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

        {/* Bill Price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="bill_price" className="w-full sm:w-1/3 mb-2 sm:mb-0">
            Fatura Tutarı
          </Label>
          <div className="w-full sm:w-2/3">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="bill_price"
              value={formData.bill_price === null ? '' : formData.bill_price}
              onChange={(e) => handleInputChange("bill_price", e.target.value)}
              onBlur={() => handleBlur("bill_price")}
              className={`w-full text-right ${errors.bill_price && isTouched.bill_price ? 'border-red-500' : ''}`}
              aria-invalid={errors.bill_price ? 'true' : 'false'}
              aria-describedby={errors.bill_price ? 'bill_price_error' : undefined}
            />
            {errors.bill_price && isTouched.bill_price && (
              <p id="bill_price_error" className="text-red-500 text-sm mt-1">{errors.bill_price}</p>
            )}
          </div>
        </div>

        {/* Contract Start Month */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="contract_start_month" className="w-full sm:w-1/3 mb-2 sm:mb-0">
            Sözleşme yenileme tarihi
          </Label>
          <div className="w-full sm:w-2/3">
            <Popover open={isMonthPopoverOpen} onOpenChange={setIsMonthPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`w-full justify-start ${errors.contract_start_month && isTouched.contract_start_month ? 'border-red-500' : ''}`}>
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
                      onClick={() => {
                        handleInputChange("contract_start_month", month);
                        setIsMonthPopoverOpen(false);
                      }}
                      className="w-full"
                    >
                      {month}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {errors.contract_start_month && isTouched.contract_start_month && (
              <p className="text-red-500 text-sm mt-1">{errors.contract_start_month}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-auto sm:mt-6">
        <div className="flex justify-center">
          <ReCaptcha onVerify={handleRecaptchaVerify} />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white group"
          disabled={!recaptchaToken}
        >
          <Send className="mr-2 h-5 w-5 group-hover:scale-125 group-hover:translate-x-[0.5px] group-hover:-translate-y-[0.5px] transition" />
          Paylaş
        </Button>
      </div>
    </form>
  );
}