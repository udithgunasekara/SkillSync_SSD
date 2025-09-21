import axios from "axios";
import { useState, useRef } from "react";
import TicketResponseModel from "../../../../Model/TicketResponseModel";

export const UserSpecificTicketResponse: React.FC<{ element: TicketResponseModel, index: number; onDelete: (ticketId: number) => void }> = (props) => {

    console.log("rerendered");
    const [formData, setFormData] = useState({
        response: "",
        ticket: {
            id: ""
        },
        subject: ""
    });
    const formRef = useRef<HTMLFormElement>(null);



    const idprefix = `res${props.index}`;

    const editresponse = () => {
        console.log("edit response");
        const responsedis = document.getElementById(`${idprefix}-responsedis`) as HTMLTextAreaElement;
        const cancelbtn = document.getElementById(`${idprefix}-cncelbtn`) as HTMLButtonElement;
        const submitbtn = document.getElementById(`${idprefix}-sbmitbtn`) as HTMLButtonElement;
        if (responsedis.disabled) {
            responsedis.disabled = false;
            cancelbtn.style.visibility = "visible";
            submitbtn.style.visibility = "visible";
        }

    }

    const hideeditresponse = () => {

        const responsedis = document.getElementById(`${idprefix}-responsedis`) as HTMLTextAreaElement;
        const cancelbtn = document.getElementById(`${idprefix}-cncelbtn`) as HTMLButtonElement;
        const submitbtn = document.getElementById(`${idprefix}-sbmitbtn`) as HTMLButtonElement;
        props.onDelete(props.element.id);

        if (!responsedis.disabled) {
            responsedis.disabled = true;
            cancelbtn.style.visibility = "hidden";
            submitbtn.style.visibility = "hidden";
        }
    }


    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prevState => ({ ...prevState, [name]: value }));
        console.log(formData);
    };

    const handlesubmt = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8082/ticketresponse/updateresponse?id=${props.element.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert("response updated successfully");
                props.onDelete(props.element.id);
                setFormData({
                    response: "",
                    ticket: {
                        id: ""
                    },
                    subject: ""
                    // imageLink: "",
                });
                hideeditresponse();
                formRef.current?.reset();


            } else {
                alert("Failed to update response. Please try again");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const deleteResponse = async () => {
        try {
            await axios.delete(`http://localhost:8082/ticketresponse/deleteresponse?id=${props.element.id}`);
            props.onDelete(props.element.id);
            alert("Response Deleted Successfully");

        } catch (error: any) {
            if (error.response) {
                alert("there is a error in deleting the response");
                console.log(error.response.data);

                // You can handle the error response here, for example, display it to the user
            }
        }
    }

    return (
        <div className="card  mx-auto mt-5" style={{ width: "80%", borderRadius: "20px", border: "2px solid black" }}>
            <div className="card-body">
                {/* Add your details here */}

                <div className="row">
                    <div className="col">
                        <h5>Admin Response</h5>
                        <h6>Respose ID: {props.element.id}</h6>
                        <h6>Responded Time: {props.element.responseTime.toString()}</h6>
                    </div>

                </div>
                <hr />
                <div className="row" style={{ width: "100%" }}>
                    <div className="col">
                        {props.element.response}
                    </div>

                </div>
                {/* <p className="card-text">{props.element.response}</p> */}
            </div>
        </div>
    );

}