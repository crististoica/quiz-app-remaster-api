export const generateQuiz = (data, numOfQuestions = 9) => {
  const limit = data.length;
  const indexesArr = new Set();

  while (indexesArr.size < numOfQuestions) {
    const index = Math.floor(Math.random() * limit);
    delete data[index].correctAnswer;
    indexesArr.add(data[index]);
  }

  return Array.from(indexesArr);
};

export const generateRealTest = (n, data, min, max) => {
  const totalQuestions = 18;

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const courses = ["BD", "POO", "RET", "PL"];
  let currentSum = 0;

  const nums = [];
  for (let i = 0; i < n; i++) {
    const num = getRandomInt(min, max);
    currentSum += num;
    nums[i] = num;
  }

  if (currentSum != totalQuestions) {
    const diff = totalQuestions - currentSum;

    if (diff > 0) {
      const minIndex = nums.indexOf(Math.min(...nums));
      nums[minIndex] += diff;
    } else {
      const maxIndex = nums.indexOf(Math.max(...nums));
      nums[maxIndex] += diff;
    }
  }

  const quiz = {};
  for (let i = 0; i < nums.length; i++) {
    const course = courses[i];
    quiz[course] = generateQuiz(data[course], nums[i]);
  }

  return quiz;
};

export const gradeQuiz = (data, userQuizData) => {
  const result = {
    entries: {},
  };

  Object.keys(userQuizData.userAnswers).forEach((key) => {
    let correctAnswers = 0;
    result.entries[key] = {
      data: [
        ...userQuizData.userAnswers[key].map((entry) => {
          if (entry.userAnswer === data[key][entry.index].correctAnswer) {
            correctAnswers++;
          }
          return {
            ...data[key][entry.index],
            userAnswer: entry.userAnswer,
            answeredCorrectly:
              entry.userAnswer === data[key][entry.index].correctAnswer,
          };
        }),
      ],

      score: correctAnswers,
    };
  });

  result.time = userQuizData.time;
  result.date = userQuizData.date;
  result.color = userQuizData.color;
  result.type = userQuizData.type;

  return result;
};
