<div align="center">
  <img src="frontend/public/favicon.png" alt="LastBench Logo" width="120" height="120" />
  <h1>LastBench</h1>
  <p><strong>The smartest, most beautiful way to track your academic attendance.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-green.svg" alt="Node" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status" />
  </p>
</div>

---

## 🚀 Overview

**LastBench** tracks your attendance across all your subjects and tells you in real time how many classes you can still skip while staying above 75%. No more mental math before deciding whether to show up on a Monday morning.

Featuring a completely bespoke, responsive UI built with **Glassmorphism**, **GSAP micro-animations**, and the bleeding-edge **View Transition API** for a seamless dark/light mode wave-ripple toggle.

---

## ✨ Features

- **🎯 Smart Thresholds**: Set global default criteria (e.g., 75%) or customize it per subject. 
- **⚡ Bunk Predictor Engine**: Instantly calculates and displays your "Safe to Bunk" count. If you're falling behind, it tells you exactly how many consecutive classes you need to attend to recover.
- **📚 Semester Segregation**: Keep your academic history pristine. Subjects and attendance logs are strictly bound to Active Semesters. 
- **🌗 Wave-Ripple Dark Mode**: Features a stunning theme transition using native browser APIs to draw a ripple effect outward from your cursor.
- **📱 Fully Responsive**: A sliding hamburger drawer and collapsible grids mean the app looks perfectly crisp on desktops, tablets, and phones.
- **🔐 Secure JWT Auth**: Robust token-based authentication with `AuthContext` state management and automatic Axios interceptors.

---

## 🏗 Architecture

LastBench utilizes a highly decoupled, feature-based architecture for maximum scalability.

### Database Design (MongoDB Collections)
1. **Users**: Role-based access, storing personal profiles, college info, and global preferences.
2. **Semesters**: Academic timeframes linked to users. Only one can be "Active" at a time.
3. **Subjects**: Inherit target thresholds from their parent Semester.
4. **Attendance**: Time-stamped logs strictly mapping a User + Subject to a `present`/`absent` state.

### Frontend Structure (Domain-Driven)
The React application abandons generic folders for a `features/` pattern:
- `auth/`: Login, registration, Google OAuth hooks.
- `dashboard/`: Aggregated stats, danger zone banners, metric processing.
- `subjects/`: Individual subject cards, circular progress rings, and history modals.
- `settings/`: Read-only / Edit-mode toggles for deep profile configuration.
- `history/`: Full chronological timeline of all marked attendance logs.

---

## 💻 Tech Stack

- **Frontend**: React.js, React Router, Context API, GSAP (Animations), Lucide-React (Icons), React-Circular-Progressbar, Date-Fns.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Tokens), Bcrypt.js.
- **Design System**: Custom CSS with deeply integrated CSS Variables for theming. No utility frameworks used.

---

## 🛠 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/lastbench.git
cd lastbench
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lastbench
JWT_SECRET=your_super_secret_key_here
```
Run the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal and run:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📸 Screenshots

*(Add your beautiful dashboard mockup and mobile UI screenshots here)*

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/lastbench/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ for the ultimate college survival toolkit.</p>
</div>
