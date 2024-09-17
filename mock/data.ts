import { ChartConfig } from "@/components/ui/chart"

export const sampleData = [
  { provider: 'Turkcell', fiveGigabytes: 5, tenGigabytes: 45, fifteenGigabytes: 10, twentyGigabytes: 300, twentyFiveGigabytes: 500, thirtyGigabytes: 50, fortyGigabytes: 50, fiftyGigabytes: 50, sixtyGigabytes: 40, eightyGigabytes: 50, hundredGigabytes: 50  },
  { provider: 'Türk Telekom', fiveGigabytes: 5, tenGigabytes: 52, fifteenGigabytes: 15, twentyGigabytes: 400, twentyFiveGigabytes: 500, thirtyGigabytes: 50, fortyGigabytes: 50, fiftyGigabytes: 50, sixtyGigabytes: 40, eightyGigabytes: 50, hundredGigabytes: 50  },
  { provider: 'Vodafone', fiveGigabytes: 5, tenGigabytes: 48, fifteenGigabytes: 12, twentyGigabytes: 350, twentyFiveGigabytes: 500, thirtyGigabytes: 50, fortyGigabytes: 50, fiftyGigabytes: 50, sixtyGigabytes: 40, eightyGigabytes: 50, hundredGigabytes: 50  },
  { provider: 'Netgsm', fiveGigabytes: 5, tenGigabytes: 50, fifteenGigabytes: 18, twentyGigabytes: 450, twentyFiveGigabytes: 500, thirtyGigabytes: 50, fortyGigabytes: 50, fiftyGigabytes: 50, sixtyGigabytes: 40, eightyGigabytes: 50, hundredGigabytes: 50  },
]

export const chartOptions = [
  { key: 'fiveGigabytes', label: '5 GB' },
  { key: 'tenGigabytes', label: '10 GB' },
  { key: 'fifteenGigabytes', label: '15 GB' },
  { key: 'twentyGigabytes', label: '20 GB' },
  { key: 'twentyFiveGigabytes', label: '25 GB' },
  { key: 'thirtyGigabytes', label: '30 GB' },
  { key: 'fortyGigabytes', label: '40 GB' },
  { key: 'fiftyGigabytes', label: '50 GB' },
  { key: 'sixtyGigabytes', label: '60 GB' },
  { key: 'eightyGigabytes', label: '80 GB' },
  { key: 'hundredGigabytes', label: '100 GB' },
]

export const chartConfig: ChartConfig = {
  fiveGigabytes: {
    label: "5 GB",
    color: "hsl(var(--chart-1))",
  },
  tenGigabytes: {
    label: "10 GB",
    color: "hsl(var(--chart-2))",
  },
  fifteenGigabytes: {
    label: "15 GB",
    color: "hsl(var(--chart-3))",
  },
  twentyGigabytes: {
    label: "20 GB",
    color: "hsl(var(--chart-4))",
  },
  twentyFiveGigabytes: {
    label: "25 GB",
    color: "hsl(var(--chart-5))",
  },
  thirtyGigabytes: {
    label: "30 GB",
    color: "hsl(var(--chart-6))",
  },
  fortyGigabytes: {
    label: "40 GB",
    color: "hsl(var(--chart-7))",
  },
  fiftyGigabytes: {
    label: "50 GB",
    color: "hsl(var(--chart-8))",
  },
  sixtyGigabytes: {
    label: "60 GB",
    color: "hsl(var(--chart-9))",
  },
  eightyGigabytes: {
    label: "80 GB",
    color: "hsl(var(--chart-10))",
  },
  hundredGigabytes: {
    label: "100 GB",
    color: "hsl(var(--chart-11))",
  },
}