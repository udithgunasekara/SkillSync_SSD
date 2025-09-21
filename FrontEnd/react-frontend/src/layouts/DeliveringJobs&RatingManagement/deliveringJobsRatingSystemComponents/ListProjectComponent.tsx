import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { listProjects } from '../deliveringJobsRatingSystemServices/RatingService';
import { useHistory } from 'react-router-dom';

interface Project {
    id: number;
    review: string;
    userId: string;
    freelancerId: string;
}

const ListProjectComponent: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const navigator = useHistory();

    const getAllProjects = async () => {
        try {
            const response = await listProjects();
            setProjects((response.data as unknown) as Project[]); // Cast the data to Rating[]
          } catch (error) {
            console.error('Error fetching all ratings:', error);
          }
    };

    useEffect(() => {
        getAllProjects();
    }, []);


    const resetProjects = async () => {
        try {
            const response = await listProjects(); // Fetch all ratings
            setProjects((response.data as unknown) as Project[]);// Set all ratings to the state
        } catch (error) {
            console.error('Error fetching all ratings:', error);
        }
    };


    return (
        <div className='container'>
            <br />
            <br />
            <h2 className='text-center'>List of Projects</h2>
            <table className='table table-scriped table-bordered'>
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Review</th>
                        <th>Client ID</th>
                        <th>Freelancer ID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        projects.map(project =>
                            <tr key={project.id}>
                                <td>{project.id}</td>
                                <td>{project.review}</td>
                                <td>{project.userId}</td>
                                <td>{project.freelancerId}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            
            
        </div>
    );
};

export default ListProjectComponent;
