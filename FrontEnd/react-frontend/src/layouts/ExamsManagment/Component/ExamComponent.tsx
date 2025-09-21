import React, { ChangeEvent, useEffect, useState } from 'react';
import { createExam, getExam, getExamImage, updateExam } from '../service/ExamsService';
import { Link, useHistory, useParams } from 'react-router-dom';
import { deleteQuestionById } from '../service/QuestionService';

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

const ExamComponent: React.FC = () => {
  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [noOfAttempts, setNoOfAttempts] = useState('');
  const [timeLimit, setTime] = useState('');
  const [badge, setBadge] = useState<File | null>(null);
  const [badgeURL, setBadgeURL] = useState<string>('');
  const [creditPoint, setCreditPoint] = useState('');
  const [badgeName, setBadgeName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const { id = '' } = useParams<{ id: string }>();
  const navigateInExam = useHistory();
  const role = sessionStorage.getItem('role');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // State to manage delete confirmation
  const [questionIdToDelete, setQuestionIdToDelete] = useState(''); // State to store the question id to delete

  useEffect(() => {
    validateUser(role);
  }, []);

  function validateUser(role: string | null){
    if(role){
      if (role !== 'moderator') {
        navigateInExam.push('/');
        alert('Restricted!')
      }
    } else {
      navigateInExam.push('/');
      alert('Restricted!')
    }
  }

  const [errors, setErrors] = useState({
    examName: '',
    examDescription: '',
    noOfAttempts: '',
    timeLimit: '',
    creditPoint: '',
    badge: ''
  });

  useEffect(() => {
    getExamById(id);
    if (id) {
      fetchBadgeImage(id);
    }
  }, [id]);

  async function fetchBadgeImage(examId: string) {
    try {
      const badgeImageData = await getExamImage(examId);
      const badgeFile = new File([badgeImageData.imageBytes], 'badge.jpg', { type: 'image/jpeg' });
  
      setBadgeURL(badgeImageData.imageURL);
      setBadge(badgeFile);
    } catch (error) {
      console.error('Error fetching badge image:', error);
    }
  }
  

  function getExamById(id: string) {
    if (id) {
      getExam(id)
        .then((response) => {
          setExamName(response.data.examName);
          setExamDescription(response.data.examDescription);
          setNoOfAttempts(response.data.noOfAttempts);
          setTime(response.data.timeLimit);
          setCreditPoint(response.data.creditPoint);
          if (response.data.questions) {
            setQuestions(response.data.questions);
          } else {
            setQuestions([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function saveOrUpdateExam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) {
      const exam = { id, examName, examDescription, noOfAttempts, questions, creditPoint, badge, badgeName, timeLimit };
      console.log(exam);
      if (id) {
        if (badge) {
          updateExam(id, exam, badge)
          .then((response) => {
            console.log(response);
            navigateInExam.push("/exams");
          })
          .catch((error) => {
            console.error(error);
          });
        } else {
          console.error("Badge is required!");
        }
      } else {
        if (badge) {
          createExam(exam, badge)
            .then((response) => {
              console.log(response);
              navigateInExam.push("/exams");
            })
            .catch((error) => {
              console.error(error);
            });
            console.log(badge);
        } else {
          console.error("Badge is required!");
        }
      }
    }
  }

  function validateForm(): boolean {
    let valid = true;
    const errorsCopy = { ...errors };
    const attemptsString = String(noOfAttempts);
    const timeLimitString = String(timeLimit);
    const creditPointsString = String(creditPoint);
    const examNameRegex = /^[a-zA-Z\s]*$/;
  
    if (examName.trim() && examNameRegex.test(examName)) {
      errorsCopy.examName = '';
    } else {
      if (examName.trim()) {
        errorsCopy.examName = 'invalid input type only letters!';
      } else {
        errorsCopy.examName = 'Exam name is required!';
      }
      valid = false;
    }
  
    if (examDescription.trim()) {
      errorsCopy.examDescription = '';
    } else {
      errorsCopy.examDescription = 'Exam Description is required!';
      valid = false;
    }
  
    if (attemptsString.trim() && parseInt(attemptsString) > 0) {
      errorsCopy.noOfAttempts = '';
    } else {
      if (attemptsString.trim()) {
        errorsCopy.noOfAttempts = 'No Of Attempts must be greater than 0!';
      } else {
        errorsCopy.noOfAttempts = 'No Of Attempts is required!';
      }
      valid = false;
    }
  
    if (timeLimitString.trim() && !isNaN(parseInt(timeLimitString)) && parseInt(timeLimitString) >= 0) {
      errorsCopy.timeLimit = '';
    } else {
      if (timeLimitString.trim()) {
        errorsCopy.timeLimit = 'Time Limit must be a number and greater than or equal to 0!';
      } else {
        errorsCopy.timeLimit = 'Time Limit is required!';
      }
      valid = false;
    }
  
    if (creditPointsString.trim() && !isNaN(parseInt(creditPointsString)) && parseInt(creditPointsString) >= 0) {
      errorsCopy.creditPoint = '';
    } else {
      if (creditPoint.trim()) {
        errorsCopy.creditPoint = 'Credit Point must be a number and greater than or equal to 0!';
      } else {
        errorsCopy.creditPoint = 'Credit Point is required!';
      }
      valid = false;
    }
  
    if(!badge){
      errorsCopy.badge = "badge is required!";
      valid = false;
    }
  
    setErrors(errorsCopy);
  
    return valid;
  }
  

  function pageTitle(): JSX.Element {
    if (id) {
      return <h2 className='text-center'>Update Exam</h2>;
    } else {
      return <h2 className='text-center'>Add Exam</h2>;
    }
  }

  // Function to confirm question deletion
  const confirmDelete = () => {
    deleteQuestionById(questionIdToDelete)
      .then(() => {
        setDeleteConfirmation(false); // Hide delete confirmation popup
        getExamById(id); // Refresh questions
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to cancel question deletion
  const cancelDelete = () => {
    setDeleteConfirmation(false); // Hide delete confirmation popup
  };

  // Function to set the question id to delete and show the confirmation popup
  const showDeleteConfirmation = (questionId: string, examId: string) => {
    setQuestionIdToDelete(questionId); // Set the question id to delete
    setDeleteConfirmation(true); // Show delete confirmation popup
  };

  function removeQuestion(id: string, examid: string) {
    showDeleteConfirmation(id, examid); // Show confirmation popup
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setBadge(e.target.files[0]);
    } else {
      setBadge(badge); // Set badge to the badgeURL fetched from the database
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  function questionDisplay(): JSX.Element | null {
    if (id) {
      return (
        <div className='container'>
          <h2 className='text-center'>Add Question</h2>
          <Link to={`/add-Question/${id}`}>
            <button className='btn btn-primary mb-2'>
              Add Question
            </button>
          </Link>
          <table className='table table-striped table-bordered'>
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.questionId}>
                  <td>
                    {question.questionTxt}
                    <br></br>
                    <Link to={`/add-Option/${question.examId}/${question.questionId}`}>
                      <button className='btn btn-info'>
                        Add Option
                      </button>
                    </Link>
                  </td>
                  <td>
                    <ul>
                      {question.options.map((option) => (
                        <li key={option.optionId}>
                          {option.optionTxt ? option.optionTxt : 'No option provided'}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <Link to={`/edit-Question/${question.questionId}/${question.examId}`}>
                      <button
                        className='btn btn-info'
                      >
                        Manage
                      </button>
                    </Link>
                    <button
                      className='btn btn-danger'
                      onClick={() => removeQuestion(question.questionId, question.examId)}
                      style={{ marginLeft: '10px' }}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  }

  return (
    <div className='container' style={{ overflowY: 'hidden' }}>
      <br></br><br></br><br></br><br></br>
      <div className='row'>
        <div className='card col-md-6 offset-md-3 0ffset-md-3'>
          {pageTitle()}
          <div className='card-body'>
            <form onSubmit={saveOrUpdateExam}>
              <div className='form-group mb-2'>
                <label className='form-lable'>Exam Name : </label>
                <input
                  type='text'
                  placeholder='Enter Exam Name'
                  name='examName'
                  value={examName}
                  className={`form-control ${errors.examName ? 'is-invalid' : ''}`}
                  onChange={(e) => setExamName(e.target.value)}
                ></input>
                {errors.examName && <div className='invalid-feedback'>{errors.examName}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-lable'>Exam Description : </label>
                <textarea
                  placeholder='Enter Exam Description'
                  name='examDescription'
                  value={examDescription}
                  className={`form-control ${errors.examDescription ? 'is-invalid' : ''}`}
                  onChange={(e) => setExamDescription(e.target.value)}
                ></textarea>
                {errors.examDescription && (
                  <div className='invalid-feedback'>{errors.examDescription}</div>
                )}
              </div>

              <div className='form-group mb-2'>
                <label className='form-lable'>No Of Attempts : </label>
                <input
                  type='number'
                  placeholder='Enter no of attempts'
                  name='noOfAttempts'
                  value={noOfAttempts}
                  className={`form-control ${errors.noOfAttempts ? 'is-invalid' : ''}`}
                  onChange={(e) => setNoOfAttempts(e.target.value)}
                ></input>
                {errors.noOfAttempts && <div className='invalid-feedback'>{errors.noOfAttempts}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-lable'>Time limitation : </label>
                <input
                  type='number'
                  placeholder='Enter time limit in minutes'
                  name='time'
                  value={timeLimit}
                  className={`form-control ${errors.timeLimit ? 'is-invalid' : ''}`}
                  onChange={(e) => setTime(e.target.value)}
                ></input>
                {errors.timeLimit && <div className='invalid-feedback'>{errors.timeLimit}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-lable'>Credit Points : </label>
                <input
                  type='number'
                  placeholder='Enter credit points'
                  name='creditPoint'
                  value={creditPoint}
                  className={`form-control ${errors.creditPoint ? 'is-invalid' : ''}`}
                  onChange={(e) => setCreditPoint(e.target.value)}
                ></input>
                {errors.creditPoint && <div className='invalid-feedback'>{errors.creditPoint}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-lable'>Badge : </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className={`form-control ${errors.badge ? 'is-invalid' : ''}`}
                />
                {errors.badge && <div className='invalid-feedback'>{errors.badge}</div>}
              </div>
              {badgeURL && (
                <div className="form-group mb-2">
                  <img src={badgeURL} alt={badgeName} style={{ width: '100px' }} />
                </div>
              )}
              <br></br>
              <button className='btn btn-success' type='submit'>
                Submit
              </button>
            </form>
          </div>
        </div>
        {questionDisplay()}
      </div>
      {!id && <><br></br><br></br><br></br><br></br><br></br><br></br></>}
      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Confirmation</h4>
                <button type="button" className="close" onClick={() => cancelDelete()}>&times;</button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this question?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => confirmDelete()}>Delete</button>
                <button type="button" className="btn btn-secondary" onClick={() => cancelDelete()}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamComponent;