// File: src/pages/Patients.jsx
import React, { useEffect, useState } from 'react';
import { getPatients, savePatients, generateId } from '../utils/storage';

// ✅ Custom validation logic
const validatePatientForm = (form, existingPatients, editingId = null) => {
  const errors = [];

  if (!form.name.trim()) errors.push("Name is required.");
  if (!form.dob) errors.push("Date of birth is required.");
  else if (new Date(form.dob) > new Date()) errors.push("DOB cannot be in the future.");

  if (!form.contact.trim()) {
    errors.push("Contact number is required.");
  } else if (!/^[0-9]{10}$/.test(form.contact)) {
    errors.push("Contact number must be exactly 10 digits.");
  }

  const duplicate = existingPatients.find(
    (p) =>
      p.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
      p.id !== editingId
  );

  if (duplicate) {
    errors.push("A patient with this name already exists.");
  }

  return errors;
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: '',
    dob: '',
    contact: '',
    healthInfo: '',
    photo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const data = getPatients();
    setPatients(data);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validatePatientForm(form, patients, editingId);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const updatedList = editingId
      ? patients.map(p => (p.id === editingId ? { ...form, id: editingId } : p))
      : [...patients, { ...form, id: generateId() }];

    setPatients(updatedList);
    savePatients(updatedList);
    setSuccessMsg(editingId ? 'Patient updated successfully!' : 'Patient added!');
    setTimeout(() => setSuccessMsg(''), 2500);

    setForm({ name: '', dob: '', contact: '', healthInfo: '', photo: '' });
    setEditingId(null);
  };

  const handleEdit = (patient) => {
    setForm(patient);
    setEditingId(patient.id);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this patient?");
    if (!confirmed) return;

    const filtered = patients.filter(p => p.id !== id);
    setPatients(filtered);
    savePatients(filtered);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>

      {successMsg && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-4 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="healthInfo"
            placeholder="Health Info"
            value={form.healthInfo}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <div className="col-span-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border p-2 rounded w-full"
            />
            {form.photo && (
              <img
                src={form.photo}
                alt="Profile Preview"
                className="mt-2 h-20 w-20 rounded-full object-cover border"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update" : "Add"} Patient
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Photo</th>
              <th className="p-2">Name</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Health Info</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No patients added yet.
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2">
                    {p.photo ? (
                      <img src={p.photo} alt="Patient" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="p-2 font-medium">{p.name}</td>
                  <td className="p-2">{p.dob}</td>
                  <td className="p-2">{p.contact}</td>
                  <td className="p-2 text-sm">{p.healthInfo}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
