import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import {
    Chart as Chartjs, 
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { barChartData, lineChartData } from './Fake_data';

Chartjs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export const BarChart = () => {

    const options = {
        responsive : true,
        plugins:{legend:{
            display:false,
            position: "bottom" as const,
        },
        title:{
            display: true,
            text: 'Bar Chart',
            color: 'red',
            font: {
                size: 26,
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // black background with 80% opacity
            borderColor: 'red', // red border
            borderWidth: 2, // border width of 2 pixels
            titleFont: { size: 16}, // title font settings
            bodyFont: { size: 14, family: 'Arial' }, // body font settings
            cornerRadius: 5, // round corners
        },
        },
    }
    const data = barChartData

    return (
        <div >
        <Bar options={options} data={data}/>
        </div>
    )
}