// GOVENICS Consultation Modal & Lead Capture Handler
function openConsultationModal(offering) {
  const modal = document.getElementById("leadModal");
  if (modal) {
    if (offering) {
      const offInput = document.getElementById("leadOfferingInput");
      if (offInput) offInput.value = offering;
    }
    modal.style.display = "flex";
  } else {
    window.location.href = "https://govnics-murex.vercel.app/contact";
  }
}

function closeConsultationModal() {
  const modal = document.getElementById("leadModal");
  if (modal) modal.style.display = "none";
}
