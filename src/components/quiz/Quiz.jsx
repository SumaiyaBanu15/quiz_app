import React, { useEffect, useState } from "react";
import "./quizStyles.css";
import axios from "axios";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track Selected answer
  const [score, setScore] = useState(0); //Track user's score
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(30); //Countdown timer for each questions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch quiz questions from an external Quiz API
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
        );
        setQuestions(res.data.results);
        setLoading(false);
      } catch (error) {
        setError("Failed to load questions");
      }
    };

    // Add a delay to avoid hitting the API too frequently
    const timeout = setTimeout(() => {
      fetchQuestions();
    }, 5000); //5 Second delay

    return () => clearTimeout(timeout);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      handleNextClick(); //Move to next question when time runs out
    }
  }, [timer]);

  // Handle answer selection
  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1); //Increase the score if answer is correct
    }
  };

  // Function to handle Next button
  const handleNextClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); //Reset selected answer
      setTimer(30); //Reset timer
    } else {
      setShowResult(true); //Show results when quiz is over
    }
  };

  // Function to handle Previous button
  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null); //Reset selected answer
      setTimer(30); //Reset timer
    }
  };

  // Reset the quiz
  const handleResetClick = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimer(30);
  };

  if (loading)
    return <div style={{ fontSize: "40px", margin: "10px" }}> Loading ...</div>;
  if (error)
    return <div style={{ fontSize: "40px", margin: "10px" }}> {error} </div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className="container">
        <div className="header">
        <h1>Quiz Application</h1>
        <div className="timer"> Time Remaining: {timer} seconds</div>
        </div>
        <hr />
        {showResult ? (
          <div style={{textAlign:'center', display: 'flex', flexDirection: 'column', gap:'40px'}}>
            <h2>
              Your Score : {score} / {questions.length}
            </h2>

            <button onClick={handleResetClick}>Reset Quiz </button>
          </div>
        ) : (
          <div>
            <h2>{currentQuestion.question}</h2>
            <ul>
              {currentQuestion.incorrect_answers.map((answer, idx) => (
                <li
                  key={idx}
                  onClick={() => handleAnswerClick(answer)}
                  style={{
                    backgroundColor:
                      selectedAnswer === answer
                        ? answer === currentQuestion.correct_answer
                          ? "green"
                          : "red"
                        : "",
                  }}
                >
                  {" "}
                  {answer}{" "}
                </li>
              ))}
              <li
                onClick={() =>
                  handleAnswerClick(currentQuestion.correct_answer)
                }
                style={{
                  backgroundColor:
                    selectedAnswer === currentQuestion.correct_answer
                      ? "green"
                      : "",
                }}
              >
                {currentQuestion.correct_answer}
              </li>
            </ul>

            <div className="navigation">
              <button
                onClick={handlePreviousClick}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </button>
            </div>

            <div className="question_no">
              {currentQuestionIndex + 1} of {questions.length} Questions
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Quiz;
