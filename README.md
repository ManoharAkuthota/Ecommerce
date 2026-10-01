# 📱 MS Mobiles — Full-Stack E-Commerce & Native Mobile Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.0-blue?logo=capacitor)](https://capacitorjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![MySQL / TiDB](https://img.shields.io/badge/Database-TiDB%20Cloud%20MySQL-00758f?logo=mysql)](https://tidbcloud.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary%20CDN-3448c5?logo=cloudinary)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, omnichannel e-commerce ecosystem specialized for premium smartphones, accessories, and tech electronics. Engineered with a high-performance **Spring Boot 3 REST API**, modern **React 18 + Vite** storefront, official **GST Tax Invoice engine**, real-time **Stock Alert Dispatcher**, and a native **Android Application** powered by **Capacitor 8** and **PWA**.

---

## 🔗 Live Deployments & Repository Links

- **🌐 Live Web Application**: [https://ms-mobiles-frontend.onrender.com](https://ms-mobiles-frontend.onrender.com)
- **⚡ Backend REST API**: [https://ms-mobiles-backend.onrender.com/api](https://ms-mobiles-backend.onrender.com/api)
- **📂 GitHub Repository**: [https://github.com/ManoharAkuthota/Ecommerce](https://github.com/ManoharAkuthota/Ecommerce)

---

## 🚀 Key Features & Architectural Highlights

### 1. 🛡️ Enterprise Security & Authentication
- **Stateless JWT Security**: Built on Spring Security 6 with token expiration handling, BCrypt password encryption, and automated filter chains.
- **Role-Based Access Control (RBAC)**: Fine-grained authorization differentiating standard **Shoppers** (`ROLE_USER`) from **Store Administrators** (`ROLE_ADMIN`).
- **Flexible Network CORS**: Intelligent multi-subnet CORS configuration supporting local LAN IP addresses (`192.168.x.x`), Docker containers, mobile devices, and cloud domains.

### 2. 📄 Official PDF GST Tax Invoice Generator
- **Statutory Tax Compliance**: Compliant with Indian GST standards (HSN code `8517 12 00` for smartphones, GSTIN registration, intra-state CGST 9% + SGST 9%, and inter-state IGST 18%).
- **Desktop A4 Virtual Canvas**: Custom `html2canvas` + `jsPDF` pipeline with an off-screen desktop clone, generating 300 DPI print-perfect documents regardless of device viewport.
- **Indian Currency Text Engine**: Custom algorithmic conversion translating numerical totals into official Indian currency text (*e.g., "Rupees One Lakh Twenty-Four Thousand Nine Hundred and Ninety-Nine Only"*).
- **Digital Verification Stamp**: Embedded cryptographic digital signature simulation and authorized seal.

### 3. 🔔 Real-Time Stock Alerts & "Notify Me" Engine
- **Back-in-Stock Subscriptions**: Out-of-stock items dynamically swap the buy CTA with a 1-click notification trigger.
- **Automated Inventory Hooks**: When administrators restock devices in the catalog, backend lifecycle hooks automatically trigger notification dispatch to registered shoppers.
- **Demand Analytics**: Administrative dashboards quantifying unfulfilled shopper demand per smartphone model.

### 4. 📱 Native Mobile App (Capacitor 8) & Progressive Web App (PWA)
- **Android Studio Ready**: Complete native Android project located in `mobile-store-frontend/android/` with custom splash screen, adaptive launcher icons, and status bar integration.
- **Cleartext LAN Routing**: Configured `usesCleartextTraffic` and IP detection allowing real-time native testing over Wi-Fi without SSL friction.
- **Zero-Install PWA**: Installable directly from any mobile browser with offline asset caching and standalone app launch.

### 5. 🛒 Smart Catalog & Cart Management
- **Multi-Variant Specifications**: Dynamic storage (128GB, 256GB, 512GB, 1TB) and colorway configuration with live price adjustments.
- **Cart & Wishlist Engine**: Persistent state management with instant quantity calculation, delivery estimations, and stock reservations.
- **Cloudinary CDN Media**: High-speed cloud image delivery with automatic compression, WebP formatting, and responsive thumbnail sizing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.3, Spring Security 6, Spring Data JPA, Hibernate ORM, Maven |
| **Frontend** | React 18.3, Vite 5.4, Tailwind CSS 3.4, Framer Motion, Lucide Icons, Axios |
| **Mobile** | Capacitor 8 (Android Platform, Splash Screen, Status Bar), PWA Manifest |
| **Database** | MySQL / TiDB Cloud AWS Distributed SQL, H2 (test fallback) |
| **Cloud & Storage** | Cloudinary Image API, Docker, Render Cloud Platform |
| **Document Engine** | jsPDF, html2canvas, Native Print Styling |

---

## 🏗️ Project Architecture

```
Ecommerce/
├── mobile-store-backend/              # Spring Boot 3 Enterprise API
│   ├── src/main/java/com/mobilestore/
│   │   ├── auth/                      # JWT auth, user credentials & security filter
│   │   ├── mobile/                    # Phone catalog, variants & brand services
│   │   ├── order/                     # Checkout, tax calculation & tracking
│   │   ├── stockalert/                # Inventory notification engine
│   │   └── config/                    # CORS, TiDB, Security & Cloudinary config
│   ├── Dockerfile                     # Containerized deployment
│   └── pom.xml
│
├── mobile-store-frontend/             # React 18 + Vite Storefront
│   ├── android/                       # Native Capacitor Android Studio project
│   ├── src/
│   │   ├── components/                # Modular UI (Navbar, Cards, Modals, Invoices)
│   │   ├── pages/                     # Storefront, Admin Portal, Cart, Checkout
│   │   ├── services/                  # Dynamic IP Axios client & REST endpoints
│   │   └── context/                   # Global Auth & Cart state providers
│   ├── capacitor.config.json          # Native Android container configuration
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── render.yaml                        # Infrastructure-as-Code deployment blueprint
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **JDK 21** or higher
- **Node.js 18+** & **npm**
- **MySQL** or **TiDB Cloud** instance

### 2. Backend Setup
```bash
cd mobile-store-backend
# Build the project
./mvnw clean package -DskipTests

# Run the Spring Boot application
java -jar target/mobile-store-backend-0.0.1-SNAPSHOT.jar
# Backend will start on http://localhost:8080
```

### 3. Frontend Setup
```bash
cd mobile-store-frontend
# Install dependencies
npm install

# Start Vite dev server with LAN network support
npm run dev -- --host
# Access via http://localhost:5173 or http://<your-lan-ip>:5173
```

### 4. Build Android Mobile App
```bash
cd mobile-store-frontend
# Build web assets and sync into native Android project
npm run cap:sync

# Open directly in Android Studio
npm run cap:android
# Or build debug APK directly via Gradle:
cd android && gradlew assembleDebug
```

---

## 👤 Author

**Manohar Akuthota**
- GitHub: [@ManoharAkuthota](https://github.com/ManoharAkuthota)
- Project Repository: [https://github.com/ManoharAkuthota/Ecommerce](https://github.com/ManoharAkuthota/Ecommerce)
