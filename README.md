# StoreIT - Inventory Management System

A modern, full-featured inventory management system built with Next.js, featuring real-time tracking, user management, and comprehensive reporting capabilities.

## 🚀 Features

### 📊 Dashboard & Analytics
- Real-time inventory visualization
- Interactive charts and statistics
- Product performance tracking
- Low stock alerts and warnings

### 👥 User Management System
- **Three Role Types:**
  - **Admin**: Full system access and user administration
  - **Company Owner**: Company and product management
  - **Staff**: Product viewing and basic operations
- Secure authentication with bcrypt password hashing
- Role-based access control

### 🏢 Company Management
- Multi-company support
- Company creation and management
- Owner assignment and tracking
- Company-specific product isolation

### 📦 Product Management
- Complete CRUD operations for products
- Category-based organization with visual icons
- Real-time quantity editing
- Automatic low stock warnings (< 10 items)
- Product statistics and analytics

### 📋 Transaction Tracking
- Automatic transaction recording for all quantity changes
- **Transaction Types:**
  - **Incoming**: Stock increases
  - **Outgoing**: Stock decreases
- User attribution for all transactions
- Comprehensive transaction history
- Real-time transaction statistics

### 🎨 Modern UI/UX
- Glass morphism design effects
- Responsive design for all devices
- Smooth animations and transitions
- Dark theme with gradient backgrounds
- Interactive elements with hover effects

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18
- **Styling**: CSS3 with modern features (backdrop-filter, gradients)
- **State Management**: Jotai
- **Database**: MySQL
- **Authentication**: Custom JWT implementation
- **Icons**: React Icons (Font Awesome)
- **Security**: bcryptjs for password hashing
