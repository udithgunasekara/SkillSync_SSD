import axios from 'axios';
import { useEffect, useState } from "react";
import TicketModel from '../../../../Model/TicketModel';
import { SpinnerLoading } from '../../../../utils/SpinnerLoading';
import { TicketCard } from './TicketCard';

export const RaisedTicket = () => {

    const userid = sessionStorage.getItem('id') 
    // const userid = 2;

    const [ticket, setTicket] = useState<TicketModel[]>([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    let rdsdsf: object;

    let respose

    useEffect(() => {
        const fetchData = async () => {
            console.log(userid);
            if (userid === null) {
                throw new Error("You don't have any raised tickets");
            }else{
                try {
                    respose = await axios.get(`http://localhost:8082/ticket/alltickets/${userid}`);
    
                } catch (error) {
                    throw new Error("Error in fetching data in RaisedTicket.jsx");
                }
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
                            userName: responsedata[element].user.username,
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
            console.log(loadedtickets);
            setIsLoaded(false);
        }

        fetchData().catch(
            (error) => {
                setIsLoaded(false);
                setError(error.message);
            }
        )

        // console.log(ticket.length);
        window.scrollTo(0, 0);

    }, []);

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




    return (
        <div className="container">
            <div className="container-fluid py-0 text-black d-flex justify-content-between align-items-center">
                <h1 className="display-5 fw-bold ms-4">Your Tickets</h1>

            </div>

            {ticket.slice().reverse().map((element) => (
                <TicketCard key={element.id} ticket={element} onDelete={(ticketId) => {
                    setTicket(ticket.filter((ticket) => ticket.id !== ticketId));
                }} />
            ))}



        </div>
    );
}