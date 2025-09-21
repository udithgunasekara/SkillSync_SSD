import { useRef, useState } from "react";
import TicketResponseModel from "../../../../../Model/TicketResponseModel";
import axios from "axios";

export const SpecificTicketResponse: React.FC<{ element: TicketResponseModel, index: number; onDelete: (ticketId: number) => void }> = (props) => {

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
                    <div className="col-9">
                        <h5>Admin Response</h5>
                        <h6>Respose ID: {props.element.id}</h6>
                        <h6>Responded Time: {props.element.responseTime.toString()}</h6>
                    </div>
                    <div className="col-3">
                        <div className="d-flex justify-content-center">
                            {/* Edit response button */}
                            <button className="btn btn-primary m-3 p-3" onClick={editresponse} style={{ borderRadius: "35px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </button>
                            {/* Delete response button */}
                            <button className="btn btn-danger p-3 m-3" onClick={deleteResponse} style={{ borderRadius: "35px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row" style={{ width: "100%" }}>
                    <form onSubmit={handlesubmt}>
                        <textarea name={`response`} id={`${idprefix}-responsedis`} rows={2} style={{ width: "100%" }} disabled onChange={handleChange}>
                            {props.element.response}
                        </textarea>
                        <button className="btn btn-primary m-2" id={`${idprefix}-sbmitbtn`} type="submit" style={{ visibility: "hidden" }}>submit</button>
                        <button className="btn btn-primary m-2" id={`${idprefix}-cncelbtn`} type="reset" style={{ visibility: "hidden" }} onClick={hideeditresponse}>Cancel</button>
                    </form>
                </div>
                {/* <p className="card-text">{props.element.response}</p> */}
            </div>
        </div>
    );

}