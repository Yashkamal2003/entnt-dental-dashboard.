import { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { getSession, initializeMockData } from "./utils/storage";

import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appoinment";
import Calendar from "./pages/Calender";
import PatientHome from "./pages/PatientHome";

const App = () => {
  useEffect(() => {
    initializeMockData(); // ✅ Called once on load
  }, []);

  const session = getSession(); // ✅ Get session after mock data init

  return (
    <Routes>
      <Route
        path="/"
        element={
          session ? (
            session.role === "Admin" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/patient" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute role="Admin">
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <PrivateRoute role="Admin">
            <Patients />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <PrivateRoute role="Admin">
            <Appointments />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute role="Admin">
            <Calendar />
          </PrivateRoute>
        }
      />
      <Route
        path="/patient"
        element={
          <PrivateRoute role="Patient">
            <PatientHome />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
