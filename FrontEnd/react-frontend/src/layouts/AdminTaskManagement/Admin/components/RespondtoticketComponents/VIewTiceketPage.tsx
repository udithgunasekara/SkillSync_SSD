import axios from "axios";
import { useState, useEffect } from "react";
import TicketModel from "../../../../../Model/TicketModel";
import { SpinnerLoading } from "../../../../../utils/SpinnerLoading";
import "./viewticketpage.css";
import { stat } from "fs";
import { Link } from "react-router-dom";

export const VIewTiceketPage = () => {

    const [ticket, setTicket] = useState<TicketModel[]>([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [nstatus, setStatus] = useState<boolean>(true);

    let respose

    useEffect(() => {
        const fetchData = async () => {
            try {
                respose = await axios.get("http://localhost:8082/ticket/getticket");

            } catch (error) {
                throw new Error("Error in fetching data in RaisedTicket.jsx");
            }

            const responsedata = respose.data;
            console.log(responsedata);

            const loadedtickets: TicketModel[] = [];
            for (const element in responsedata) {
                loadedtickets.push(
                    new TicketModel(
                        responsedata[element].id,
                        responsedata[element].email,
                        responsedata[element].relatedTo,
                        {
                            userId: responsedata[element].user.userId,
                            userName: responsedata[element].user.userName,
                            roel: responsedata[element].user.role
                        },
                        responsedata[element].createdTime,
                        responsedata[element].updatedTime,
                        responsedata[element].status,
                        responsedata[element].description,
                        responsedata[element].subject
                    )
                );

            };



            setTicket(loadedtickets);
            // console.log(ticket.length);
            setIsLoaded(false);
        }

        fetchData().catch(
            (error) => {
                setIsLoaded(false);
                setError(error.message);
            }
        )

        window.scrollTo(0, 0);

    }, [nstatus]);

    if (isLoaded) {
        return (
            <SpinnerLoading />
        );
    }
    if (error) {
        return (
            <div className="container m-5">
                <p>{error}</p>
            </div>
        );
    }

    const changestatus = async (status: string, id: number) => {

        console.log(status, id);

        try {

            await axios.put(`http://localhost:8082/ticket/changeticketstatus?ticketId=${id}&status=${status}`);
            setStatus(!nstatus);
        } catch (error: any) {
            if (error.response) {
                alert(error.response.data);
            }
        }

    }


    return (
        <div className="d-flex flex-column align-items-center below-navbar-admin" >
            <div className="background-image">
            <table className="table table-bordered border-primary  m-5" style={{ width: "95%", textAlign: "center" }}>
                <thead className="table-dark border-primary">
                    <tr >
                        <th scope="col">No</th>
                        <th scope="col">TicketId</th>
                        <th scope="col">UserId</th>
                        <th scope="col">UserName</th>
                        <th scope="col">Email</th>
                        <th scope="col">related to</th>
                        <th scope="col">subject</th>
                        <th scope="col">description</th>
                        <th scope="col">raised Date</th>
                        <th scope="col">status</th>
                        <th scope="col">action</th>
                    </tr>
                </thead>
                <tbody>
                    {ticket.slice().reverse().map((element, index) => (
                        <tr key={index} className="table-light">
                            <th scope="row">{index + 1}</th>
                            <td >{element.id}</td>
                            <td >{element.userId}</td>
                            <td >{element.username}</td>
                            <td><a href={`mailto:${element.email}`}>{element.email == null || element.email.trim() == ""?"":"Email"}</a></td>
                            <td style={{ maxWidth: "250px" }}><p style={{ margin: "0", wordWrap: "break-word" }}>{element.relatedTo}</p></td>
                            <td style={{ maxWidth: "250px", margin: "0", wordWrap: "break-word" }} >{element.subject}</td>
                            <td >{element.description}</td>
                            <td >{element.createdTime.toString()}</td>
                            <td className={element.status.toLowerCase() === "pending" ? "table-warning" : "table-success"}>{element.status}</td>
                            <td>
                                <Link to={`/admin/ticketrespond/${element.id}`}><button className="btn btn-primary mb-3">respond</button></Link>
                                {element.status.toLowerCase() === "pending" ?
                                    <button className="btn btn-danger" onClick={() => changestatus("complete", element.id)}>complete</button> :
                                    <button className="btn btn-danger" onClick={() => changestatus("pending", element.id)}>to pending</button>}
                            </td>

                        </tr>

                    ))}

                </tbody>
            </table>
            </div>
        </div>
    );
}