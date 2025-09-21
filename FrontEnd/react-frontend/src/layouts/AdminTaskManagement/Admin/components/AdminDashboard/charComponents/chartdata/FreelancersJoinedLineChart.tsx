import { Line as ChartLine } from 'react-chartjs-2';
import {
    Chart as Chartjs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { title } from 'process';
import axios from 'axios';
import { useEffect, useState } from 'react';

Chartjs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



export const FreelancersJoinedLineChart = () => {
    const [error,setError] = useState(null);
    const [lineChartData, setLineChartData] = useState<{ labels: number[]; datasets: any[] } | null>(null);


    const userCountByDateThisMonth: { [key: number]: number } = {};
    const userCountByDateLastMonth: { [key: number]: number } = {};

    // Initialize userCountByDateThisMonth and userCountByDateLastMonth with keys representing each date of the month
    for (let i = 1; i <= 31; i++) {
        userCountByDateLastMonth[i] = 0;
        userCountByDateThisMonth[i] = 0;
    }

    //to count this month users by date
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8082/Freelancer/Allaccepted");
                const responseData = response.data;

                const currentDate = new Date();
                const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Set to the first day of the current month
                const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Set to the last day of the current month

                for (let i = 1; i <= 31; i++) {
                    userCountByDateThisMonth[i] = 0;
                }

                for (const element in responseData) {
                    const joinDate = new Date(responseData[element].created_at);

                    // Check if joinDate is within the current month
                    if (joinDate >= currentMonthStart && joinDate <= currentMonthEnd) {
                        const dateOfMonth = joinDate.getDate();
                        userCountByDateThisMonth[dateOfMonth]++;
                    }
                }

                // console.log("User count by date within this month:", userCountByDateThisMonth);

                // Update lineChartData after fetching data
                setLineChartData({
                    labels: Array.from({ length: 31 }, (_, i) => i + 1),
                    datasets: [
                        {
                            label: 'This Month',
                            data: Object.values(userCountByDateThisMonth),
                            fill: false,
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                        },
                        {
                            label: 'Last Month',
                            data: Object.values(userCountByDateLastMonth),
                            fill: false,
                            backgroundColor: 'red',
                            borderColor: 'red',
                        }
                    ],
                });
            } catch (error) {
                throw new Error("Error in retrieving user count by date for this month");
            }
        };

        fetchData().catch(error => {
            setError(error.message);
        });
    }, []);

    //to count last month users by date
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8082/Freelancer/Allaccepted");
                const responseData = response.data;

                const currentDate = new Date();
                const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1); // Set to the first day of the last month
                const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Set to the last day of the last month

                for (let i = 1; i <= 31; i++) {
                    userCountByDateLastMonth[i] = 0;
                }

                for (const element in responseData) {
                    const joinDate = new Date(responseData[element].created_at);

                    // Check if joinDate is within the last month
                    if (joinDate >= lastMonthStart && joinDate <= lastMonthEnd) {
                        const dateOfMonth = joinDate.getDate();
                        userCountByDateLastMonth[dateOfMonth]++;
                    }
                }
                // Update lineChartData after fetching data
                setLineChartData({
                    labels: Array.from({ length: 31 }, (_, i) => i + 1),
                    datasets: [
                        {
                            label: 'This Month',
                            data: Object.values(userCountByDateThisMonth),
                            fill: false,
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                        },
                        {
                            label: 'Last Month',
                            data: Object.values(userCountByDateLastMonth),
                            fill: false,
                            backgroundColor: 'red',
                            borderColor: 'red',
                        }
                    ],
                });

                // console.log("User count by date within last month:", userCountByDateLastMonth);
            } catch (error) {
                throw new Error("Error in retrieving user count by date for last month");
            }
        };

        fetchData().catch(error => {
            setError(error.message);
        });
    }, []);

    const options = {
        responsive: true,
        backgroundColor: 'red',
        plugins: {
            legend: {
                position: "bottom" as const,
            },
            title: {
                display: true,
                text: 'Freelancers joined within weeks',
                color: 'Black',
                font: {
                    size: 26,
                }
            }
        },
    };

    if (!lineChartData) {
        // Render loading or placeholder content
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ChartLine options={options} data={lineChartData} />
        </div>
    );
}