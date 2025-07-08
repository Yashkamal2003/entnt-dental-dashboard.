import React, { useEffect, useState } from 'react';
import { getAppointments, getPatients } from '../utils/storage';

const groupAppointmentsByDate = (appointments) => {
  const map = {};
  appointments.forEach(app => {
    const dateKey = new Date(app.appointmentDate).toLocaleDateString();
    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push(app);
  });

  return Object.entries(map).sort(
    ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
  );
};

const Calendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setAppointments(getAppointments());
    setPatients(getPatients());
  }, []);

  const grouped = groupAppointmentsByDate(appointments);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Appointment Calendar</h2>

      {grouped.length === 0 ? (
        <p className="text-gray-500">No appointments scheduled yet.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, appts]) => (
            <div key={date}>
              <h3
                onClick={() => setSelectedDate(prev => (prev === date ? null : date))}
                className={`text-lg font-semibold mb-2 cursor-pointer ${selectedDate === date ? 'text-green-700' : 'text-blue-700'} hover:underline`}
              >
                {date}
              </h3>
              {selectedDate === date && (
                <>
                  <p className="text-sm text-gray-500 mt-1 italic">Click again to collapse</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {appts.map(app => {
                      const pat = patients.find(p => p.id === app.patientId);
                      return (
                        <div key={app.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                          <h4 className="font-semibold text-gray-700">{app.title}</h4>
                          <p className="text-sm text-gray-500 mb-1">{new Date(app.appointmentDate).toLocaleTimeString()}</p>
                          <p className="text-sm">Patient: <strong>{pat?.name}</strong></p>
                          <p className="text-sm">Status: <span className={app.status === 'Completed' ? 'text-green-600' : 'text-yellow-500'}>{app.status}</span></p>
                          <p className="text-sm">Treatment: {app.treatment || 'N/A'}</p>
                          <p className="text-sm">Cost: ₹{app.cost || 0}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
