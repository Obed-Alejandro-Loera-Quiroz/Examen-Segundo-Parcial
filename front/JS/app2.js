// ======= MODAL PERSONALIZADO =======
function showModal(message) {
  const modal = document.getElementById('customModal');
  const modalMessage = document.getElementById('modalMessage');
  modalMessage.textContent = message;
  modal.style.display = "flex";

  const closeBtn = document.getElementById('closeModal');
  const okBtn = document.getElementById('modalOk');

  closeBtn.onclick = () => { modal.style.display = "none"; };
  okBtn.onclick = () => { modal.style.display = "none"; };

  window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
}

// ======= LÓGICA DE CERTIFICACIONES =======
document.addEventListener('DOMContentLoaded', () => {
  const obtenerBtns = document.querySelectorAll('.btn-secondary');
  const pagarBtns = document.querySelectorAll('.btn-pay');

  // Inicializar botones de obtener
  obtenerBtns.forEach(btn => btn.dataset.paid = "false");

  // Leer pagos anteriores del localStorage
  const pagos = JSON.parse(localStorage.getItem('pagos')) || {};
  Object.keys(pagos).forEach(certId => {
    if (pagos[certId]) {
      const obtenerBtn = document.querySelector(`.btn-secondary[data-cert="${certId}"]`);
      const pagarBtn = document.querySelector(`.btn-pay[data-cert="${certId}"]`);
      if (obtenerBtn) {
        obtenerBtn.dataset.paid = "true";
        obtenerBtn.style.pointerEvents = "auto";
        obtenerBtn.style.opacity = "1";
      }
      if (pagarBtn) {
        pagarBtn.disabled = true;
        pagarBtn.textContent = "Pagado";
        pagarBtn.style.opacity = "0.7";
      }
    }
  });

  // Click en "Obtener Certificación"
  obtenerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.dataset.paid !== "true") {
        showModal("Primero debes pagar la certificación.");
      } else {
        showModal(`¡Has obtenido la certificación ${btn.dataset.cert.toUpperCase()}!`);
      }
    });
  });

  // Click en "Pagar Certificación"
  pagarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const certId = btn.dataset.cert;

      // Guardar pago en localStorage
      let pagos = JSON.parse(localStorage.getItem('pagos')) || {};
      pagos[certId] = true;
      localStorage.setItem('pagos', JSON.stringify(pagos));

      // Activar botón de obtener
      const obtenerBtn = document.querySelector(`.btn-secondary[data-cert="${certId}"]`);
      if (obtenerBtn) {
        obtenerBtn.dataset.paid = "true";
        obtenerBtn.style.pointerEvents = "auto";
        obtenerBtn.style.opacity = "1";
      }

      // Deshabilitar botón de pagar
      btn.disabled = true;
      btn.textContent = "Pagado";
      btn.style.opacity = "0.7";

      // Mostrar modal
      showModal(`Pago de la certificación ${certId.toUpperCase()} realizado con éxito.`);
    });
  });
});
