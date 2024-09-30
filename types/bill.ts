export interface BillFormData {
  provider_name: string;
  gigabyte_package: number | null;  // Allow null value
  voice_call_limit: number;
  sms_limit: number;
  bill_price: number | null;
  contract_start_month: string;
  contract_start_date?: Date;
}