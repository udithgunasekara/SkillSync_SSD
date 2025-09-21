import React, { useEffect, useState } from 'react';
import { createQuestions, getQuestionsById, updateQuestionsById } from '../service/QuestionService';
import { Link, useHistory, useParams } from 'react-router-dom';
import { deleteOptionById } from '../service/Options';

interface Option {
  optionId: string;
  optionTxt: string;
  questionId: string;
}

const QuestionsComponent: React.FC = () => {
  const [questionTxt, setQuestionTxt] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const { questionId = '', examId = '' } = useParams<{ questionId: string; examId: string }>();
  const navigationInQuestion = useHistory();
  const [errors, setErrors] = useState({
    questionTxt: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [optionIdToDelete, setOptionIdToDelete] = useState('');

  const role = sessionStorage.getItem('role');
  useEffect(() => {
    validateUser(role);
  }, []);

  function validateUser(role: string | null) {
    if (role) {
      if (role !== 'moderator') {
        navigationInQuestion.push('/');
        alert('Restricted!')
      }
    } else {
      navigationInQuestion.push('/');
      alert('Restricted!')
    }
  }

  useEffect(() => {
    getQuestions(questionId);
  }, [questionId]);

  function getQuestions(questionId: string) {
    if (questionId) {
      getQuestionsById(questionId)
        .then((response) => {
          setQuestionTxt(response.data.questionTxt);
          setOptions(response.data.options);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function saveOrUpdateQuestions(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) {
      const question = { questionId, questionTxt, options, examId };
      console.log(question);

      if (questionId) {
        updateQuestionsById(questionId, question)
          .then((response) => {
            console.log(response.data);
            navigationInQuestion.push(`/edit-exam/${examId}`);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        createQuestions(examId, question)
          .then((response) => {
            console.log(response.data);
            navigationInQuestion.push(`/edit-exam/${examId}`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }

  function validateForm(): boolean {
    let valid = true;
    const errorsCopy = { ...errors };

    if (questionTxt.trim()) {
      errorsCopy.questionTxt = '';
    } else {
      errorsCopy.questionTxt = 'Question is required!';
      valid = false;
    }

    setErrors(errorsCopy);

    return valid;
  }

  // Function to delete an option
  function removeOption(optionId: string, questionId: string) {
    // Show confirmation popup
    setOptionIdToDelete(optionId);
    setDeleteConfirmation(true);
  }

  // Function to confirm option deletion
  function confirmDelete() {
    deleteOptionById(optionIdToDelete)
      .then(() => {
        setDeleteConfirmation(false); // Hide delete confirmation popup
        getQuestions(questionId); // Refresh options
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Function to cancel option deletion
  function cancelDelete() {
    setDeleteConfirmation(false); // Hide delete confirmation popup
  }

  function pageTitle(): JSX.Element {
    if (questionId) {
      return <h2 className='text-center'>Update Question</h2>;
    } else {
      return <h2 className='text-center'>Add Question</h2>;
    }
  }

  function DisplayAnswers(): JSX.Element | null {
    if (questionId) {
      return (
        <div className='container'>
          <h2 className='text-center'>Manage answers</h2>
          <Link to={`/add-Option/${examId}/${questionId}`}>
            <button className='btn btn-primary mb-2'>
              Add Option
            </button>
          </Link>
          <table className='table table-striped table-bordered'>
            <thead>
              <tr>
                <th>Answer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr key={option.optionId}>
                  <td>{option.optionTxt}</td>
                  <td>
                    <Link to={`/edit-Option/${examId}/${option.questionId}/${option.optionId}`}>
                      <button className='btn btn-info'>
                        Update
                      </button>
                    </Link>
                    <button
                      className='btn btn-danger'
                      onClick={() => removeOption(option.optionId, option.questionId)}
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
    <div className='container'><br></br><br></br><br></br>
      <br></br>
      <div className='row'>
        <div className='card col-md-6 offset-md-3 0ffset-md-3'>
          {pageTitle()}
          <div className='card-body'>
            <form onSubmit={saveOrUpdateQuestions}>
              <div className='form-group mb-2'>
                <label className='form-lable'>Question : </label>
                <input
                  type='text'
                  placeholder='Enter Question'
                  name='question'
                  value={questionTxt}
                  className={`form-control ${errors.questionTxt ? 'is-invalid' : ''}`}
                  onChange={(e) => setQuestionTxt(e.target.value)}
                ></input>
                {errors.questionTxt && <div className='invalid-feedback'>{errors.questionTxt}</div>}
              </div><br></br>
              <button type='submit' className='btn btn-success'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      {DisplayAnswers()}
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
                <p>Are you sure you want to delete this option?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => confirmDelete()}>Delete</button>
                <button type="button" className="btn btn-secondary" onClick={() => cancelDelete()}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!questionId && <><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br></>}
    </div>
  );
}

export default QuestionsComponent;