// File: src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAppointments, getPatients } from '../utils/storage';
import {
  Users,
  CalendarCheck,
  ClipboardList,
  DollarSign,
  LayoutDashboard
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (currentUser?.role === 'Admin') {
      setAppointments(getAppointments());
      setPatients(getPatients());
    }
  }, [currentUser]);

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-red-600">Access denied. Admins only.</p>
      </div>
    );
  }

  const completed = appointments.filter(a => a.status === 'Completed').length;
  const pending = appointments.filter(a => a.status !== 'Completed').length;
  const totalRevenue = appointments.reduce((sum, a) => sum + Number(a.cost || 0), 0);

  const upcoming = appointments
    .filter(a => new Date(a.appointmentDate) > new Date())
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);

  const topPatients = patients
    .map(p => ({
      ...p,
      count: appointments.filter(a => a.patientId === p.id).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-center">
      <div className={`flex justify-center mb-2 text-${color}-600`}>
        <Icon size={28} />
      </div>
      <h2 className="text-sm uppercase text-gray-500 font-semibold mb-1">{title}</h2>
      <p className={`text-3xl font-bold text-${color}-800`}>{value}</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center gap-4 mb-6">
          <LayoutDashboard size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">ENTNT Dental Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} title="Total Patients" value={patients.length} color="blue" />
          <StatCard icon={ClipboardList} title="Completed Treatments" value={completed} color="green" />
          <StatCard icon={CalendarCheck} title="Pending Treatments" value={pending} color="yellow" />
          <StatCard icon={DollarSign} title="Total Revenue" value={`₹${totalRevenue}`} color="purple" />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Next 10 Appointments</h2>
            <Link to="/appointments" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          <ul className="divide-y text-sm">
            {upcoming.length > 0 ? (
              upcoming.map(app => {
                const patient = patients.find(p => p.id === app.patientId);
                return (
                  <li key={app.id} className="py-2">
                    <strong>{patient?.name || 'Unknown'}:</strong> {app.title} on{' '}
                    {new Date(app.appointmentDate).toLocaleString()}
                  </li>
                );
              })
            ) : (
              <li className="text-gray-500 italic">No upcoming appointments.</li>
            )}
          </ul>
        </div>

        {/* Top Patients Leaderboard */}
        <div className="bg-white p-6 rounded-lg shadow border mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Patients (by Visits)</h2>
          <ul className="divide-y text-sm">
            {topPatients.length === 0 ? (
              <li className="text-gray-500 italic">No patients yet.</li>
            ) : (
              topPatients.map(p => (
                <li key={p.id} className="py-2 flex justify-between">
                  <span>{p.name}</span>
                  <span className="text-blue-600 font-medium">{p.count} visits</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/patients"
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                <Users size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Manage Patients</h3>
                <p className="text-sm opacity-90">Add, edit, or view patient records</p>
              </div>
            </div>
          </Link>

          <Link
            to="/calendar"
            className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                <CalendarCheck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Calendar View</h3>
                <p className="text-sm opacity-90">Visualize upcoming appointments</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
