import { useEffect, useId, useState } from "react";
import TicketModel from "../../../../Model/TicketModel";
import axios from "axios";
import './Ticketcardstyle.css';
import { Link } from "react-router-dom";

export const TicketCard: React.FC<{ ticket: TicketModel, key: number; onDelete: (ticketId: number) => void }> = (props) => {

    const userid = sessionStorage.getItem('id') 
    // const userid = 3; //change this to change user
    const [expanded, setExpanded] = useState(false);

    
    const date = new Date(props.ticket.createdTime).getDate();
    const month = new Date(props.ticket.createdTime).getMonth() + 1;
    const year = new Date(props.ticket.createdTime).getFullYear();


    const createddate = `${date} / ${month} / ${year}`;
    console.log("ticket description of " + props.ticket.id);

    console.log(props.ticket.description);



    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const deleteTicket = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8082/ticket/deleteticket?id=${props.ticket.id}&userid=${userid}`);
            props.onDelete(id);
            alert("Ticket Deleted Successfully");

        } catch (error: any) {
            if (error.response) {
                alert(error.response.data);

                // You can handle the error response here, for example, display it to the user
            }
        }
    }


    return (

        <div className="conteiner d-flex justify-content-center" >
            <div className="ticket-background">
                <div className="inside-rectangle">
                    <div className="col">
                        <div className="row">
                            <div className="col" style={{ width: "50%" }}>
                                <div className="ticket-info" >
                                    <h5><span className="fw-bold purple-font">Ticket id:</span> {props.ticket.id}</h5>
                                    <hr />

                                    <h5>
                                        <span className="fw-bold purple-font">Raised date:</span> {createddate}
                                    </h5>
                                    <hr />
                                    <h5>
                                        <span className="fw-bold purple-font">Ticket Title:</span>
                                        <p className="card-text" style={{ margin: "0", wordWrap: "break-word" }}>{props.ticket.subject}</p>
                                    </h5>
                                    <hr />


                                    <div className="status">
                                        <h5>
                                            <span className="fw-bold purple-font">Status:  </span>

                                            {props.ticket.status.toLowerCase() === "pending" ?
                                                (
                                                    <span className="ticketStatuspending">
                                                        {props.ticket.status.toUpperCase()}
                                                    </span>
                                                ) : (
                                                    < span className="ticketStatuscomplete">
                                                        {props.ticket.status.toUpperCase()}
                                                    </span>
                                                )
                                            }
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col border-start" style={{ width: "50%" }} >

                                <div className="ticket-actions">

                                    <p className="card-text">
                                        <span className="fw-bolder purple-font">Description : </span>
                                        <br />

                                        {expanded ? props.ticket.description : `${props.ticket.description?.slice(0, 200)}...`}
                                        {!expanded && <a onClick={toggleExpanded} className="seemorelink main-color-text">See more</a>}
                                        {expanded && <a onClick={toggleExpanded} className="seemorelink main-color-text"><br />See less</a>}
                                    </p>

                                </div>

                            </div>

                        </div>
                        <div className="row mt-3">
                            <div className="col  d-flex justify-content-center">
                                <Link to={`/tickets/${props.ticket.id}`}><button className="btn btn-primary me-2">More Details?</button></Link>
                                <button className="btn btn-danger" onClick={() => deleteTicket(props.ticket.id)}>Delete Ticket</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}