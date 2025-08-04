# Aryan Tour and Travels

A responsive frontend application built with Next.js and Tailwind CSS for managing travel bookings.

## Features

- **Authentication**: Email/Password and Google OAuth using NextAuth.js
- **User Dashboard**: Book journeys with prefilled user information
- **Profile Management**: View pending, completed, and cancelled journeys
- **Admin Dashboard**: Manage all pending bookings with pagination
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Pages

- `/login` - User authentication
- `/home` - Journey booking form
- `/profile` - User's journey history
- `/admin` - Admin dashboard (admin users only)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

### Regular User
- Email: `user@example.com`
- Password: `password123`

### Admin User
- Email: `admin@aryantravels.com`
- Password: `password123`

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form
- **Icons**: Heroicons
- **TypeScript**: Full type safety

## Project Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/     # NextAuth configuration
│   ├── journeys/               # Journey booking API
│   └── admin/journeys/         # Admin journey management API
├── components/
│   └── Navbar.tsx              # Navigation component
├── providers/
│   └── AuthProvider.tsx        # Session provider
├── admin/                      # Admin dashboard
├── home/                       # Journey booking form
├── login/                      # Authentication page
├── profile/                    # User profile and journey history
├── layout.tsx                  # Root layout
├── page.tsx                    # Home redirect
└── globals.css                 # Global styles
```

## Environment Variables

Create a `.env.local` file with:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

## Mock Data

The application uses mock data for demonstration purposes. In a production environment, replace the mock API endpoints with actual database operations.
