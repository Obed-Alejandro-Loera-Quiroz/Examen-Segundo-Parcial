const express = require("express");
const router = express.Router();
const { startQuiz, submitAnswers } = require("../controllers/questions.controller");


// POST que envía preguntas
router.post("/start", startQuiz);

// POST que recibe y evalúa respuestas
router.post("/submit", submitAnswers);



module.exports = router;