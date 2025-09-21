import { hover } from "@testing-library/user-event/dist/hover";

export const lineChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
        {
            label: 'Steps by dilshan',
            data: [3000,5000,4500,6000,7000,8000,9000],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 1)',
        },
        {
            label: 'Steps by his imaginary girlfriend',
            data: [1000,2000,3000,4000,5000,6000,7000],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 1)',
        }
        
    ],
};


export const barChartData = {
    labels: ["Rent","Grocery","Utilities","Entertainment","Transportation"], //this is the x-axis
    datasets:[
        {
            label: "Monthly expenses",
            data: [1000, 500, 300, 200, 100],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],borderColor: "black",
            borderWidth: 1

        }
    ]
}

export const pieChartData = {
    labels: ["Facebook","Instagram","Twitter","Youtube","Linkedin"],
    datasets:[
        {
            label: "Time spent on social media",
            data: [120,60,30,90,60],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderColor: "black",
            borderWidth: 1,
            hoverOffset: 4,
        }
    ]
}