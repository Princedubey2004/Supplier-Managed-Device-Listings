# Tortoise - Supplier-Managed Device Leasing Marketplace

**Tortoise** is a robust, full-stack web application designed to modernize the corporate device leasing ecosystem. It serves as a dynamic marketplace that connects approved device suppliers directly with employees who need equipment, eliminating administrative bottlenecks and ensuring real-time inventory accuracy.

## Project Overview

At its core, Tortoise solves the challenge of stale inventory data by empowering **Suppliers** with a dedicated dashboard. Suppliers have full control over their catalog, allowing them to list new devices with detailed specifications (using a custom Key-Value interface), manage global stock levels, and set base prices. Crucially, the system supports dynamic pricing strategies: suppliers can create time-sensitive **Offers** (e.g., "15% off for Black Friday"), which are immediately calculated and displayed to potential lessees.

For **Employees**, Tortoise offers a streamlined, e-commerce-like experience. The Employee Dashboard features advanced filtering capabilities (by Brand, Price Range) and provides instant visibility into stock availability. The platform ensures transparency by displaying both the original listing price and the final leased price after applying any active supplier discounts. When an employee leases a device, the system handles the transaction atomically, updating stock quotas instantly to prevent over-subscription.

## Key Features

### For Suppliers
-   **Inventory Management**: Create, update, and manage device listings with ease.
-   **Dynamic Specs**: Custom Key-Value pair interface for flexible device specifications.
-   **Smart Pricing**: Launch time-limited discount offers that automatically apply to employee views.
-   **Stock Control**: Real-time stock tracking and history logging.

### For Employees
-   **Catalog Browsing**: Search and filter devices by brand and price range.
-   **Live Availability**: Instant visual indicators for "In Stock" vs "Out of Stock" items.
-   **Best Price Guarantee**: Automated calculation of the best available price including all active offers.
-   **One-Click Leasing**: Seamless leasing process with immediate feedback.

## Tech Stack

This project is built with a modern, scalable architecture:
-   **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) for high performance, styled with [Tailwind CSS](https://tailwindcss.com/).
-   **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) REST API.
-   **Database**: [PostgreSQL](https://www.postgresql.org/) managed via [Prisma ORM](https://www.prisma.io/).
-   **Security**: JWT Authentication and Role-Based Access Control (RBAC).

## Getting Started

### Prerequisites
-   Node.js (v14+)
-   PostgreSQL

### Installation

1.  **Clone the repository**
2.  **Setup Server**:
    ```bash
    cd server
    npm install
    npx prisma migrate dev --name init
    npm run dev
    ```
3.  **Setup Client**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
4.  **Run Both**:
    ```bash
    # From root directory
    npm run dev
    ```

---
*Developed for the Supplier-Managed Device Listings assignment.*
