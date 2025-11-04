const QUESTIONS = require("../data/questions");

// --- 1) Enviar preguntas al frontend ---
const startQuiz = (req, res) => {
  console.log("Acceso concedido al api /api/questions/start a Pamilon Tech Certifications");

  // Mezcla las preguntas y selecciona 8 al azar
  const shuffled = QUESTIONS.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 8); // solo 8 preguntas

  // Crea la copia pública para el front con ID secuencial y opciones aleatorias
  const publicQuestions = selected.map(({ id, text, options }, index) => {
    // Mezcla las opciones de respuesta (clonando el array para no alterar el original)
    const shuffledOptions = [...options].sort(() => 0.5 - Math.random());

    return {
      id: index + 1,        // Número visible (1 a 8)
      originalId: id,       // ID original para calificación
      text,
      options: shuffledOptions
    };
  });

  res.status(200).json({
    message: "Preguntas y opciones aleatorias listas. ¡Éxito!",
    questions: publicQuestions
  });
};

// --- 2) Recibir y evaluar respuestas ---
const submitAnswers = (req, res) => {
  console.log("Acceso concedido al api /api/questions/submit a Pamilon Tech Certifications");
  console.log("Respuestas evaluadas", req.body);

  const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];
  let score = 0;
  const details = [];

  for (const userAns of userAnswers) {
    const q = QUESTIONS.find(q => q.id === userAns.originalId);
    if (!q) continue;

    const isCorrect = userAns.answer == q.correct;
    if (isCorrect) score++;

    details.push({
      id: userAns.id,
      text: q.text,
      yourAnswer: userAns.answer,
      correctAnswer: q.correct,
      correct: isCorrect
    });
  }

  return res.status(200).json({
    message: "Respuestas evaluadas.",
    score,
    total: userAnswers.length,
    details
  });
};

module.exports = { startQuiz, submitAnswers };
