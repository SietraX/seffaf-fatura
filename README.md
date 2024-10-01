# Seffaf Fatura - Mobile Phone Bill Comparison Platform

![dashboard](https://github.com/user-attachments/assets/7f45b36f-1a5a-47e7-9e10-ce43c4e8235a)

## Project Overview

Seffaf Fatura is a web application designed to collect and analyze mobile phone bill data in Turkey. The platform allows users to anonymously submit their phone bill details, compare prices across different providers, and gain insights into pricing trends and package distributions.

## Key Features

- Anonymous bill submission
- Interactive dashboard with various data visualizations
- Price comparison across different providers
- Analysis of gigabyte package distributions
- Contract start date trends
- User authentication

## Tech Stack

<div >
	<img width="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/>
	<img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/>
	<img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/5f8c622c-c217-4649-b0a9-7e0ee24bd704" alt="Next.js" title="Next.js"/>
	<img width="50" src="https://github.com/user-attachments/assets/e40fc76b-c8d8-47c3-bb53-c7795abaf596" alt="Supabase" title="Supabase"/>
  <img  height="50" src="https://images.clerk.com/static/logo-light-mode-400x400.png" alt="Clerk Icon" title="Clerk">
	<img width="50" src="https://user-images.githubusercontent.com/25181517/202896760-337261ed-ee92-4979-84c4-d4b829c7355d.png" alt="Tailwind CSS" title="Tailwind CSS"/>
	<img width="50" src="https://github.com/user-attachments/assets/e4bd419a-2a4a-459a-ba9a-d3324e693c4d" alt="ShadCn UI" title="ShadCn UI"/>
</div>
<br />

- **Frontend**: Typescript, React 18, Next.js 14
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context API

## Libraries and Tools

<div>
  <img  height="50" src="https://images.clerk.com/static/logo-light-mode-400x400.png" alt="Clerk Icon" title="Clerk">
  <img width="50" src="https://github.com/user-attachments/assets/e40fc76b-c8d8-47c3-bb53-c7795abaf596" alt="Supabase" title="Supabase"/>
  <img  width="50" height="50" src="https://framerusercontent.com/images/48ha9ZR9oZQGQ6gZ8YUfElP3T0A.png" alt="Framer Motion Icon" title="Framer Motion" />
  <img  width="50" height="50" src="https://github.com/user-attachments/assets/b94e49e7-bfa4-4de4-afca-61db0ba40e38" alt="Radix UI Icon" title="Radix UI" />
  <img  width="50" height="50" src="https://github.com/user-attachments/assets/2e8972d6-e639-4a7e-80a0-08ed304160be" alt="date-fns Icon" title="date-fns" />
  <img  width="50" height="50" src="https://github.com/tandpfun/skill-icons/raw/main/icons/D3-Dark.svg" alt="D3-array Icon" title="D3" />
</div>

- **@clerk/nextjs**: User authentication and management
- **@supabase/supabase-js**: Database interactions
- **framer-motion**: Animations
- **recharts**: Data visualization
- **@radix-ui**: UI components
- **date-fns**: Date manipulation
- **d3-array**: Data processing

## Pages

### Landing Page

![fatura_landing](https://github.com/user-attachments/assets/c7c7526c-c924-4923-af06-0514443686ce)

The landing page introduces users to the platform, displaying key statistics and encouraging users to submit their bill data or view existing statistics.

Features:
- Animated text introduction
- Call-to-action buttons for bill submission and dashboard access
- FAQ section

### Dashboard

![fatura_dashboard](https://github.com/user-attachments/assets/57b52b8f-e098-48f1-9e03-0f016532d431)

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
