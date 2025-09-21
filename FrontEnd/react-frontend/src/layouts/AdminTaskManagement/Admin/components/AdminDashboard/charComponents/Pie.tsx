import {Pie as ChartPie} from 'react-chartjs-2';
import {Chart as Chartjs, Tooltip,Legend,ArcElement} from 'chart.js';
import { pieChartData } from './Fake_data';

Chartjs.register(Tooltip,Legend,ArcElement);

export const Pie = () => {
    const options = {}
    const data = pieChartData
    return (
        <div >
        <ChartPie options={options} data = {data}/>
        </div>
    );
}