# 🐢 Tortoise - Device Leasing Platform

<div align="center">

![Tortoise Logo](https://img.shields.io/badge/🐢-Tortoise-8B5CF6?style=for-the-badge)

**The Modern Platform Connecting Suppliers and Buyers Through Seamless Device Leasing**

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation)

</div>

---

## 🌟 Overview

**Tortoise** is a cutting-edge, full-stack device leasing platform that revolutionizes how suppliers manage inventory and how buyers access quality devices. Built with modern web technologies and a beautiful, animated UI, Tortoise provides a seamless experience for device leasing operations.

### 🎯 Key Highlights

- 🚀 **Fast & Efficient** - Instant device listing and real-time inventory management
- 🔒 **Secure Platform** - Enterprise-grade encryption with JWT authentication
- 📊 **Analytics Dashboard** - Real-time stats and insights
- 🎨 **Beautiful UI** - Animated components with smooth transitions
- ☁️ **Cloud Database** - MongoDB Atlas for scalable data storage
- 📱 **Responsive Design** - Works perfectly on all devices

---

## ✨ Features

### For Suppliers 📦

- ✅ **Device Management** - Create, edit, and manage device listings
- ✅ **Inventory Tracking** - Real-time stock management with history
- ✅ **Offer Creation** - Set time-limited discounts and promotions
- ✅ **Dashboard Analytics** - View total devices, stock value, and low stock alerts
- ✅ **Profile Management** - Customize your supplier profile

### For Buyers 🛒

- ✅ **Device Browsing** - Explore available devices with search and filters
- ✅ **Lease Requests** - Easy lease submission process
- ✅ **Device Management** - Track your leased devices
- ✅ **User Dashboard** - Manage your account and leases

### Platform Features 🎨

- ✅ **Beautiful Landing Page** - Eye-catching hero section with features showcase
- ✅ **Animated UI** - Smooth transitions and micro-interactions
- ✅ **Floating Particles** - Dynamic animated background
- ✅ **Split-Screen Auth** - Professional login/register pages with features panel
- ✅ **Role-Based Access** - Separate dashboards for suppliers and buyers
- ✅ **Badge System** - Visual status indicators
- ✅ **Loading States** - Skeleton screens for better UX

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for building interactive interfaces |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Smooth animations and transitions |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Beautiful icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **Prisma ORM** | Type-safe database client |
| **MongoDB Atlas** | Cloud database platform |
| **JWT** | Secure authentication tokens |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin resource sharing |

---

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone https://github.com/Princedubey2004/supplier-managing-listing.git
cd supplier-managing-listing
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your_secret_key"
PORT=3000
```

### 5. Database Setup

```bash
cd server
npx prisma generate
npx prisma db push
```

### 6. Run the Application

**Development Mode (Recommended):**

From the root directory:
```bash
npm run dev
```

This runs both server and client concurrently.

**Or run separately:**

Server:
```bash
cd server
npm run dev
```

Client:
```bash
cd client
npm run dev
```

### 7. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## 🗂️ Project Structure

```
tortoise/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Base UI components (Button, Input, Card, etc.)
│   │   │   └── profile/     # Profile-related components
│   │   ├── pages/           # Page components
│   │   │   ├── supplier/    # Supplier-specific pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── context/         # React Context (Auth)
│   │   ├── services/        # API services
│   │   └── App.jsx          # Main app component
│   └── package.json
│
└── server/                   # Node.js backend
    ├── src/
    │   ├── controllers/     # Route controllers
    │   ├── middlewares/     # Auth & validation middleware
    │   ├── routes/          # API routes
    │   └── index.js         # Server entry point
    ├── prisma/
    │   └── schema.prisma    # Database schema
    └── package.json
```

---

## 🎨 UI Components

### Animated Components
- **Background** - Floating particles and gradient animations
- **Button** - Ripple effect on click with hover animations
- **Input** - Floating labels with smooth transitions
- **Card** - Hover effects with lift and shadow
- **Badge** - Status indicators with optional animations
- **PageTransition** - Smooth page entry/exit animations

---

## 🔐 Authentication

The platform uses JWT-based authentication with the following features:

- Password hashing with bcrypt
- Role-based access control (Supplier/Employee)
- Protected routes and API endpoints
- Profile management with avatar support
- Secure token storage

---

## 📊 Database Schema

### Collections
- **User** - User accounts with authentication
- **Supplier** - Supplier profiles
- **Device** - Device listings
- **Offer** - Time-limited discounts
- **StockHistory** - Stock change tracking
- **Lease** - Device lease records

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the client:
```bash
cd client
npm run build
```

2. Deploy the `dist` folder to your hosting platform

### Backend (Render/Railway/Heroku)

1. Ensure environment variables are set
2. Deploy the `server` directory
3. Run Prisma migrations after deployment

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Prince Dubey**

- GitHub: [@Princedubey2004](https://github.com/Princedubey2004)

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern SaaS platforms
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

**Made with ❤️ by Prince Dubey**

⭐ Star this repo if you find it helpful!

</div>
