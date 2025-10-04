// Demo data with lat/lng coordinates
const reports = [
  {
    id: 'R001',
    type: 'Verbal Harassment',
    details: 'Inappropriate comments in meeting',
    contact: '',
    date: '2025-10-03',
    location: { lat: 31.3642, lng: 75.5428 } // Jalandhar example
  },
  {
    id: 'R002',
    type: 'Online Harassment',
    details: 'Offensive message on chat',
    contact: 'anon123@example.com',
    date: '2025-10-03',
    location: { lat: 28.7041, lng: 77.1025 } // Delhi example
  },
  {
    id: 'R003',
    type: 'Physical Harassment',
    details: 'Unwanted touching in office',
    contact: '',
    date: '2025-10-02',
    location: { lat: 19.076, lng: 72.8777 } // Mumbai example
  },
  {
    id: 'R004',
    type: 'Emotional Harassment',
    details: 'Psychologically pressures an employee, causing stress or fear.',
    contact: '',
    date: '2025-09-02',
    location: { lat: 13.0827, lng: 80.2707 } // Chennai example
  },
  {
    id: 'R005',
    type: 'Discrimination',
    details: 'Denying opportunities based on gender',
    contact: '',
    date: '2025-06-02',
    location: { lat: 22.5726, lng: 88.3639 } // Kolkata example
  }
];

// Helper: suspicion flag
function suspicionScore(report) {
  let score = 0;
  if (report.details.split(/\s+/).length < 6) score += 2;
  if (report.type === 'Physical Harassment' && !report.contact) score += 1;
  return score;
}

// Render reports
function renderReports(data) {
  const tbody = document.querySelector("#iccTable tbody");
  tbody.innerHTML = ''; // clear
  data.forEach(report => {
    const flagged = suspicionScore(report) >= 2;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${report.id}</td>
      <td>${report.type}</td>
      <td title="${report.details}">${report.details.length > 50 ? report.details.substring(0, 50) + '...' : report.details}</td>
      <td>${report.contact || '-'}</td>
      <td>${report.date}</td>
      <td>${flagged ? '<strong style="color:orange">Flagged</strong>' : 'OK'}</td>
    `;

    // Click row → show location on map
    row.addEventListener("click", () => {
      updateMap(report.location.lat, report.location.lng);
    });

    tbody.appendChild(row);
  });
}

// Initial render
renderReports(reports);

// --- Filter ---
document.getElementById("filterType").addEventListener("change", function () {
  const type = this.value;
  const filtered = type === "All" ? reports : reports.filter(r => r.type === type);
  renderReports(filtered);
});

// --- Search ---
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const filtered = reports.filter(r =>
    r.details.toLowerCase().includes(keyword) || (r.contact && r.contact.toLowerCase().includes(keyword))
  );
  renderReports(filtered);
});

// --- Export CSV ---
document.getElementById("exportBtn").addEventListener("click", function () {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Report ID,Type,Details,Contact,Date,Status\n";
  reports.forEach(r => {
    const flagged = suspicionScore(r) >= 2 ? "Flagged" : "OK";
    csvContent += `${r.id},${r.type},"${r.details}",${r.contact || '-'},${r.date},${flagged}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "icc_reports.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// --- Update Map ---
function updateMap(lat, lng) {
  const mapFrame = document.querySelector(".map-section iframe");
  mapFrame.src = `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${lat},${lng}&zoom=12&maptype=roadmap`;
}
