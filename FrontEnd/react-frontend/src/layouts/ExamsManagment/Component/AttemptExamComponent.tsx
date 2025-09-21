import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { getUserResultById } from '../service/UserResultService';
import { getExam, getExamImage } from '../service/ExamsService';
import { getUserAttemptsById, saveUserAttempts, updateUserAttempts } from '../service/UserAttemptsService';

const AttemptExamComponent: React.FC = () => {
    const {examIdPk = ''} = useParams<{ examIdPk: string }>();
    const userNamePk = sessionStorage.getItem('username') || '';
    const [result, setResult] = useState('');
    const enrolledExam = sessionStorage.getItem('examIdPk') || null;
    const [examName, setExamName] = useState('');
    const [examDescription, setExamDescription] = useState('');
    const [noOfExamAttempts, setNoOfExamAttempts] = useState('');
    const [timeLimt, setTimeLimit] = useState('');
    const [badge, setBadge] = useState<File | null>(null);
    const [badgeName, setBadgeName] = useState('');
    const [badgeURL, setBadgeURL] = useState<string>('');
    const [noOfUserAttempts, setNoOfUserAttempts] = useState('');
    const [canAttempt, setCanAttempt] = useState<boolean>();
    const examId = examIdPk;
    const userName = userNamePk;
    const navigatInAttempt = useHistory();
    const role = sessionStorage.getItem('role');
    useEffect(() => {
      validateUser(role);
    }, []);
    
    function validateUser(role: string | null){
      if(role){
        if (role !== 'moderator' && role !== 'freelancer') {
          navigatInAttempt.push('/Freelancer/Login');
          alert('Restricted! please log in')
        }
      } else {
        navigatInAttempt.push('/Freelancer/Login');
        alert('Restricted! please log in')
      }
    }
    useEffect(() => {
      if (examId) {
        fetchBadgeImage(examId);
      }
    }, [examId]);

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

    getExam(examIdPk)
    .then((response) => {
      setExamName(response.data.examName);
      setExamDescription(response.data.examDescription);
      setNoOfExamAttempts(response.data.noOfAttempts);
      setTimeLimit(response.data.timeLimit);
    })
    .catch((error) => {
      console.error(error);
    });

    getUserResultById(userNamePk, examIdPk)
      .then((response) => {
        if(response.data.result){
          setResult(response.data.result); 
        }
      })
      .catch((error) => {
        console.error(error);
      });

    getUserAttemptsById(userNamePk, examIdPk)
    .then((response) => {
      setNoOfUserAttempts(response.data.noOfAttempts);
      console.log(response.data.noOfAttempts)
      if(noOfUserAttempts){
        if(parseInt(noOfExamAttempts) <= parseInt(noOfUserAttempts)){
          setCanAttempt(false);
        }else{
          setCanAttempt(true);
        }
      }else{
        setCanAttempt(true);
      }
      console.log(canAttempt)
    })
    .catch((error) => {
      console.error(error);
    });

    useEffect(() => {
      if(noOfUserAttempts){
          if(parseInt(noOfExamAttempts) <= parseInt(noOfUserAttempts)){
              setCanAttempt(false);
          } else {
              setCanAttempt(true);
          }
      } else {
          setCanAttempt(true);
      }
  }, [noOfUserAttempts, noOfExamAttempts]);

    function saveOrUpdateUserAttemptsById(){
      let noOfAttempts = '1';
      if(noOfUserAttempts){
        noOfAttempts = (parseInt(noOfUserAttempts) + 1).toString();
      }
      const userAttempts = {userName, examId, noOfAttempts};
      if(noOfUserAttempts){
        updateUserAttempts(userName, examId, userAttempts)
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
        });
      }else{
        saveUserAttempts(userAttempts)
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
  return (
    <><br></br><br></br><br></br>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body text-center">
            {result === 'pass' ? (
              <><div className="form-group mb-2">
                <h3>You passed the exam!</h3>
                {badgeURL && (
                  <img src={badgeURL} alt={badgeName} className="profile-image-msg" style={{ left: '270px' }} />
                )}
              </div><br></br>
              <Link to={`/freelancers/${userName}`}>
              <button className="btn btn-danger">
                view badge in profile
              </button>
            </Link><br></br><br></br></>
            ) : (
              <>
                <h1>{examName}</h1>
                <h5>{examDescription}</h5>
                {noOfUserAttempts ? (
                  <p>No Attempts Left : {parseInt(noOfExamAttempts) - parseInt(noOfUserAttempts)}</p>
                ) : (
                  <p>No Attempts Left : {parseInt(noOfExamAttempts) - 0}</p>
                )}
                <p>Time Limit : {timeLimt}</p>
              </>
            )}
              {enrolledExam ? (
                <div>
                  {enrolledExam !== examIdPk ? (
                    <div>
                      <Link to={`/attempt-exam/${enrolledExam}`}>
                      <button className="btn btn-danger">
                        Go To Enrolled Exam
                      </button>
                      </Link>
                      <h3>Your already Doing Exam</h3>
                    </div>
                  ) : (
                    <div>
                      <h2>Answers not submitted! Re-attempt to continue the exam</h2>
                      <h3>summry of your previous attempts</h3>
                      <table className='table table-striped table-bordered'>
                        <thead>
                        <tr>
                          <th>attempts</th>
                          <th>state</th>
                          <th>result</th>
                        </tr>
                        </thead>
                        <tbody>
                          <tr>
                          <td>{noOfUserAttempts? noOfUserAttempts: '0'}</td>
                          <td>In progress</td>
                          <td>{result? result:'not permitted'}</td>
                          </tr>
                        </tbody>
                      </table>
                      <Link to={`/take-exam/${examIdPk}`}>
                      <button className="btn btn-danger">
                        Re-Attempt
                      </button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {canAttempt ? (
                    <div>
                      <h3>summry of your previous attempts</h3>
                      <table className='table table-striped table-bordered'>
                        <thead>
                        <tr>
                          <th>attempts</th>
                          <th>state</th>
                          <th>result</th>
                        </tr>
                        </thead>
                        <tbody>
                          <tr>
                          <td>{noOfUserAttempts? noOfUserAttempts: '0'}</td>
                          <td>not Attempted</td>
                          <td>{result? result:'not permitted'}</td>
                          </tr>
                        </tbody>
                      </table>
                      <Link to={`/take-exam/${examIdPk}`}>
                      <button className="btn btn-danger" onClick={() => saveOrUpdateUserAttemptsById()}>
                        Attempt
                      </button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <h3>summry of your previous attempts</h3>
                      <table className='table table-striped table-bordered'>
                        <thead>
                        <tr>
                          <th>attempts</th>
                          <th>state</th>
                          <th>result</th>
                        </tr>
                        </thead>
                        <tbody>
                          <tr>
                          <td>{noOfUserAttempts? noOfUserAttempts: '0'}</td>
                          <td>Finished</td>
                          <td>{result? result:'not permitted'}</td>
                          </tr>
                        </tbody>
                      </table>
                      <Link to={'/exams'}>
                      <button className="btn btn-danger">
                        Back To exam
                      </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default AttemptExamComponent