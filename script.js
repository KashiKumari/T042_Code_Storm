document.getElementById("reportForm").addEventListener("submit", function(event){
  event.preventDefault();

  let incident = document.getElementById("incident").value;
  let details = document.getElementById("details").value;
  let contact = document.getElementById("contact").value;

  // For now, just show confirmation (later you can send to server)
  document.getElementById("status").innerText = 
    "✅ Report submitted anonymously! Thank you for your courage.";

  // Reset form
  this.reset();
});