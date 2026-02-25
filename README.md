# Dashboard Statistik Desa Pondokrejo

This project is a statistical dashboard website for Kalurahan Pondokrejo, Sleman, Yogyakarta, built with Next.js 14+, TypeScript, Tailwind CSS, Leaflet, and ApexCharts.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet.js via `react-leaflet`
- **Charts:** ApexCharts via `react-apexcharts`
- **Data Fetching:** TanStack Query (React Query)
- **Icons:** Lucide React

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard page
├── components/
│   ├── charts/           # Chart components (ApexCharts)
│   ├── dashboard/        # Dashboard specific views
│   ├── layout/           # Layout components (Sidebar, Navbar)
│   ├── map/              # Map components (Leaflet)
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks (React Query)
├── lib/                  # Utility functions and mock data
├── services/             # API service layer (mock API)
└── types/                # TypeScript type definitions
```

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Interactive Map:** Choropleth map displaying population density per hamlet (Dusun).
- **Statistical Charts:** Visualizations for demographics, economy, and public facilities.
- **Responsive Layout:** Mobile-friendly sidebar and navigation.
- **Mock API:** Simulated data fetching with loading states.

## Customization

- **Map Data:** Update `src/lib/mock-geojson.ts` with real GeoJSON data.
- **API:** Replace `src/services/api.ts` with real API calls.
