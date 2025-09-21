import { Line } from './charComponents/Line';
import { BarChart } from './charComponents/BarChart';
import axios from "axios";
import { useState, useEffect } from "react";
import "./dashboardpage.css"
import { totalmem } from 'os';
import { FreelancersJoinedLineChart } from './charComponents/chartdata/FreelancersJoinedLineChart';
import { ClientsJoinedLineChart } from './charComponents/chartdata/ClientsJoinedLIneChart';
import GigReportButton from '../../../../FreelancerWorkManagement/FreelancerHome/Components/GigReportBtn';

export const AdminDashboard = () => {

    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState(null);
    const [gigData, setGigData] = useState([]); // This is the gig data that will be used to generate the report
    let response
    let runningTotal = 0

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseGigs = await axios.get("http://localhost:8082/freelancer-gigs"); // Fetch gig data
                setGigData(responseGigs.data);

                const response = await axios.get("http://localhost:8082/payment");
                const responseData = response.data;

                const currentDate = new Date();
                const currentWeekStart = new Date(currentDate);
                currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the current week

                let runningTotal = 0;
                for (const element in responseData) {
                    const paymentDate = new Date(responseData[element].date);

                    // Check if paymentDate is within the current week
                    if (paymentDate >= currentWeekStart && paymentDate <= currentDate) {
                        runningTotal += responseData[element].amount;
                    }
                }

                setTotalAmount(runningTotal);
            } catch (error) {
                throw new Error("Error in retrieving total amount");
            }
        };

        fetchData().catch(error => {
            setError(error.message);
        });
    }, []);




    return (
        <div className="below-navbar-admin " id='dashboardpage' style={{ width: "100vw" }}>
            <div className='background-image'>
                <div className="row justify-content-md-center pt-5 mx-auto" style={{ width: "75%", padding: "0dp" }}>
                    <div className="col align-items-center d-flex justify-content-center " style={{ textAlign: "center" }}>
                        <div className="card text-dark bg-light mb-3 mx-auto " style={{ minWidth: "20rem", maxWidth: "fit-content" }}>
                            <div className="card-body">
                                <h1 className="card-title" style={{ fontSize: "50px", fontWeight: "bolder" }}>${totalAmount}</h1>
                            </div>
                            <div className="card-header">Transfered through this week</div>
                        </div>
                    </div>

                    <div className="col align-items-center d-flex justify-content-center " style={{ textAlign: "center" }}>
                        <div className="card text-dark bg-light mb-3 mx-auto" style={{ minWidth: "20rem", maxWidth: "fit-content" }}>
                            <div className="card-body">
                                <h1 className="card-title" style={{ fontSize: "50px", fontWeight: "bolder" }}>${totalAmount * 5 / 100}</h1>
                            </div>
                            <div className="card-header">Total income this week</div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-around pt-5" style={{ width: "100vw" }}>
                    <div className="row align-items-center d-flex justify-content-center p-0" style={{ textAlign: "center" }}>
                        <div className="card text-dark bg-light mb-3 mx-auto" style={{ width: "60%", height: "fit-content", background: "red" }}>
                            <div style={{ position: "absolute", top: "0", right: "0", padding: "5px" }}>
                                <button className='btn btn-primary'>d</button>
                            </div>
                            <div className="card-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <FreelancersJoinedLineChart />
                            </div>

                        </div>
                    </div>

                    <div className="row align-items-center d-flex justify-content-center p-0" style={{ textAlign: "center" }}>
                        <div className="card text-dark bg-light mb-3 mx-auto" style={{ width: "60%" }}>
                            <div style={{ position: "absolute", top: "0", right: "0", padding: "5px" }}>
                                <button className='btn btn-primary'>d</button>
                            </div>
                            <div className="card-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <ClientsJoinedLineChart />
                            </div>
                        </div>
                    </div>

                    {/* <div className="row align-items-center d-flex justify-content-center" style={{ textAlign: "center" }}>
                        <div className="card text-dark bg-light mb-3 mx-auto" style={{ width: "60%" }}>
                            <div style={{ position: "absolute", top: "0", right: "0", padding: "5px" }}>
                                <button className='btn btn-primary'>d</button>
                            </div>
                            <div className="card-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <BarChart />
                            </div>
                        </div>
                    </div> */}
                    { /*Report of freelancer gigs*/}
                    <div className="text-center mt-4">
                        <GigReportButton gigData={gigData} />
                    </div>
                </div>

            </div>
        </div>
    );
}