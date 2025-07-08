
import React, { useEffect, useState } from 'react';
import { getAppointments, saveAppointments, getPatients, generateId } from '../utils/storage';
import { exportAppointmentsToCSV } from '../utils/exportCSV';
import { CalendarDays, UploadCloud, FileEdit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Appointments = () => {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== 'Admin') {
    return <Navigate to="/login" />;
  }

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    title: '',
    description: '',
    appointmentDate: '',
    status: 'Scheduled',
    cost: '',
    treatment: '',
    comments: '',
    files: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setAppointments(getAppointments());
    setPatients(getPatients());
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const fileData = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, url: reader.result });
            reader.onerror = () => reject('File error');
            reader.readAsDataURL(file);
          })
      )
    );
    setForm((prev) => ({ ...prev, files: fileData }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      ...form,
      id: generateId(),
      appointmentDate: new Date(form.appointmentDate).toISOString()
    };
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    saveAppointments(updated);
    setForm({
      patientId: '',
      title: '',
      description: '',
      appointmentDate: '',
      status: 'Scheduled',
      cost: '',
      treatment: '',
      comments: '',
      files: []
    });
  };

  const filtered = appointments.filter((app) => {
    const patient = patients.find((p) => p.id === app.patientId);
    const matchPatient = patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === '' || app.status === statusFilter;
    return matchPatient && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-700">
        <CalendarDays className="w-6 h-6" /> Appointment Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
          <input
            type="datetime-local"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            name="treatment"
            placeholder="Treatment"
            value={form.treatment}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            name="cost"
            placeholder="Cost"
            value={form.cost}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            name="comments"
            placeholder="Comments"
            value={form.comments}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-gray-500" />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FileEdit size={16} /> Add Appointment
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full md:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={() => exportAppointmentsToCSV(filtered, patients)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Cost</th>
              <th className="p-3 text-left">Files</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => {
              const patient = patients.find((p) => p.id === app.patientId);
              return (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="p-3">{patient?.name}</td>
                  <td className="p-3">{new Date(app.appointmentDate).toLocaleString()}</td>
                  <td className="p-3">{app.title}</td>
                  <td className="p-3">{app.status}</td>
                  <td className="p-3">₹{app.cost}</td>
                  <td className="p-3 space-x-2">
                    {app.files?.map((file, i) => (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {file.name}
                      </a>
                    ))}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
