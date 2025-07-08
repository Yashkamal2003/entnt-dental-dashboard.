export const exportAppointmentsToCSV = (appointments, patients) => {
  const rows = appointments.map(app => {
    const patient = patients.find(p => p.id === app.patientId);
    return {
      Patient: patient?.name || '',
      Date: new Date(app.appointmentDate).toLocaleString(),
      Title: app.title,
      Description: app.description,
      Treatment: app.treatment,
      Cost: app.cost,
      Status: app.status,
      Comments: app.comments,
      FileCount: app.files?.length || 0
    };
  });

  const header = Object.keys(rows[0] || {}).join(',');
  const body = rows.map(row => Object.values(row).join(',')).join('\n');
  const csvContent = `${header}\n${body}`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'appointments.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
