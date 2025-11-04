// contact.controller.js

// Arreglo donde se guardarán los mensajes
const messages = [];

const submitContact = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Guardar el mensaje en el arreglo
  const newMessage = { name, email, message, date: new Date() };
  messages.push(newMessage);

  // Imprimir en consola
  console.log("Nuevo mensaje recibido:", newMessage);
  console.log("Todos los mensajes:", messages);

  // Enviar retroalimentación al frontend
  res.json({ success: true, message: "Mensaje Enviado" });
};

module.exports = { submitContact };
