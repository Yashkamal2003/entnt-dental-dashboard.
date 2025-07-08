
// Session Management


export const getSession = () => {
  try {
    const session = localStorage.getItem('dental_session');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

export const setSession = (user) => {
  localStorage.setItem('dental_session', JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem('dental_session');
};


// Data Initialization with Sample Data


export const initializeMockData = () => {
  if (!localStorage.getItem('dental_users')) {
    const users = [
      { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
      { id: '2', role: 'Patient', email: 'john@entnt.in', password: 'patient123', patientId: 'p1' }
    ];

    const patients = [
      {
        id: 'p1',
        name: 'John Doe',
        dob: '1990-05-10',
        contact: '1234567890',
        healthInfo: 'No allergies',
        photo: ''
      }
    ];

   const appointments = [
  {
    id: 'i1',
    patientId: 'p1',
    title: 'Toothache',
    description: 'Upper molar pain',
    comments: 'Sensitive to cold',
    appointmentDate: '2025-07-12T10:00:00',
    cost: 80,
    treatment: 'Filling',
    status: 'Completed', 
    files: [
      {
        name: 'invoice.pdf',
        url: 'data:application/pdf;base64,dummyInvoiceBase64=='
      },
      {
        name: 'xray.png',
        url: 'data:image/png;base64,dummyXrayBase64=='
      }
    ]
  },
  {
    id: 'i2',
    patientId: 'p1',
    title: 'Routine Checkup',
    description: 'Regular cleaning',
    comments: '',
    appointmentDate: '2025-07-20T15:30:00', 
    cost: 50,
    treatment: 'Cleaning',
    status: 'Scheduled',
    files: []
  }
];


    localStorage.setItem('dental_users', JSON.stringify(users));
    localStorage.setItem('dental_patients', JSON.stringify(patients));
    localStorage.setItem('dental_appointments', JSON.stringify(appointments));
  }
};


// User Login Logic


export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('dental_users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    setSession(user);
    return { success: true, user };
  }
  return { success: false, message: 'Invalid credentials' };
};

// Patient CRUD


export const getPatients = () => {
  const data = localStorage.getItem('dental_patients');
  return data ? JSON.parse(data) : [];
};

export const savePatients = (patients) => {
  localStorage.setItem('dental_patients', JSON.stringify(patients));
};


// Appointment CRUD


export const getAppointments = () => {
  const data = localStorage.getItem('dental_appointments');
  return data ? JSON.parse(data) : [];
};

export const saveAppointments = (appointments) => {
  localStorage.setItem('dental_appointments', JSON.stringify(appointments));
};


// Utility

export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
