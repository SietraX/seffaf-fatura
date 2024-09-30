# Fatura - Mobile Phone Bill Comparison Platform

## Project Overview

Fatura is a web application designed to collect and analyze mobile phone bill data in Turkey. The platform allows users to anonymously submit their phone bill details, compare prices across different providers, and gain insights into pricing trends and package distributions.

## Key Features

- Anonymous bill submission
- Interactive dashboard with various data visualizations
- Price comparison across different providers
- Analysis of gigabyte package distributions
- Contract start date trends
- User authentication

## Tech Stack

- **Frontend**: Next.js 14 (React)
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Context API

## Libraries and Tools

- **@clerk/nextjs**: User authentication and management
- **@supabase/supabase-js**: Database interactions
- **framer-motion**: Animations
- **recharts**: Data visualization
- **@radix-ui**: UI components
- **date-fns**: Date manipulation
- **d3-array**: Data processing

## Pages

### Landing Page

The landing page introduces users to the platform, displaying key statistics and encouraging users to submit their bill data or view existing statistics.

Features:
- Animated text introduction
- Call-to-action buttons for bill submission and dashboard access
- FAQ section

### Dashboard

The dashboard provides a comprehensive overview of the collected bill data through various charts and visualizations.

Features:
- Card container with key metrics (total submissions, daily/monthly trends)
- Bill chart comparing average prices across providers
- Price action chart showing price trends over time
- Provider distribution pie chart
- Gigabyte package distribution chart
- Contract start month distribution chart
- Data table with detailed bill information

### Bill Submission Form

A form allowing users to submit their bill details anonymously.

Features:
- Input fields for bill amount, provider, package details, etc.
- Sliders for easy input of numeric values
- ReCAPTCHA integration for spam prevention

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (Supabase, Clerk, etc.)
4. Run the development server: `npm run dev`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).