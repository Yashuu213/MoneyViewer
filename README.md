<div align="center">
  
  <img src="public/logo.png" alt="Hisaab.AI Logo" width="150" height="150">

  <h1>🚀 Hisaab.AI: The Next-Gen Financial AI Brain</h1>
  <p><strong>Voice-Activated • Premium Glassmorphic UI • Intelligent Expense Splitting • OTP Secured • Cloud Synced</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge&logo=rocket" alt="Status" />
    <img src="https://img.shields.io/badge/Platform-Web_%7C_Android-blue?style=for-the-badge&logo=android" alt="Platform" />
    <img src="https://img.shields.io/badge/AI_Engine-Bro--Bot_v2-purple?style=for-the-badge&logo=openai" alt="AI Agent" />
    <img src="https://img.shields.io/badge/Security-Email_OTP_Verified-red?style=for-the-badge&logo=shield" alt="Security" />
    <img src="https://img.shields.io/badge/Database-Vercel_Postgres-black?style=for-the-badge&logo=postgresql" alt="DB" />
  </p>

  <p>
    <a href="https://github.com/Yashuu213/Hisaab.AI/releases/latest"><strong>📲 DOWNLOAD THE LATEST APK RELEASE HERE</strong></a>
  </p>

  <br>

  <details open>
    <summary><strong>💡 Cheat Sheet: How to talk to Bro-Bot? (Expand)</strong></summary>
    <p>To get the fastest and most accurate NLP parsing, try utilizing syntax patterns like these in the Bro-Bot text/voice input:</p>
    <table align="center" width="80%">
      <tr>
        <th align="left">Intent</th>
        <th align="left">What to say / type</th>
        <th align="left">Result</th>
      </tr>
      <tr>
        <td>General Expense</td>
        <td><code>"500 pizza khaya"</code></td>
        <td>Auto-logs ₹500 in Food category.</td>
      </tr>
      <tr>
        <td>Multiple Entries</td>
        <td><code>"1000 rent aur 200 light bill"</code></td>
        <td>Auto-splits into two separate exact records.</td>
      </tr>
      <tr>
        <td>Lending Money</td>
        <td><code>"2000 rahul ko diye"</code></td>
        <td>Logs an outbound Debt owed by Rahul.</td>
      </tr>
      <tr>
        <td>Income Record</td>
        <td><code>"5000 salary aayi"</code></td>
        <td>Logs an Inbound Liquidity increase.</td>
      </tr>
    </table>
  </details>

</div>

---

## 🌌 Introduction: What is Hisaab.AI?

**Hisaab.AI** is not just another mundane expense tracker. It is a highly sophisticated, algorithmic personal finance assistant engineered for the modern Indian demographic. Wrapped in an ultra-premium, dark-mode focused glassmorphic user interface, it bridges the gap between raw financial data and human-like conversational logging.

Built with performance and elegance in mind, Hisaab.AI allows you to log transactions, split bills, and track your overall net worth entirely **hands-free using Hinglish Voice Commands**. Just speak to **"Bro-Bot"**, our proprietary NLP engine, and watch the system magically parse your intent, categorize your spending, and settle your debts.

---

## 📑 Table of Contents
1. [Core Features](#-core-features--innovation)
2. [Security & Authentication](#-enterprise-grade-security--otp-flow)
3. [System Architecture](#-advanced-system-architecture)
4. [The Tech Stack](#-the-tech-stack)
5. [Local Development Setup](#-run-it-locally-for-devs)
6. [Deployment & Cloud](#-cloud-deployment-vercel)
7. [Future Roadmap](#-future-roadmap)

---

## 🔥 Core Features & Innovation

### 🎙️ 1. "Bro-Bot" AI & Smart Hands-Free Engine
*   **Hinglish NLP Support**: Speak naturally! Command the bot casually by saying, *"Rahul ko 500 rent aur 200 petrol ke diye"* or *"Aaj salary aai 50000"*.
*   **Multi-Entity Dynamic Parsing**: Bro-Bot can slice and dice complex sentences. If you say, *"100 Pizza ka kharcha and 200 Rupees Burger"*, it automatically filters the noise, extracts the numerical values and items, and creates two distinct, categorized ledger entries in under 100ms.
*   **Smart Silence Detection**: You don't even need to press "Stop" or "Enter". Speak your mind, pause for 1.8 seconds, and the app automatically stops listening, pushing the payload to the backend for processing with visual pulsing feedback.

### 🎨 2. Ultra-Premium Glassmorphic Design UI/UX
*   **Sleek Dark Mode**: Designed specifically for OLED screens utilizing rich indigo, violet, and pitch-black hexadecimal aesthetics (`#0b0f19`).
*   **Kinetic Micro-Interactions**: Powered by Framer-Motion. Experience glowing borders, fluid page transitions, hover-states, and reactive UI cards that make the dashboard feel alive.
*   **Precision Dashboard View**: Your "Net Liquidity" (Bank Balance), "Total In" (All Deposits), and "Total Out" (Expenses & Lent amounts) are constantly calculated via reactive states and displayed in a high-contrast card layout.

### 🤝 3. Dual-Sync Lending & Split Engine
*   **Ledger + Dashboard Synchronization**: When you lend money to a friend, not only is their personal tab updated in the Debt Ledger, but your main Cash Outflow on the dashboard is automatically adjusted in real-time.
*   **Automated Net Balances**: Automatically calculates who owes whom. If you paid ₹500 today and they paid ₹200 tomorrow, the algorithm reduces the nodes and shows a pure net balance of exactly who owes ₹300.
*   **One-Click Debt Clearing**: Generate dynamic UPI payment links or settle accounts visually with a single click.

---

## 🛡️ Enterprise-Grade Security & OTP Flow

Unlike standard portfolio applications, Hisaab.AI implements a robust, production-level authentication architecture designed to eliminate fake accounts and secure sensitive financial data.

1. **Email-Based Registration**: Users cannot register with arbitrary usernames. A valid email is strictly required. 
2. **SMTP OTP Verification**: Upon registration, a secure 6-digit OTP is transmitted directly to the user's inbox using Google's SMTP servers. The account is only provisioned upon successful cryptographic validation of the OTP.
3. **Ghost-DB State Management**: Unverified accounts and expired OTPs are kept in a separate `OTPRecord` ghost table to ensure the primary `User` table remains perfectly clean.
4. **Password Reset Flow**: Complete self-service password recovery flow secured by identical 10-minute expiring email OTPs. Passwords are never logged and are intensely hashed using `Werkzeug`'s `scrypt` implementations.

---

## 🏗️ Advanced System Architecture

Hisaab.AI utilizes a deeply decoupled Client-Server architecture allowing flawless cross-platform performance (Web + Android Native).

*   **The Client Layer (React + Vite)**: Implements Context API (`TransactionContext`) as the single source of truth for all financial state management. Hooks intercept state mutations, ensuring optimistic UI updates while asynchronous calls resolve.
*   **The API Layer (Flask + RESTful)**: stateless authentication via session cookies and secure JSON payloads. The router elegantly handles Cross-Origin permissions and request sanitization.
*   **The Database Layer (Vercel Serverless Postgres)**: Fully migrated from local SQLite. It utilizes SQLAlchemy ORM with rigorous `nullable=False` constraints, `ForeignKey` cascades, and relational data modeling to ensure transaction integrity.

---

## 🛠️ The Tech Stack

This project leverages a sophisticated, high-performance web and mobile stack:

**Frontend Frameworks & Libraries**
*   **Core**: React 19, Vite (For ultra-fast HMR and minified builds).
*   **Styling**: Tailwind CSS 3.4 (Custom JIT Configs), Vanilla CSS for Glassmorphism.
*   **Animation**: Framer Motion, Lucide React (Iconography).

**Backend & Infrastructure**
*   **Server**: Flask 3.1.0, Werkzeug 3.1.3.
*   **Authentication**: Flask-Login, Python `smtplib` (Email Dispatch).
*   **Database**: PostgreSQL via `psycopg2-binary`, SQLAlchemy 3.1.1 (ORM).
*   **Cloud Hosting**: Vercel Serverless Functions.

**Mobile Portability**
*   **Wrapper**: Capacitor JS, bridging native Android WebViews allowing full Android APK builds from the Vite web payload.

---

## 🚀 Run It Locally (For Devs)

Want to inspect the magic under the hood and run it locally?

### Prerequisites
*   Node.js (v18+)
*   Python 3.10+

### 1. Clone & Core Setup
```bash
git clone https://github.com/Yashuu213/Hisaab.AI
cd upi
```

### 2. Environment Variables (.env)
You must create a `.env` file in the root directory (where `run_local.py` is located) for the email and database systems to function:
```env
# Required for OTP Services (Use a Gmail App Password, no spaces)
EMAIL_ID=your.app.email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop

# Optional: If testing on local SQLite, leave POSTGRES_URL blank
POSTGRES_URL=
```

### 3. Backend (Flask) Setup
```bash
# Open your terminal and run:
pip install -r requirements.txt
python run_local.py
```
*The backend will boot up perfectly on `localhost:5001` and create the local `upi.db` automatically.*

### 4. Frontend (React) Setup
```bash
# Open a second, separate terminal and run:
npm install
npm run dev
```

Your app will instantly be live at `http://localhost:5173`. Boom. 💥

---

## ☁️ Cloud Deployment (Vercel)

Deploying Hisaab.AI to production is heavily automated.

1. Push your code to the `master` branch on GitHub.
2. Link the repository to vercel.
3. Under the **Vercel Project Settings > Environment Variables**, you **MUST** map your exact `$EMAIL_ID` and `$EMAIL_PASSWORD`.
4. Spin up a **Vercel Postgres (Neon)** instance within the Vercel Storage tab. Connect it to the project.
5. In the Vercel Postgres query editor, if hitting an existing database issue, run `DROP SCHEMA public CASCADE;` to clear cache, then visit the live site. The backend `/api/send-otp` route has an automated `db.create_all()` hook to generate the complete schema.

---

## 🔮 Future Roadmap
- [ ] **OCR Engine Integration**: Scan physical restaurant bills and extract individual items automatically.
- [ ] **Multi-Currency Support**: For travelers handling USD, EUR, and INR concurrently.
- [ ] **Export to PDF / Excel**: Auto-generate beautiful expense reports for tax season.
- [ ] **iOS Build Packaging**: Native iOS delivery utilizing Capacitor ecosystem out of the box.

---

<div align="center">
  <p>Architected with ❤️, ☕, and next-gen code by <strong>Yash</strong>.</p>
</div>
