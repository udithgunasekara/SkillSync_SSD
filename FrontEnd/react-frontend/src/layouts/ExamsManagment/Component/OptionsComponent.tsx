import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createOptions, getOptionById, updateOptionById } from '../service/Options';

const OptionsComponent: React.FC = () => {
  const [optionTxt, setOptionTxt] = useState('');
  const [errors, setErrors] = useState({
    optionTxt: ''
  });
  const navigationInOption = useHistory();
  const { questionId = '', examId = '', optionId = '' } = useParams<{
    questionId: string;
    examId: string;
    optionId: string;
  }>();
  const role = sessionStorage.getItem('role');
  useEffect(() => {
    validateUser(role);
  }, []);
  
  function validateUser(role: string | null){
    if(role){
      if (role !== 'moderator') {
        navigationInOption.push('/');
        alert('Restricted!')
      }
    } else {
      navigationInOption.push('/');
      alert('Restricted!')
    }
  }

  useEffect(() => {
    if (optionId) {
      getOptionById(optionId)
        .then((response) => {
          setOptionTxt(response.data.optionTxt);
          console.log(optionTxt);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [optionId]);

  function saveOrUpdateOptions(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(validateForm()){
      const option = { optionId, optionTxt, questionId };
      console.log(option, optionId, questionId);
      if (optionId) {
        updateOptionById(optionId, option)
          .then((response) => {
            console.log(response.data);
            navigationInOption.push(`/edit-Question/${questionId}/${examId}`);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        createOptions(questionId, option)
          .then((response) => {
            console.log(response.data);
            navigationInOption.push(`/edit-Question/${questionId}/${examId}`);
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

    if (optionTxt.trim()) {
      errorsCopy.optionTxt = '';
    } else {
      errorsCopy.optionTxt = 'Option is required!';
      valid = false;
    }

    setErrors(errorsCopy);

    return valid;
  }

  function pageTitle(): JSX.Element {
    if (optionId) {
      return <h2 className='text-center'>Update Option</h2>;
    } else {
      return <h2 className='text-center'>Add Option</h2>;
    }
  }
  return (
    <div className='container'><br></br><br></br><br></br>
      <div className='row'>
        <div className='card col-md-6 offset-md-3 0ffset-md-3'>
        {pageTitle()}
          <div className='card-body'>
            <form onSubmit={saveOrUpdateOptions}>
              <div className='form-group mb-2'>
                <label className='form-lable'></label>
                <input
                  type='text'
                  placeholder='Enter Answer'
                  name='answer'
                  value={optionTxt}
                  className={`form-control ${errors.optionTxt ? 'is-invalid' : ''}`}
                  onChange={(e) => setOptionTxt(e.target.value)}
                />
                {errors.optionTxt && <div className='invalid-feedback'>{errors.optionTxt}</div>}
              </div><br></br>
              <button className='btn btn-success' type='submit'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br></>
    </div>
  );
};

export default OptionsComponent;