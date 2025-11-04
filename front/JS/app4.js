document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const login = document.getElementById('login').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!login || !password) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos.',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cuenta: login,
            contrasena: password
          })
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || "Credenciales incorrectas");
        }

        // Guardar sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.usuario?.cuenta || login);

        // Alerta de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Has iniciado sesión como ${login}.`,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Redirigir a index.html después de aceptar
          window.location.href = "index.html";
        });

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesión',
          text: 'Usuario o contraseña incorrectos.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
});
