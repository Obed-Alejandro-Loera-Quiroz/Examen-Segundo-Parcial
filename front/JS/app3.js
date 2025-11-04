document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita que se recargue la página

      const name = contactForm.name.value;
      const email = contactForm.email.value;
      const message = contactForm.message.value;

      // Obtener token de sesión (guardado al iniciar sesión)
      const token = localStorage.getItem("token"); // ajusta si guardas el token en otro lugar

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Debes iniciar sesión",
          text: "Por favor inicia sesión para enviar un mensaje.",
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/contact/send', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // enviar token al backend
          },
          body: JSON.stringify({ name, email, message })
        });

        // Si el token es inválido o no existe, backend devuelve 401
        if (response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Debes iniciar sesión",
            text: "Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.",
          });
          return;
        }

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Mensaje enviado!',
            text: 'Gracias por contactarnos. Te responderemos pronto.',
            confirmButtonText: 'Aceptar'
          });
          contactForm.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'Ocurrió un problema al enviar tu mensaje.',
            confirmButtonText: 'Aceptar'
          });
        }

      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el mensaje. Intenta nuevamente más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
});
