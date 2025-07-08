# ENTNT Dental Center Management - Admin Dashboard

🚀 **Submission for ENTNT Frontend Developer (React) Assignment**  
🗓️ Deadline: 8 July  
🧑‍💻 Developer: Yash Kamal
website live link : https://lambent-platypus-497e2e.netlify.app/




## 📌 Overview

This is a fully functional **frontend-only Dental Center Management Dashboard** built for ENTNT's technical assignment. It includes role-based login, localStorage data simulation, and views for both **Admins (Dentists)** and **Patients** — all without any backend or external APIs.



## 🧠 Key Features

### 🔐 Authentication (Simulated)
- Hardcoded users stored in `localStorage`
- Role-based redirection
- Session saved in `localStorage`

### 🧑‍⚕️ Admin Features
- **Dashboard KPIs**: Patients, Revenue, Completed & Upcoming Appointments
- **Patient Management**: Add, Edit, Delete
- **Appointment (Incident) Management**: Including file upload & treatment info
- **Calendar View** of appointments

### 🙋‍♂️ Patient Features
- View own profile & appointment history
- See attached treatment files and costs

### 💾 Data Simulation
- All data stored in `localStorage`
- Files uploaded as base64 URLs



## 🔧 Tech Stack

- **React.js** (Functional Components)
- **React Router DOM** (v6+)
- **Context API** (for Auth Management)
- **TailwindCSS** (for styling)
- **lucide-react** (icons)



## 📂 Folder Structure
src/
├── components/ # Reusable UI components (ErrorBoundary, PrivateRoute)
├── contexts/ # Auth Context API
├── pages/ # Page components: Dashboard, Login, Patients, Calendar, etc.
├── utils/ # Storage logic (localStorage functions)
├── App.jsx # Main route config
└── main.jsx # ReactDOM render & data init
🧪 Test Credentials
Admin:
Email: admin@entnt.in
Password: admin123

Patient:
Email: john@entnt.in
Password: patient123

💬 Technical Decisions
Used localStorage to simulate backend workflows.

Avoided any external libraries like Firebase or axios.

Designed mobile-first responsive UI using Tailwind.

Followed role-based access control using PrivateRoute.

