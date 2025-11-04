document.addEventListener('DOMContentLoaded', () => {
  const obtenerBtns = document.querySelectorAll('.btn-secondary');
  const pagarBtns = document.querySelectorAll('.btn-pay');

  const user = localStorage.getItem("userName");
  if (!user) return; // Si no hay usuario logueado, no hacemos nada

  // Recuperar pagos de localStorage
  let pagos = JSON.parse(localStorage.getItem("pagos")) || {};

  // Inicializar pagos para el usuario si no existe
  if (!pagos[user]) pagos[user] = {};

  // Configurar botones según el estado de pago del usuario
  obtenerBtns.forEach(btn => {
    const certId = btn.dataset.cert;

    if (pagos[user][certId]) {
      btn.dataset.paid = "true";
      btn.style.pointerEvents = "auto";
      btn.style.opacity = "1";
    } else {
      btn.dataset.paid = "false";
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.7";
    }

    // Click en "Obtener Certificación"
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.dataset.paid !== "true") {
        Swal.fire({
          icon: 'warning',
          title: 'Pago pendiente',
          text: 'Primero debes pagar la certificación.',
          confirmButtonColor: '#003366',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Buena Suerte!',
          text: `Puedes realizar la certificacion ${certId.toUpperCase()}.`,
          confirmButtonColor: '#003366',
        }).then(() => {
          // 🔹 Redirigir al examen con el nombre de la certificación
          window.location.href = `examen.html?cert=${certId}`;
        });
      }
    });
  }); // ← este cierre te faltaba 😄

  // Click en "Pagar Certificación"
  pagarBtns.forEach(btn => {
    const certId = btn.dataset.cert;

    // Si ya fue pagado, deshabilitar botón
    if (pagos[user][certId]) {
      btn.disabled = true;
      btn.textContent = "Pagado";
      btn.style.opacity = "0.7";
    }

    btn.addEventListener('click', () => {
      Swal.fire({
        title: 'Procesando pago...',
        text: `Se está realizando el pago de la certificación ${certId.toUpperCase()}.`,
        icon: 'info',
        showConfirmButton: false,
        timer: 1500,
        didOpen: () => Swal.showLoading()
      }).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Pago exitoso',
          text: `Pago de la certificación ${certId.toUpperCase()} realizado con éxito.`,
          confirmButtonColor: '#003366',
        });

        // Activar botón de obtener correspondiente
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

        // Guardar pago en localStorage por usuario
        pagos[user][certId] = true;
        localStorage.setItem("pagos", JSON.stringify(pagos));
      });
    });
  });
});
