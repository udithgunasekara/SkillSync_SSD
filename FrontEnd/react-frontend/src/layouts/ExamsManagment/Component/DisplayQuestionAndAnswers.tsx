import React, { useEffect, useState } from 'react';
import {  useHistory, useParams } from 'react-router-dom';
import { getExam } from '../service/ExamsService';
import { saveUserAnswers } from '../service/UserAnswer';
import { saveUserResult } from '../service/UserResultService';

interface Question {
  questionId: string;
  questionTxt: string;
  options: Option[];
  examId: string;
}

interface Option {
  optionId: string;
  optionTxt: string;
  questionId: string;
}

const DisplayQuestionAndAnswers: React.FC = () => {
    const {examIdPk = ''} = useParams<{ examIdPk: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [timeLimit, setTimeLimit] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(parseInt(sessionStorage.getItem('currentQuestionIndex') || '0', 10));
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [savedAnswersMap, setSavedAnswersMap] = useState<Map<string, string>>(new Map());
    const [examFinished, setExamFinished] = useState<boolean>(sessionStorage.getItem('examFinished') === 'true');
    const userNamePk = sessionStorage.getItem('username') || '';
    const result = "pending";
    sessionStorage.setItem('examIdPk', examIdPk);
    const navigationInDisplayQuestion = useHistory();
    const role = sessionStorage.getItem('role');
    useEffect(() => {
      validateUser(role);
    }, []);
    
    function validateUser(role: string | null){
      if(role){
        if (role !== 'moderator' && role !== 'freelancer') {
          navigationInDisplayQuestion.push('/Freelancer/Login');
          alert('Restricted! please log in')
        }
      } else {
        navigationInDisplayQuestion.push('/Freelancer/Login');
        alert('Restricted! please log in')
      }
    }

    useEffect(() => {
      getQuestionByExamId(examIdPk);
    }, [examIdPk]);

    useEffect(() => {
      if (questions.length > 0) {
        const savedOptionId = savedAnswersMap.get(
          questions[currentQuestionIndex].questionId
        );
        setSelectedOption(savedOptionId ?? null);
      }
    }, [questions, currentQuestionIndex, savedAnswersMap]);

    useEffect(() => {
      const storedAnswers = sessionStorage.getItem('savedAnswersMap');
      if (storedAnswers) {
        setSavedAnswersMap(new Map(JSON.parse(storedAnswers)));
      }
    }, []);

    useEffect(() => {
      const storedCurrentQuestionIndex = sessionStorage.getItem('currentQuestionIndex');
      if (storedCurrentQuestionIndex) {
        setCurrentQuestionIndex(parseInt(storedCurrentQuestionIndex, 10));
      }
    }, []);

    useEffect(() => {
      sessionStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
    }, [currentQuestionIndex]);

    useEffect(() => {
      const storedTimeLimit = sessionStorage.getItem('timeLimit');
      if (storedTimeLimit) {
        setTimeLimit(parseInt(storedTimeLimit));
      } else {
        getQuestionByExamId(examIdPk);
      }
    }, [examIdPk]);
 
    useEffect(() => {
      const interval = setInterval(() => {
        if (timeLimit > 0) {
          setTimeLimit((prevTime) => {
            sessionStorage.setItem('timeLimit', (prevTime - 1).toString());
            return prevTime - 1;
          });
        } else {
          clearInterval(interval);
          saveAnswers();
        }
      }, 1000);
    
      return () => clearInterval(interval);
    }, [timeLimit]);

    function getQuestionByExamId(id: string) {
      if (id) {
        getExam(id)
          .then((response) => {
            if (response.data.questions) {
              setQuestions(response.data.questions);
              if(sessionStorage.getItem('timeLimit')){
                setTimeLimit(parseInt(sessionStorage.getItem('timeLimit') || '0',));
                console.log(sessionStorage.getItem('timeLimit'));
              }else{
                setTimeLimit(parseInt(response.data.timeLimit)*60);
                sessionStorage.setItem('timeLimit', (parseInt(response.data.timeLimit)*60).toString());
                console.log(sessionStorage.getItem('timeLimit'));
              }
              const newMap = new Map();
              response.data.questions.forEach(question => {
                newMap.set(question.questionId, null);
              });
              setSavedAnswersMap(newMap);
              const storedAnswers = sessionStorage.getItem('savedAnswersMap');
              if (storedAnswers) {
                // If data exists in session storage, update the savedAnswersMap
                setSavedAnswersMap(new Map(JSON.parse(storedAnswers)));
              }
              console.log(savedAnswersMap);
            } else {
              setQuestions([]);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }

    function saveAnswers() {
      savedAnswersMap.forEach((selectedOptionId, questionIdPk) => {
        const userAnswer = { userNamePk, questionIdPk, selectedOptionId };
        saveUserAnswers(userAnswer)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      });

      const userResult = {userNamePk, examIdPk, result}
      saveUserResult(userResult)
          .then((response) => {
            console.log(response.data);
            navigationInDisplayQuestion.push(`/attempt-exam/${examIdPk}`);
          })
          .catch((error) => {
            console.error(error);
          });

          sessionStorage.removeItem('savedAnswersMap');
          sessionStorage.removeItem('currentQuestionIndex');
          sessionStorage.removeItem('examFinished');
          sessionStorage.removeItem('examIdPk');
          sessionStorage.removeItem('timeLimit');
    }

    const handleOptionChange = (optionId: string) => {
      setSavedAnswersMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(questions[currentQuestionIndex].questionId, optionId);
        sessionStorage.setItem('savedAnswersMap', JSON.stringify(Array.from(newMap.entries())));
        return newMap;
      });
    };

    const DsiplaySelectedQuestion = (index: number) => {
      if(examFinished){
        setExamFinished(false);
      }
      setCurrentQuestionIndex(index);
    }

    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        console.log(selectedOption);
      }
    };

    const handleNext = () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        console.log(selectedOption);
      }
    };

    const currentQuestion = questions[currentQuestionIndex];

    function examFinshed(value: boolean){
      setExamFinished(value);
      sessionStorage.setItem('examFinished', value.toString());
    }

    function DisplayStateOfAnswers(){
      const displaySavedAnswer: string[] = [];
      let index = 0;

      savedAnswersMap.forEach((selectedOptionId) => {
          if(selectedOptionId){
            displaySavedAnswer[index] = "Answer Saved";
          }else{
            displaySavedAnswer[index] = "not Answerd";
          }
          index++;
      });
      console.log(displaySavedAnswer);

      return <><br></br><br></br><br></br>
      <div className="container">
        <div className="row">
          <div className="col-lg-4" style={{ flexBasis: '70%' }}>
            {/* Second Box: Question and Options */}
            <div className="card">
              <><div className="card-body">
                <h5 className="card-title">
                {displaySavedAnswer.map((answer, index) => (
                  <p key={index}>
                    Question {index + 1}: {answer}
                  </p>
                ))}
                </h5>
                </div>
                <div className="card-footer">
                <button
                className='btn btn-danger'
                onClick={() => examFinshed(false)}
                >return</button>
                <button
                className='btn btn-danger'
                onClick={() => saveAnswers()}
                style={{ marginLeft: '10px' }}
                >Submit</button>
              </div></>
            </div>
          </div>
          <div className="col-lg-4" style={{ flexBasis: '30%' }}>
            {/* Third Box: Question Navigation Panel */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Question Navigation</h5>
                <strong>Remaining Time: {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</strong>
                {questionNavigation()}
              </div>
            </div>
          </div>
        </div>
        <><br></br><br></br><br></br><br></br><br></br></>
      </div>
      </>
    }
    
    function questionNavigation() {
      return (
        <div className="row"><br></br><br></br><br></br>
        {Array.from(savedAnswersMap).map(([questionId, optionId], index) => (
          <div key={questionId} className="col-2 mb-2">
            {/* col-4 will ensure that each button occupies 1/3 of the row width */}
            <button
              onClick={() => DsiplaySelectedQuestion(index)}
              className={`btn ${optionId ? 'btn-danger' : 'btn-primary'} btn-block`}
            >
              Q{index + 1}
            </button>
          </div>
        ))}
      </div>
      );
    }

    const hours = Math.floor(timeLimit / 3600);
    const minutes = Math.floor((timeLimit % 3600) / 60);
    const seconds = timeLimit % 60;

  return (
  <><br></br><br></br><br></br>
  {examFinished? DisplayStateOfAnswers() :
  <div className="container">
    <div className="row">
      <div className="col-lg-4" style={{ flexBasis: '5%' }}>
        {/* First Box: Question Number */}
        <div className="card">
          <div className="card-body">
              <h5 className="card-title">Q{currentQuestionIndex + 1}</h5>
              {/* Add code to display question number */}
          </div>
        </div>
      </div>
    <div className="col-lg-4" style={{ flexBasis: '60%' }}>
      {/* Second Box: Question and Options */}
      <div className="card">
        {currentQuestion ? (
          <><div className="card-body">
          <h5 className="card-title">{currentQuestion.questionTxt}</h5>
          <div>
              {currentQuestion.options.map((option) => (
                <div key={option.optionId} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="option"
                    id={option.optionId}
                    value={option.optionTxt}
                    checked={selectedOption === option.optionId}
                    onChange={() => handleOptionChange(option.optionId)}
                  />
                  <label className="form-check-label" htmlFor={option.optionId}>
                    {option.optionTxt}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer">
            {currentQuestionIndex > 0 && 
            <button
            className='btn btn-danger'
            onClick={() => handlePrevious()}
            >previous</button>}
            {currentQuestionIndex < questions.length - 1 ? 
            <button
            className='btn btn-danger'
            onClick={() => handleNext()}
            style={{ marginLeft: '10px' }}
            >next</button>: 
            <button
            className='btn btn-danger'
            onClick={() => examFinshed(true)}
            style={{ marginLeft: '10px' }}
            >finish</button>}
          </div></>
        ) : (<>
        <button
                className='btn btn-danger'
                onClick={() => saveAnswers()}
                style={{ marginLeft: '10px' }}
                >Submit</button>
          <p>Loading...</p></>
        )}
      </div>
    </div>
    <div className="col-lg-4" style={{ flexBasis: '30%' }}>
      {/* Third Box: Question Navigation Panel */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Question Navigation</h5>
            <strong>Remaining Time: {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</strong>
            {questionNavigation()}
          </div>
        </div>
      </div>
    </div>
    <><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br></>
  </div>}

  </>
)
}

export default DisplayQuestionAndAnswers;