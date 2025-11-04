const API = "http://localhost:3000/api/questions";

const btnCargar = document.getElementById("btnCargar");
const quizForm = document.getElementById("quizForm");
const listaPreguntas = document.getElementById("listaPreguntas");
const resultado = document.getElementById("resultado");
const infoCert = document.getElementById("infoCert");
const nombre = localStorage.getItem("userName");

let preguntas = [];

// Obtener parámetro ?cert=java
const params = new URLSearchParams(window.location.search);
const certId = params.get("cert");

// Datos de cada certificación
const certificaciones = {
  java: {
    nombre: "Certified Java Developer",
    descripcion:
      "Certifica tus conocimientos en Java, Programación Orientada a Objetos, estructuras de datos y buenas prácticas.",
    ventajas: "Reconocimiento profesional y preparación para roles backend.",
    puntuacion: "7 / 8",
    tiempo: "45 min",
  },
  python: {
    nombre: "Certified Python Developer",
    descripcion:
      "Domina Python para análisis de datos y automatización de tareas.",
    ventajas: "Incrementa tu valor profesional en IA y desarrollo moderno.",
    puntuacion: "75 / 100",
    tiempo: "40 min",
  },
};

// Mostrar info si existe
if (certId && certificaciones[certId]) {
  const c = certificaciones[certId];
  document.getElementById("tituloExamen").textContent = `Examen de ${c.nombre}`;
  document.getElementById("certDesc").textContent = c.descripcion;
  document.getElementById("certVentajas").textContent =  c.ventajas;
  document.getElementById("certPunt").textContent = c.puntuacion;
  document.getElementById("certTiempo").textContent = c.tiempo;
  infoCert.style.display = "block";
}

// 🔹 Verificar si el examen ya fue realizado
let examenRealizado = localStorage.getItem(`examen_realizado_${certId}`) === "true";

if (examenRealizado) {
  btnCargar.textContent = "Examen ya realizado";
  btnCargar.classList.add("disabled-btn"); // estilo opcional
  const msg = document.createElement("p");
  msg.textContent = "✔ Ya completaste este examen.";
  msg.style.color = "#007700";
  msg.style.fontWeight = "bold";
  msg.style.marginTop = "10px";
  btnCargar.insertAdjacentElement("afterend", msg);
}

// 🔹 Evento click del botón
btnCargar.addEventListener("click", async () => {
  if (examenRealizado) {
    Swal.fire({
      icon: "warning",
      title: "Examen ya realizado",
      text: "Este examen solo puede hacerse una vez.",
      confirmButtonColor: "#003366",
    });
    return; // Evita que continúe
  }

  // Ocultar el botón al iniciar
  btnCargar.style.display = "none";

  try {
    const res = await fetch(`${API}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cert: certId }),
    });

    const data = await res.json();
    preguntas = data.questions;

    if (!preguntas || preguntas.length === 0) {
      Swal.fire(
        "Error",
        "No se encontraron preguntas para esta certificación.",
        "error"
      );
      btnCargar.style.display = "block";
      return;
    }

    listaPreguntas.innerHTML = "";
    preguntas.forEach((q) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <p><strong>${q.id}.</strong> ${q.text}</p>
        ${q.options
          .map(
            (opt) => `
          <label>
            <input type="radio" name="q_${q.id}" value="${opt}"> ${opt}
          </label><br>
        `
          )
          .join("")}
      `;
      listaPreguntas.appendChild(div);
    });

    quizForm.style.display = "block";
    resultado.innerHTML = "";
  } catch (err) {
    Swal.fire("Error", "No se pudo cargar el examen.", "error");
    btnCargar.style.display = "block";
  }
});

// Enviar respuestas
quizForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const answers = preguntas.map((q) => {
    const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
    return {
      id: q.id,
      originalId: q.originalId,
      answer: selected ? selected.value : "",
    };
  });

  try {
    const res = await fetch(`${API}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cert: certId, answers }),
    });

    const data = await res.json();

    // Guardar que el examen ya se hizo
    localStorage.setItem(`examen_realizado_${certId}`, "true");
    examenRealizado = true;

    Swal.fire({
      icon: "info",
      title: "Resultado",
      html: `<h3>Puntaje: ${data.score}/${data.total}</h3>`,
      confirmButtonText: "Ver detalles",
      confirmButtonColor: "#003366",
    }).then(async () => {
      resultado.innerHTML = `
        <h2>Resultado: ${data.score}/${data.total}</h2>
        ${data.details
          .map(
            (d) => `
          <div class="card">
            <p>${d.text}</p>
            <p>Tu respuesta: ${d.yourAnswer ?? "(sin responder)"}</p>
            <p>Correcta: ${d.correctAnswer}</p>
            <p class="${d.correct ? "ok" : "bad"}">
              ${d.correct ? "✔ Correcto" : "✖ Incorrecto"}
            </p>
          </div>
        `
          )
          .join("")}
      `;

      // 🔹 Mostrar el botón de nuevo
      btnCargar.textContent = "Examen ya realizado";
      btnCargar.style.display = "block";
      quizForm.style.display = "none";

      // 🔹 Calcular si aprobó (7/8 o más)
      const porcentaje = (data.score / data.total) * 100;
      const aprobado = porcentaje >= 87.5;

      if (aprobado) {
        Swal.fire({
          icon: "success",
          title: "¡Felicidades!",
          text: "Has aprobado el examen. Se generará tu certificado.",
          confirmButtonText: "Descargar certificado",
        }).then(async () => {
          // 🔹 Generar el PDF llamando al servidor
          const certificadoRes = await fetch(
            "http://localhost:3000/api/generar-pdf",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombreCompleto: nombre,
                certificacion: certificaciones[certId].nombre,
                puntaje: data.score,
                total: data.total,
                fecha: new Date().toLocaleDateString(),
              }),
            }
          );

          const blob = await certificadoRes.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Certificado_${certId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "No aprobaste",
          text: "Puedes repasar y volver a intentarlo más adelante.",
        });
      }
    });
  } catch (err) {
    Swal.fire("Error", "No se pudo enviar el examen.", "error");
  }
});
