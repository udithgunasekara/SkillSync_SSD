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
import { lineChartData } from './Fake_data';
import { title } from 'process';

Chartjs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Line = () => {

    const options = {
        responsive : true,
        backgroundColor: 'red',
        plugins:{
            legend:{
                position: "bottom" as const,
            },
            title:{
                display: true,
                text: 'Freelancers joined within weeks',
                color: 'red',
                font: {
                    size: 26,
                }
            }
        
        },
        
        
        
    };
    const data = lineChartData;

    return (
        <div >
            
            <ChartLine options={options} data={data} />
        </div>
        
    );
}