import React, { useEffect, useState } from 'react';
import { createNewJobPost, updateJobPost } from '../Service/JobService';
import {getJobPostingById} from '../Service/JobService';
import { useHistory, useParams } from 'react-router-dom';


interface Job {
    jobTitle: string;
    scope: string;
    skills: string;
    budget: string;
    description: string;
    customerUsername: string;
}

// Define an interface for the route parameters
interface RouteParams {
    id: string; // Assuming 'id' is a string, change the type if it's different
  }

const categories: string[] = ['Design & Creative', 'Writing', 'Admin support', 'Customer Service', 'Digital Marketing', 'mobile & web development']; // categories 

const predefinedSkills: { [key: string]: string[] } = {
    'Design & Creative': [' Adobe Photoshop', ' Graphic Design', ' Logo Design', ' Adobe Illustrator', ' Video Editing', ' Color Grading', ' Video Post-Editing'],
    'Writing': [' Content Writing', ' English', ' Creative Writing', ' Blog Content', ' Article Writing'],
    'Admin support': [' Data Entry', ' Accuracy Verification', ' Email Communication', ' Proofreading', ' Online Research'],
    'Customer Service': [' Social Media Engagement', ' Social Media Marketing', ' Content Marketing Strategy'],
    'Digital Marketing': [' Social Media Management', ' Content Creation', ' Social Media Marketing', ' Advertising Management', ' Brand Development'],
    'mobile & web development': [' AngularJS', ' Bootstrap', ' Git', ' React', ' Node.js', ' Database Architecture']
}; 

// no need to skillsync
const styles = {
    container: {
        marginTop: '50px', // Adjust margin as needed
        width: 'auto', // Set a fixed width for the card
        display: 'block', // Use block display to center the element
    }
};  


const JobComponent: React.FC = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [scope, setScope] = useState<string>('');
    const [skills, setSkills] = useState<string[]>([]);
    const [budget, setBudget] = useState('');
    const [description, setDescription] = useState('');
    const [jobTitleError, setJobTitleError] = useState('');
    const [budgetError, setBudgetError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [category, setCategory] = useState('');
    const [customSkill, setCustomSkill] = useState('');
    const [skillsError, setSkillsError] = useState(''); 
    const [scopeError, setScopeError] = useState<string>('');
    const [customerUsername, setCustomerUsername] = useState('');
    const navigate = useHistory();

    const {id} = useParams<RouteParams>();
    //const id = sessionStorage.getItem(id);

    useEffect(() => {
        const username = sessionStorage.getItem('username');

        if(username){
            setCustomerUsername(username);
        }
        
        if(id){
            getJobPostingById(id).then((response) => {
                setJobTitle(response.data.jobTitle);
                setBudget(response.data.budget);
                setScope(response.data.scope);
                // setSkills(response.data.skills);
                setDescription(response.data.description);
            }).catch(error =>{
                console.error(error);
            })
        }
    }, [id])

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        setSkills([]);
    };

    const handleSkillClick = (skill: string) => {
        if (skills.length < 5) {
            setSkills(prevSkills => [...prevSkills, skill]);
            setSkillsError('');
        } else {
            setSkillsError('You can select up to 5 skills.');
        }
    };

    const handleAddCustomSkill = () => {
        if (customSkill.trim() !== '') {
            if (skills.length < 5) {
                setSkills(prevSkills => [...prevSkills, customSkill]);
                setCustomSkill('');
                setSkillsError('');
            } else {
                setSkillsError('You can select up to 5 skills.');
            }
        } else {
            setSkillsError('Please enter a skill.');
        }
    };

    const handleRemoveSkill = (skill: string) => {
        const updatedSkills = skills.filter(s => s !== skill);
        setSkills(updatedSkills);
    };

    // Check if job title contains numbers or special characters
    const handleJobTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (/^[a-zA-Z\s]+$/.test(e.target.value) || e.target.value === '') {
            setJobTitle(e.target.value);
            setJobTitleError('');
        } else {
            setJobTitleError('Job title cannot contain numbers or special characters');
        }
    };

    ////Budget value should not be 0$
    const handleBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d.]/g, '');
        if (parseFloat(value) > 0.0 || value === '') {
            setBudget(value);
            setBudgetError('');
        }
    };
    

    // Function to navigate back to ListJobComponent
    const handleCancel = () => {
        navigate.push('/jobs');
        };


    // Function to save the job post to the database
    const saveOrUpdateJobPost = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

         // Capture current timestamp
         const currentTimestamp = new Date().toISOString(); 
         const skillsString = skills.join(', '); 

         // Check if job title is empty
        if (jobTitle.trim() === '') {
            setJobTitleError('Please enter a job title.');
            return;
        }

        //Check if scope is empty
        if (scope.trim() === '') {
            setScopeError('Please select a scope.');
            return;
        }

        //Check if budget is empty
        if (budget.trim() === '') {
            setBudgetError('Please tell us about your budget.');
            return;
        }

        //Check if budget value is less than minimum budget
        if (parseFloat(budget) < 5.0) {
            setBudgetError('Minimum budget value is $5.0');
            return;
        }

        //Check if budget is empty
        if (description.trim() === '') {
            setDescriptionError('Please describe what you need.');
            return;
        }

        if (skills.length < 3 || skills.length > 5) {
            setSkillsError('Please select between 3 to 5 skills.');
            return;
        } 

        if (jobTitleError || budgetError) {
            return;
        }

        const job = { jobTitle, scope, skills:skillsString, budget, description, postedTime: currentTimestamp, customerUsername};
        console.log(job);

        if(id){
            updateJobPost(id, job).then((response) => {
                console.log(response.data);
                navigate.push('/jobs');
                window.alert('Jobpost updated successfully!');
            }).catch(error => {
                console.error(error);
            })

        }else{
            createNewJobPost(job)
            .then((response) => {
                console.log(response.data);
                navigate.push('/jobs');
                window.alert('Jobpost published successfully!');
            })
            .catch((error) => {
                console.error('Error saving job post:', error);
            });
        }
        
    };

    function pageTitle(){
        if(id){
            return <h2 className='text-center'>Update JobPost</h2>
        }else{
            return <h2 className='text-center'>Add Job Post Details</h2>
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='card'>
                    {
                        pageTitle()
                    } 
                    <div className='card-body'>
                        <form className='needs-validation' noValidate onSubmit={saveOrUpdateJobPost} 
                            style={{ border: '2px solid #ccc', padding: '40px' }}>
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group mb-2'>
                                        <label className='form-label' style={{ fontWeight: 'bold', 
                                            textAlign: 'left' ,color: 'black'}}>Job Title</label> 
                                        <input
                                            type='text'
                                            className={`form-control ${jobTitleError && 'is-invalid'}`}
                                            id='jobTitle'
                                            placeholder='Enter title for your job post'
                                            value={jobTitle}
                                            onChange={(e) => { handleJobTitle(e); }}
                                            required
                                        />
                                        {jobTitleError && <div className='invalid-feedback' style={{textAlign: 'center'}}>{jobTitleError}</div>}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <span style={{ fontWeight: '600',color: '#666666'}}> Example titles</span><br />
                                        <ul style={{ listStyleType: 'disc' }}>
                                            <li> Illustrator needed to create captivating visuals for social media campaigns.</li>
                                            <li> Social Media Manager </li>
                                            <li> Copywriter required to craft compelling product descriptions for an e-commerce store.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className='col'>
                                    <div className='form-group row mb-2'>
                                        <div style={{marginLeft: '40px'}}>
                                        <label className='form-label' style={{ whiteSpace: 'nowrap', 
                                            fontWeight: 'bold', textAlign: 'left',color: 'black'}}>Required Skills</label><br/>
                                            <div style={{ textAlign: 'left' }}>
                                                What are the main skills required for your work?
                                                <div className='row g-3'>
                                                    <div className='col-sm-7'>
                                                        <select value={category} onChange={handleCategoryChange} className='form-select col-sm-7' 
                                                            style={{border: '1px solid #bbb'}}>
                                                            <option value="">Select Category</option>
                                                            {categories.map((cat, index) => (
                                                                <option key={index} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {category && (
                                                <div><br />
                                                    <label style={{fontWeight: '600'}}>Add 3 - 5 Skills:</label>
                                                    <ul>
                                                        {predefinedSkills[category] && predefinedSkills[category].map((skill, index) => (
                                                            <button 
                                                                type="button"
                                                                className='btn btn-light' 
                                                                onClick={() => handleSkillClick(skill)} 
                                                                style={{ backgroundColor: '#c585f7', 
                                                                            color: 'white', padding: '5px', margin: '5px', 
                                                                            borderRadius: '15px' , borderColor: '#C264FF'
                                                                        }}>
                                                                {skill}
                                                            </button>
                                                        ))}
                                                    </ul>
                                                </div>      
                                             )}<br/>
                                            <div className='row g-3'>
                                                <div className='col-sm-3'>
                                                    <label style={{fontWeight: '600'}}>Custom Skill:</label>
                                                </div>
                                                <div className='col-sm-5'>
                                                    <input
                                                        style={{ 
                                                            border: '1px solid #bbb'
                                                        }}
                                                        type="text" 
                                                        className='form-control col-sm-7' 
                                                        value={customSkill}  
                                                        onChange={(e) => {
                                                            const inputVal = e.target.value;
                                                            if (/^[A-Za-z\s]+$/.test(inputVal) || inputVal === '') {
                                                                setCustomSkill(inputVal);
                                                            }
                                                        }} 
                                                    />
                                                </div>
                                                <div className='col-sm'>
                                                    <button 
                                                        type="button" 
                                                        className='btn btn-light' 
                                                        onClick={handleAddCustomSkill} 
                                                        style={{ backgroundColor: '#c585f7' , color: 'white' ,
                                                                borderRadius: '15px' , padding: '5px',
                                                                margin: '5px',
                                                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)', 
                                                                transition: 'box-shadow 0.3s', 
                                                                }}>
                                                        Add Custom Skill
                                                    </button>
                                                </div>
                                                {skillsError && <span style={{ color: 'red' , textAlign: 'center'}}>{skillsError}</span>}
                                                </div>
                                                <div>
                                                    <label style={{fontWeight: '600'}}>Selected Skills:</label>
                                                    <ul>
                                                        {skills.map((skill, index) => (
                                                            <li key={index}>
                                                                {skill}
                                                                <button 
                                                                    onClick={() => handleRemoveSkill(skill)} 
                                                                    style={{ marginLeft: '5px' , borderColor: 'white' , borderRadius: '2px' , padding: '2px'}}>
                                                                    remove
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div><br /> 
                                    </div>
                                </div>

                                <div style={{ width: '100%' }}>
                                <hr style={{ 
                                    border: '1px solid', // Style of the line
                                    width: '100%', // Width of the line
                                    margin: '10px auto', // Margin around the line
                                    borderColor: 'black'
                                }} />
                                </div>
                            </div>  

                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group row mb-2'>
                                        <label className='form-label' style={{ fontWeight: 'bold',
                                             textAlign: 'left' ,color: 'black'}}>Budget</label><br/>
                                        <div style={{textAlign: 'left' , fontWeight: '600',color: '#666666'}}>
                                            (Minimum budget is 5.0$)
                                        </div>
                                        <div className='row'>
                                            <div className='input-group'>
                                                <span className='input-group-text'>$</span>
                                                <div className='col-sm-3'>
                                                    <input
                                                    type='text'
                                                    className={`form-control ${budgetError && 'is-invalid'}`}
                                                    name='budget'
                                                    placeholder='5.0'
                                                    value={budget}
                                                    onChange={(e) => handleBudget(e)}
                                                    required
                                                    />
                                                </div>
                                            </div>      
                                        </div>
                                        {budgetError && <div className='text-danger' style={{textAlign: 'left'}}>{budgetError}</div>}
                                    </div><br />
                                </div>

                                <div className='col'>
                                    <div className='form-group row mb-2'>
                                        <div style={{marginLeft: '40px'}}>
                                            <label className='form-label' style={{ fontWeight: 'bold' ,color: 'black'}}>Scope</label>  
                                                <div className='col-sm-9'>
                                                    <div className="form-check">
                                                        <input
                                                            style={{ 
                                                                border: '2px solid #bbb',
                                                            }}
                                                            type='radio'
                                                            id='shortTerm'
                                                            name='scope'
                                                            value='short term'
                                                            checked={scope === 'short term'}
                                                            className="form-check-input"
                                                            onChange={(e) => { 
                                                                setScope(e.target.value);
                                                                setScopeError(''); // Reset scope error when radio button is selected
                                                            }}
                                                        />
                                                        <label htmlFor='shortTerm' className="form-check-label" >
                                                            <span style={{ fontWeight: '600',color: '#666666' }}>Short Term</span>
                                                            <span style={{ marginLeft: '5px' }}>(Quick and straightforward tasks)</span>
                                                        </label>
                                                    </div>

                                                    <div className="form-check">
                                                        <input
                                                            style={{ 
                                                                border: '2px solid #bbb',
                                                            }}
                                                            type='radio'
                                                            id='longTerm'
                                                            name='scope'
                                                            value='long term'
                                                            checked={scope === 'long term'}
                                                            className="form-check-input"
                                                            onChange={(e) => {
                                                                setScope(e.target.value)
                                                                setScopeError('');
                                                            }}
                                                        />
                                                        <label htmlFor='longTerm' className="form-check-label" >
                                                            <span style={{ fontWeight: '600',color: '#666666' }}>Long Term</span>
                                                            <span style={{ marginLeft: '5px' }}>(longer term or complex initiatives)</span>
                                                        </label>
                                                    </div>
                                                    
                                                </div>
                                        </div> 
                                    </div> 
                                    {/* Error message for scope */} 
                                    {scopeError && <div className='text-danger' style={{textAlign: 'center'}}>{scopeError}</div>}
                                    <br/> 
                                </div>

                                <div style={{ width: '100%' }}>
                                <hr style={{ 
                                    border: '1px solid', // Style of the line
                                    width: '100%', // Width of the line
                                    margin: '10px auto', // Margin around the line
                                    borderColor: 'black'
                                }} />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col'>
                                <div className='form-group row mb-2'>
                                <label className='form-label' style={{ fontWeight: 'bold',
                                     textAlign: 'left',color: 'black'}}>Description</label>
                                    <div style={{textAlign: 'left'}}>
                                        <span style={{color: '#666666',fontWeight:'600'}}>Describe what you need</span><br/>
                                        <ul style={{ listStyleType: 'disc' }}>
                                            <li>Clear expectations about your task or deliverables</li>
                                            <li>Details about how you like to work</li>
                                        </ul>
                                    </div>
                                    <textarea
                                        className={`form-control ${descriptionError && 'is-invalid'}`}
                                        name='description'
                                        placeholder='I am looking for....'
                                        value={description}
                                        onChange={(e) => {setDescription(e.target.value); setDescriptionError(''); }}
                                        required
                                    />  
                                    {descriptionError && <div className='text-danger' style={{textAlign: 'center'}}>{descriptionError}</div>}
                                </div></div><br /><br />
                            </div>

                            <div className="row mt-4 justify-content-center">
                                <div className="col-md-6 d-flex justify-content-between">
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleCancel}
                                        style={{ marginRight: '400px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Publish
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobComponent;