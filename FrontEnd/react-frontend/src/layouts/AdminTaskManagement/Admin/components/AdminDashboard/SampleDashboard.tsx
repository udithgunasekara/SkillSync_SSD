
import React from 'react';
import { Line } from './charComponents/Line';
import { BarChart } from './charComponents/BarChart';
import { Pie } from './charComponents/Pie';

export const SampleDashboard = () => {

            return (
                <div className="below-navbar-admin ">
                    <Line/>
                    <BarChart/>
                    <Pie/>
                </div>                
            );
}