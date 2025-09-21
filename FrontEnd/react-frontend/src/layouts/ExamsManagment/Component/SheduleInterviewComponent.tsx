import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getFreelancer, listResevations, saveResevation } from '../service/Interview';
import { useHistory } from 'react-router-dom';

interface Interview {
  interviewId: string;
  category: string;
  date: string;
  time: string;
  meetingLink: string;
  freelancerFk: string;
}

const SheduleInterviewComponent: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const userName = sessionStorage.getItem('username') || '';
  const [freelancerFk, setFreeLancerFk] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<Date | null>(new Date()); // Initialize date to a valid value
  const [time, setTime] = useState<string>('');
  const navigateInInterview = useHistory();
  const role = sessionStorage.getItem('role');
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    validateUser(role);
  }, []);
  
  function validateUser(role: string | null){
    if(role){
      if (role !== 'moderator' && role !== 'freelancer') {
        navigateInInterview.push('/Freelancer/Login');
        alert('Restricted! please log in')
      }
    } else {
      navigateInInterview.push('/Freelancer/Login');
      alert('Restricted! please log in')
    }
  }

  // State to hold the last selected time
  const [lastSelectedTime, setLastSelectedTime] = useState<string>('');

  useEffect(() => {
    getFreelancer(userName)
      .then((response) => {
        console.log(response.data);
        setFreeLancerFk(response.data.id);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getResevation()
  }, []);

  function getResevation(){
    listResevations()
      .then((response) => {
        console.log(response.data);
        setInterviews(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function saveInformation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) {
      const meetingLink = '';
      const interviewId = '';
      const formattedDate = date ? formatDate(date) : ''; // Format date
      const reservation = { interviewId, category, date: formattedDate, time: lastSelectedTime, meetingLink, freelancerFk };
      saveResevation(freelancerFk, reservation)
        .then((response) => {
          console.log(response.data);
          alert("Reservation made successfully!")
          window.location.reload()
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  // Function to validate form
  const validateForm = () => {
    let errors: any = {};
    let formIsValid = true;

    if (!category.match(/^[a-zA-Z\s]*$/)) {
      formIsValid = false;
      errors["category"] = "Please enter only letters";
    }

    if (!category) {
      formIsValid = false;
      errors["category"] = "Please enter job title";
    }

    if (!date) {
      formIsValid = false;
      alert("Please select date")
      errors["date"] = "Please select date";
    }

    if (!time) {
      formIsValid = false;
      alert("Please select time")
      errors["time"] = "Please select time";
    }

    setErrors(errors);
    return formIsValid;
  }

  // Function to format date as "YYYY-MM-DD"
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get unavailable times for the selected date
  const disabledTimes = () => {
    const selectedInterviews = interviews.filter((interview) => interview.date === formatDate(date!));
    return selectedInterviews.map((interview) => interview.time);
  };

  // Function to get available times for the selected date
  const availableTimes = () => {
    const pickedTimes = disabledTimes();
    const allTimes = ['09:00:00', '11:00:00', '14:00:00', '16:00:00'];
    return allTimes.filter(time => !pickedTimes.includes(time));
  };

  // Function to get available dates
  const availableDates = () => {
    const availableDates = ['2024-05-01', '2024-05-02', '2024-05-03', '2024-05-04']; // Your available dates
    return availableDates
      .filter(date => {
        const selectedInterviews = interviews.filter(interview => interview.date === date);
        return selectedInterviews.length < 4;
      })
      .map(date => new Date(date));
  };

  // Function to handle button click
  const handleButtonClick = (selectedTime: string) => {
    setTime(selectedTime);
    setLastSelectedTime(selectedTime);
  };

  return (
    <div className='container'>
      <br />
      <br />
      <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3 0ffset-md-3'>
        <h2 className='text-center'>Make Reservation</h2>
          <div className='card-body'>
            <form onSubmit={saveInformation}>
              <div className='form-group mb-2'>
                <label className='form-label'>Category : </label>
                <input
                  type='text'
                  placeholder='Enter job title'
                  name='category'
                  value={category}
                  className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <div className="invalid-feedback">{errors.category}</div>
              </div>
              <p>Pick Date</p>
              <div className='form-group mb-2'>
                <DatePicker
                  selected={date}
                  onChange={(date: Date) => setDate(date)}
                  minDate={new Date()}
                  maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                  dateFormat="yyyy-MM-dd"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  disabled={availableDates().length === 0}
                  inline
                />
                <div className="invalid-feedback">{errors.date}</div>
              </div>
              <p>Select Time:</p>
              <div className='form-group mb-2'>
                <div>
                  {availableTimes().length > 0 ? (
                    availableTimes().map((t) => (
                      <button 
                        key={t} 
                        type="button" // Prevent the button from submitting the form
                        value={t} 
                        onClick={() => handleButtonClick(t)} 
                        className={`btn ${lastSelectedTime === t ? 'btn-success' : 'btn-primary'}`}
                        style={{marginRight: "5px"}}
                      >
                        {t.slice(0, -3)} {parseInt(t.slice(0, 2)) < 12 ? 'AM' : 'PM'}
                      </button>
                    ))
                  ) : (
                    <p>all the time slots are booked</p>
                  )}
                </div>
                <div className="invalid-feedback">{errors.time}</div>
              </div>
            <button className='btn btn-success' type='submit'>
              Submit
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheduleInterviewComponent;