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
    loginError.textContent = "Por favor completa todos los campos.";
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

    // Redirigir a la página principal
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    loginError.textContent = "Error al iniciar sesión. Verifica tus datos.";
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
  try {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) console.warn("Error del servidor al cerrar sesión.");
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    location.reload(); // Recarga para actualizar menú
  }
}
