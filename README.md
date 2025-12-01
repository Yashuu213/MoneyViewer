# 💰 MoneyTracker

A comprehensive personal finance management application built with React and Flask. Track your income, expenses, analyze spending patterns, and manage split expenses with friends—all in one beautiful, responsive interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Flask](https://img.shields.io/badge/Flask-3.1.0-000000.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38bdf8.svg)

## ✨ Features

### 📊 Dashboard
- **Real-time Balance Tracking**: View your total balance, income, and expenses at a glance
- **Quick Transaction Entry**: Add income or expenses with categories
- **Transaction History**: Complete list of all your financial activities with delete functionality

### 📈 Analysis
- **Category Breakdown**: Interactive pie chart showing spending by category
- **Monthly Trends**: Bar chart visualization of spending patterns over time
- **Deep Insights**: Understand where your money goes

### 🤝 Split Expenses Tracker
- **Bidirectional Tracking**: Record when you pay for others or when they pay for you
- **Automatic Net Balance**: Calculates who owes who automatically
- **Transaction History**: Expandable view of all transactions per person
- **Visual Indicators**: Color-coded balances (green = they owe you, red = you owe them)

### 💾 Data Persistence
- All data stored locally in browser's LocalStorage
- No server-side database required
- Privacy-focused: your data never leaves your device

### 📱 Responsive Design
- **Mobile-First**: Optimized for phones, tablets, and desktops
- **Adaptive Layouts**: Single column on mobile, multi-column on desktop
- **Touch-Friendly**: Large buttons and intuitive navigation

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd upi
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Build the frontend**
   ```bash
   npm run build
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Recharts 3.5.1** - Chart library for data visualization
- **Lucide React** - Beautiful icon library
- **Vite 7.2.4** - Fast build tool and dev server

### Backend
- **Flask 3.1.0** - Lightweight Python web framework
- **Werkzeug 3.1.3** - WSGI utility library

## 📁 Project Structure

```
upi/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with navigation
│   │   ├── TransactionForm.jsx  # Form to add transactions
│   │   └── TransactionList.jsx  # Transaction history display
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard page
│   │   ├── Analysis.jsx         # Analytics and charts
│   │   └── Lending.jsx          # Split expenses tracker
│   ├── context/
│   │   └── TransactionContext.jsx # Global state management
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── dist/                        # Production build (generated)
├── app.py                       # Flask server
├── requirements.txt             # Python dependencies
├── package.json                 # Node.js dependencies
├── tailwind.config.js           # Tailwind configuration
└── vite.config.js               # Vite configuration
```

## 🎯 Usage Guide

### Adding Transactions
1. Navigate to **Dashboard**
2. Select transaction type: **Expense** or **Income**
3. Enter amount, description, and category
4. Click **Add Transaction**

### Viewing Analytics
1. Navigate to **Analysis** tab
2. View spending breakdown by category (pie chart)
3. Check monthly spending trends (bar chart)

### Managing Split Expenses
1. Navigate to **Lending** tab
2. Choose transaction type:
   - **I Paid**: When you pay for both (they owe you)
   - **They Paid**: When they pay for both (you owe them)
3. Enter person's name and amount
4. Click **Add Transaction**
5. View net balances and click on a person to see transaction history

## 🔧 Development

### Run in Development Mode
```bash
npm run dev
```
This starts the Vite dev server at `http://localhost:5173` with hot module replacement.

### Build for Production
```bash
npm run build
```
Generates optimized production build in the `dist/` directory.

### Linting
```bash
npm run lint
```

## 🌟 Key Features Explained

### Split Expenses Algorithm
The app automatically calculates net balances:
- **Example**: You pay $50 for dinner → They owe you $50
- Later, they pay $30 for coffee → Net balance: They owe you $20
- All transactions are tracked individually but displayed as a net balance

### Data Storage
- Uses browser's `localStorage` API
- Data structure:
  ```javascript
  {
    transactions: [{ id, date, type, amount, description, category }],
    debts: [{ id, date, name, amount, type }]
  }
  ```

### Responsive Breakpoints
- **Mobile**: < 640px (single column)
- **Tablet**: 640px - 1024px (optimized spacing)
- **Desktop**: > 1024px (multi-column layouts)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI framework by [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ using React and Flask**
