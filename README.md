<div align="center">

# 🍔 FOOD_DASH.exe

<code>[██████████████████████████████████████████████████] 100%</code><br>
<code>&gt; BOOT_SEQUENCE_COMPLETE...</code><br>
<code>&gt; ESTABLISHING_SECURE_UPLINK... [OK]</code>

**SYS_STATUS:** ONLINE | **VIBE:** Y2K_CYBERPUNK | **ENCRYPTION:** AES-256

A futuristic, full-stack food delivery platform wrapped in a heavy cyberpunk terminal aesthetic. Featuring a neon Y2K UI, real-time WebSocket order tracking, secure JWT payment gateways, and telemetry dashboards.

🌐 **[ ESTABLISH UPLINK: LIVE DEMO ](https://food-delivery-platform-rho.vercel.app/)**

</div>

---

## /// SYS_FEATURES

### 👤 [ USR_MODULE ] : Customer Interface
* **Network Search:** Browse and dynamically search restaurant nodes and food assets.
* **Cart Allocation:** Add products to local memory (Cart) with persistent state.
* **Secure Handshake:** Encrypted checkout process powered by Stripe.
* **Packet Tracking:** Order tracking interface for real-time delivery status.

### 🏪 [ VENDOR_MODULE ] : Restaurant Command Center
* **Live Telemetry:** Real-time incoming order dashboard powered by WebSockets (`Socket.io`).
* **Sequential Logistics:** State-locked action buttons to progress orders (Accept -> Prepare -> Dispatch -> Deliver).
* **Asset Registry:** Full CRUD operations to manage the restaurant's specific menu items.
* **Yield Analytics:** Visual data dashboards (Recharts) tracking revenue, top-selling nodes, and order statuses.

### 🛡️ [ ROOT_MODULE ] : Admin Override
* **Node Management:** Manage all restaurant profiles and user registries across the network.
* **Global Inventory Control:** Toggle product availability protocols system-wide.
* **System Monitor:** Terminal-style UI for backend system logs and financial metrics.

---

## /// THE_ARSENAL (Tech Stack)

**[ FRONTEND_CLIENT ]**
* **Core:** React.js + Vite
* **Routing:** React Router DOM (v6) with Protected/Role-Based routing.
* **State/API:** Axios for HTTP client operations.
* **Visuals:** Custom Y2K CSS, Bootstrap grid system, Recharts (Data Viz).
* **Real-time:** Socket.io-client.

**[ BACKEND_MAINFRAME ]**
* **Core:** Node.js + Express.js
* **Database:** MongoDB + Mongoose (Atlas Cloud).
* **Security:** JWT (JSON Web Tokens) stored securely in `httpOnly` cookies, Bcrypt for cipher hashing.
* **Assets:** Cloudinary API for secure image hosting via Multer.
* **Payments:** Stripe API.

---

## /// NETWORK_ARCHITECTURE

```text
[ CLIENT_NODE ] (React + Vite)
      │
      │  << REST API / JSON + WebSockets >>
      ▼
[ AUTH_GATEWAY & ROUTER ] (Node.js + Express)
      │
      ├──> [ DATA_MAINFRAME ] (MongoDB Atlas)
      │
      ├──> [ ASSET_CDN ] (Cloudinary API)
      │
      └──> [ SECURE_LEDGER ] (Stripe Gateway)
