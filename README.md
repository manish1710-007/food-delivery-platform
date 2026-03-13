# 🍔 FOOD_DASH.exe
> **SYS_STATUS:** ONLINE | **VIBE:** Y2K_CYBERPUNK | **ENCRYPTION:** AES-256

A futuristic, full-stack food delivery platform wrapped in a heavy cyberpunk terminal aesthetic. Featuring a neon Y2K UI, a real-time admin dashboard, secure payment gateways, and system monitoring interfaces. 

🌐 **[ ESTABLISH UPLINK: LIVE DEMO ](https://food-delivery-platform-rho.vercel.app/)**

---

## /// SYS_FEATURES

### 👤 [ USR_MODULE ] : Customer Features
* **Network Search:** Browse and dynamically search restaurant nodes and food assets.
* **Cart Allocation:** Add products to local memory (Cart).
* **Secure Handshake:** Encrypted checkout process powered by Stripe.
* **Packet Tracking:** Order tracking interface for real-time delivery status.

### 🛡️ [ ROOT_MODULE ] : Admin Dashboard
* **Node Management:** Manage restaurant profiles and product registries.
* **Asset Upload:** Direct image uplinks via Cloudinary.
* **Inventory Control:** Toggle product availability protocols.
* **Data Parsing:** Search & filter assets seamlessly.
* **System Monitor:** Terminal-style UI for backend system logs and metrics.

### 🎨 [ UI_UX_CORE ] : Experience
* Cyberpunk terminal-style dashboard with CRT scanline overlays.
* High-contrast neon Y2K aesthetic (Cyan/Magenta).
* System monitoring interface & dynamic product registry panels.

---

## /// NETWORK_ARCHITECTURE

```text
[ CLIENT_NODE ] (React + Vite)
      │
      │   << REST API / JSON >>
      ▼
[ AUTH_GATEWAY & ROUTER ] (Node.js + Express)
      │
      ├──> [ DATA_MAINFRAME ] (MongoDB Atlas)
      │
      ├──> [ ASSET_CDN ] (Cloudinary)
      │
      └──> [ SECURE_LEDGER ] (Stripe Gateway)


