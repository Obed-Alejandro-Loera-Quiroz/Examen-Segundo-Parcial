const express = require("express");
const authRoutes = require("./routes/auth.routes");
const questionsRoutes = require("./routes/questions.routes");
const contactRoutes = require("./routes/contact.routes");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares mínimos
app.use(express.json());

const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500', // Live Server local
  'http://localhost:5500',
  'http://10.13.140.99:5500', 
  'http://10.13.140.90:5500',
   // Alternativa (según navegador)
];

app.use(cors({ 
  origin: function (origin, callback) {
    
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true); // null = sin error, true = permitido
    }
    // Si el origen no está permitido, se rechaza la solicitud con un mensaje de error.
    return callback(new Error('Not allowed by CORS: ' + origin));
  },

  // Especifica los métodos HTTP que este servidor aceptará.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

  // Algunos navegadores antiguos esperan un código 200 (en lugar de 204) en respuestas "preflight".
  optionsSuccessStatus: 200
}));


// Montar rutas bajo /api
app.use("/api", authRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/contact", contactRoutes);

// (Opcional) Ruta de salud
app.get("/health", (_req, res) => res.json({ ok: true }));

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
