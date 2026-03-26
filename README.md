# 🍞 Bakery POS System
A Modern, Modular Point‑of‑Sale Built for a Full Bakery Business Suite <br>

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Stripe](https://img.shields.io/badge/Stripe-Integrated-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey) <br>
<br>

## 📌 Repository Description
This project is a fully functional Point‑of‑Sale (POS) system built with Next.js, React, TypeScript, and Stripe. It is designed as the first module in a larger, fully integrated Bakery Business Suite that will eventually include:

* Inventory management

* Customer accounts & loyalty

* Online ordering

* In‑store kiosk ordering

* Employee management

* Manager dashboards

* Kitchen display systems

* Multi‑terminal cloud sync

The POS is intentionally modular, scalable, and built using clean architecture principles so each future module can plug in seamlessly.  <br>
<br>

## 🧭 SDLC Phase
This project is currently in:  <br>

### SDLC Phase 3 — Design & Implementation (Iterative MVP Build)
Completed SDLC Work

#### 🟢 Planning:
Defined scope, goals, constraints, and bakery‑specific requirements  <br>
 <br>
#### 🟢 Analysis: 
Identified functional requirements (POS flow, payments, receipts, order history)  <br>
 <br>
#### 🟢 Design:
Created ERD, workflows, UI mockups, and modular architecture  <br>
 <br>
#### 🟡 Implementation (Current): 
Building the POS MVP with real payment flows and persistent order history <br>
 <br>
### Upcoming SDLC Phases
#### ⚪ Testing:
Unit tests, integration tests, UI tests, payment flow tests <br>
 <br>
#### ⚪ Deployment: 
Deploy to Vercel + Stripe live mode <br>
 <br>
#### ⚪ Maintenance: 
Add new modules, fix bugs, optimize performance <br>
 <br>

## ✨ Feature Checklist (Current MVP)  <br>
 
#### 🛒 Product & Cart 
✅ Product grid

✅ Add to cart

✅ Update quantity

✅ Remove item

✅ Real‑time totals (subtotal, tax, total) <br>
<br>
#### 💳 Payments
✅ Cash payments

✅ Cash tendered + change calculation

✅ Credit card payments

✅ Debit card payments

✅ Manual card entry (Stripe Elements)

✅ Simulated card reader (tap/insert/swipe)

✅ Stripe PaymentIntent integration <br>
<br>
#### 🧾 Receipts
✅ Printable receipt

✅ Payment method shown

✅ Entry method (manual vs terminal)

✅ Cash tendered & change

✅ Stripe payment ID

✅ Timestamp + order ID <br>
<br>
#### 📜 Order History
✅ Persistent storage (localStorage)

✅ View past orders

✅ Reopen receipts

✅ Clear history y <br>
<br>
#### 🧠 Architecture
✅ Centralized OrderHistoryContext

✅ Strong TypeScript models

✅ Modular components

✅ Stripe‑ready payment logic  <br>
<br>
<br>

## 🚀 Roadmap (Upcoming Features)
#### 🔹 Phase 2 — Inventory System
* Ingredient tracking

* Auto‑deduct inventory

* Low‑stock alerts

* Supplier management 
<br>

#### 🔹 Phase 3 — Customer Accounts & Loyalty
* Customer login

* Guest checkout

* Loyalty points

* Points redemption

* Saved payment methods

* Customer order history <br>
  <br>

#### 🔹 Phase 4 — Online Ordering (User‑Facing Website)
* Menu browsing

* Cart + checkout

* Pickup/delivery scheduling

* Online payments

* Order tracking

* Sync to POS + inventory <br>
  <br>

#### 🔹 Phase 5 — In‑Store Kiosk Ordering
* Touch‑friendly kiosk UI

* Guest or logged‑in ordering

* Loyalty integration

* Stripe Terminal payments

* Sync to POS + KDS <br>
  <br>

#### 🔹 Phase 6 — Employee System
* Employee login

* Role‑based permissions

* Clock‑in / clock‑out

* Shift reports <br>
<br>

#### 🔹 Phase 7 — Manager Dashboard
* Sales analytics

* Product performance

* Real‑time metrics

* Exportable reports <br>
  <br>

#### 🔹 Phase 8 — Cloud Backend
* Move to Postgres/Supabase

* Multi‑terminal sync

* Real‑time updates

* Centralized database <br>
<br>

#### 🔹 Phase 9 — Stripe Terminal Hardware
* Real card reader support

* Tap / chip / swipe

* PCI‑compliant flow <br>
<br>
  

## 🏢 Full Business Suite Vision
A high‑level overview of the final integrated system. <br>

#### 🧾 POS (Current Module)
Cashier‑facing POS with payments, receipts, and order history. <br>
<br>
#### 🛒 Online Ordering (Future)
Customer‑facing website for pickup/delivery with loyalty integration. <br>
<br>
#### 🏬 In‑Store Kiosk (Future)
Touch‑optimized self‑service ordering at the physical bakery.<br>
<br>
#### 📦 Inventory Management (Future)
Ingredient tracking, auto‑deduction, and supplier management.<br>
<br>
#### 👥 Employee Management (Future)
Login, permissions, and time tracking.<br>
<br>
#### 📊 Manager Dashboard (Future)
Sales analytics, product performance, and real‑time metrics.<br>
<br>
#### 🧑‍🍳 Kitchen Display System (Future)
Real‑time order queue and prep workflow.<br>
<br>
#### 🌐 Cloud Sync (Future)
Multi‑terminal support and centralized database. <br>
<br>

## 📸 Screenshots (Coming Soon)
- Product grid

- Cart

- Checkout modal

- Reader simulation

- Receipt

- Order history<br>
<br>


## 🧑‍💻 Developer Notes
This project is built with:

✅ Clean, modular components

✅ Strong TypeScript types

✅ Realistic cashier UX

✅ Stripe‑ready payment flows

✅ Expandable architecture

It is designed to be both portfolio‑ready and production‑ready.