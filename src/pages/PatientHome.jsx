// File: src/pages/PatientHome.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAppointments } from '../utils/storage';

const PatientHome = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (currentUser?.patientId) {
      const all = getAppointments();
      const filtered = all.filter(a => a.patientId === currentUser.patientId);
      setAppointments(filtered);
    }
  }, [currentUser]);

  const upcoming = appointments.filter(app => new Date(app.appointmentDate) > new Date());
  const past = appointments.filter(app => new Date(app.appointmentDate) <= new Date());

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {currentUser?.email}</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Upcoming Appointments</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map(app => (
                <div key={app.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-lg text-gray-800">{app.title}</h3>
                  <p className="text-sm text-gray-600">{new Date(app.appointmentDate).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Status: {app.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">Past Treatments</h2>
          {past.length === 0 ? (
            <p className="text-gray-500">No past treatments yet.</p>
          ) : (
            <div className="space-y-4">
              {past.map(app => (
                <div key={app.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-gray-800">{app.title}</h3>
                  <p className="text-sm text-gray-600">Date: {new Date(app.appointmentDate).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Treatment: {app.treatment || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Cost: ₹{app.cost || 0}</p>
                  <p className="text-sm text-gray-600">Status: {app.status}</p>
                  {app.files && app.files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-gray-700">Attachments:</p>
                      <ul className="list-disc list-inside text-sm text-blue-600">
                        {app.files.map((file, i) => (
                          <li key={i}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:text-blue-800"
                            >
                              {file.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHome;