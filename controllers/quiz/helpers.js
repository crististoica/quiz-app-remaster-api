export const generateQuiz = (data, numOfQuestions = 9) => {
  const limit = data.length;
  const indexesArr = new Set();

  while (indexesArr.size < numOfQuestions) {
    const index = Math.floor(Math.random() * limit);
    delete data[index].correctAnswer;
    indexesArr.add(data[index]);
  }

  return Array.from(indexesArr).sort();
};

export const gradeQuiz = (data, userQuizData) => {
  const userAnswers = userQuizData.userAnswers;
  const questions = [];

  userAnswers.forEach((answer) => {
    questions.push(data[answer.questionIndex]);
  });

  let correctAnswers = 0;
  questions.forEach((question, index) => {
    question.userAnswer = userAnswers[index].userAnswer;

    if (question.correctAnswer === userAnswers[index].userAnswer) {
      correctAnswers++;
    }
    question.answeredCorrectly =
      question.correctAnswer === userAnswers[index].userAnswer;
  });

  const result = {
    data: questions,
  };

  result.score = correctAnswers;
  result.time = userQuizData.time;
  result.date = userQuizData.date;
  result.color = userQuizData.color;
  result.type = userQuizData.type;

  return result;
};
