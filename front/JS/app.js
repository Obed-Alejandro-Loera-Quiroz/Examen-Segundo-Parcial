document.addEventListener('DOMContentLoaded', () => {
  checkSession();

  const form = document.getElementById('formLogin');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
});

// Manejo del login
async function handleLogin(e) {
  e.preventDefault();

  const login = document.getElementById('login').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginError = document.getElementById('loginError');
  loginError.textContent = "";

  if (!login || !password) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.'
    });
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cuenta: login, contrasena: password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data?.error || "Credenciales incorrectas");

    const cuenta = data.usuario?.cuenta || login;
    const token = data.token;

    // Guardar sesión en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userName", cuenta);

    // Actualizar menú
    updateMenu(cuenta);

    // Mostrar alerta de éxito
    await Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: `Has iniciado sesión como ${cuenta}.`,
      timer: 2000,
      showConfirmButton: false
    });

    // Redirigir a la página principal
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Credenciales incorrectas o problema al iniciar sesión.'
    });
  }
}


// Verificar sesión al cargar cualquier página
function checkSession() {
  const user = localStorage.getItem('userName');
  if (user) {
    updateMenu(user);
  }
}

// Actualizar el menú
function updateMenu(user) {
  const menuUser = document.getElementById('menuUser');
  if (menuUser) {
    menuUser.innerHTML = `
      <span>Hola, ${user}</span>
      <button id="logoutBtnMenu" class="btn-primary-small">Cerrar sesión</button>
    `;

    document.getElementById('logoutBtnMenu').addEventListener('click', logout);
  }
}

// Cerrar sesión
async function logout() {
  const user = localStorage.getItem('userName') || 'Usuario';
  

  // Preguntar confirmación antes de cerrar sesión
  const result = await Swal.fire({
    title: `Cerrar sesión`,
    text: `¿Deseas cerrar sesión, ${user}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) console.warn("Error del servidor al cerrar sesión.");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      // Limpiar localStorage

      localStorage.clear();

      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

      // Recargar la página para actualizar menú
      setTimeout(() => location.reload(), 2100);
    }
  }
}


