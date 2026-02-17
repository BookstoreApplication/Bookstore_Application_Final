# 📚 Microservices Bookstore App

> A distributed bookstore application built to demonstrate Microservices Architecture using Spring Boot, Spring Cloud, and React.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

## 📖 Overview

This project is a practical implementation of a microservices architecture. Unlike a monolithic app, the Bookstore is broken down into small, independent services that communicate via REST APIs. 

The application features a modern **React Frontend** with Role-Based Access Control (RBAC), distinguishing between **Customer** and **Admin** experiences.

## 🏗 Architecture

The system consists of **5 Core Microservices** and a **Frontend Client**:

| Service | Port | Description |
| :--- | :--- | :--- |
| **Service Registry** | `8761` | Eureka Server. Acts as the "phonebook" for service discovery. |
| **API Gateway** | `8080` | The single entry point. Routes requests from the frontend to backend services. |
| **Product Service** | `8081` | Manages book inventory, details, and prices (Admin CRUD). |
| **Order Service** | `8082` | Handles order placement and retrieves product info via `OpenFeign`. |
| **User Service**| `8083` | Handles authentication and authorization for users. |
| **Payment Service**| `8084` | Handles payments for orders. |
| **Frontend** | `3000` | React.js SPA (Single Page Application). |

---

## 💻 Frontend Features (React)

The frontend is built with React and communicates exclusively with the **API Gateway (Port 8080)**.

### 👤 User Role (Customer)
* **Browse Catalog:** View available books.
* **Cart & Checkout:** Add items to cart and place orders.
* **Order History:** View past purchases.

### 🛡️ Admin Role (Dashboard)
* **Admin Dashboard:** Visual statistics on sales and inventory.
* **Inventory Management:** Add, Update, or Delete books from the catalog.
* **Order Management:** View all user orders and statuses.

---

## 🛠️ Tech Stack

* **Backend:** Java 17, Spring Boot 3, Spring Cloud Gateway, Netflix Eureka, OpenFeign.
* **Frontend:** React.js, Tailwind CSS (or Bootstrap), Axios.
* **Database:** MySQL (Production/Docker), H2 (Local Testing).
* **DevOps:** Docker, Docker Compose.

---

## 🚀 Getting Started

### Prerequisites
* Java 17+ JDK
* Node.js & npm
* Docker Desktop (optional, for containerization)
* MySQL Workbench

### Run Locally (Manual)

1.  **Start the Infrastructure:**
    * Navigate to `/service-registry` -> `mvn spring-boot:run`
    * Navigate to `/api-gateway` -> `mvn spring-boot:run`
2.  **Start Business Services:**
    * Run `product-service`, `order-service`, and `notification-service`.
3.  **Start Frontend:**
    ```bash
    cd frontend
    npm install
    npm start
    ```
4.  **Access:**
    * Frontend: `http://localhost:3000`
    * Eureka Dashboard: `http://localhost:8761`

## 🔌 API Endpoints (Examples)

All requests route through the **API Gateway (Port 8080)**.

* `GET /api/products` - List all books
* `POST /api/products` - (Admin) Add a new book
* `POST /api/orders` - Place a new order
* `GET /api/orders/{userId}` - Get user history

---
