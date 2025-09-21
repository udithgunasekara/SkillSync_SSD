import { useRef, useState } from "react";
import "./RaiseTicketFormstyle.css";
import { useHistory } from "react-router-dom";
export const RaiseTicketForm = () => {

    const userid = sessionStorage.getItem('id')
    // const userid = "1"; //change this to change user

    const history = useHistory();

    const [formData, setFormData] = useState({
        email: "",
        user: {
            userId: userid
        },
        relatedTo: "",
        status: "pending",
        subject: "",
        description: "",
        imageLink: ""
    });
    const formRef = useRef<HTMLFormElement>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let sanitizedInput: string = "";
        if (/[^a-zA-Z0-9\s]/.test(e.target.value)) {
            sanitizedInput = e.target.value.replace(/[^\w\s]/g, '');
        } else {
            sanitizedInput = "ok";
        }
        if (sanitizedInput !== "") {
            setFormData(prevState => ({ ...prevState, [name]: value }));
            console.log(e.target.value);
        }


    };

    const handlesubmt = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.email !== "" || formData.relatedTo !== "" || formData.subject !== "" || formData.description !== "") {
            if (userid === null) {
                alert("You are not logged in. Please login to raise a ticket");
            } else {
                try {
                    const response = await fetch("http://localhost:8082/ticket/addticket", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    });
                    if (response.ok) {
                        alert("Ticket Raised successfully");
                        setFormData({
                            email: "",
                            user: {
                                userId: userid
                            },
                            relatedTo: "",
                            status: "pending",
                            subject: "",
                            description: "",
                            imageLink: ""
                        });
                        history.push("/tickets");
                        formRef.current?.reset();

                    } else {
                        alert("Failed to Raise Ticket. Please try again");
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            alert("Please fill all the fields");
        }

    }

    const handleReset = () => {
        setFormData(prevState => ({
            ...prevState,
            description: '',
            subject: ''
        }));
    };



    return (
        <div className="raiseticketform">
            <div className="container">
                <h1 className="d-flex justify-content-center text-dark pt-5">Raise New Ticket</h1>
                <form className="ticketform" onSubmit={handlesubmt}>
                    <div className="form-floating mb-3">
                        <input type="email" className={`form-control ${formData?.email ? '' : 'is-invalid'}`} name="email" id="form-control" required placeholder="name@example.com" onChange={handleChange} />
                        <label htmlFor="form-control">Email address</label>
                        <p className="text-light fw-bold">Make sure you enter a valid email that we can contact you if needed</p>
                    </div>

                    <div className="form-floating mb-3">
                        <select className={`form-select ${formData?.relatedTo ? '' : 'is-invalid'}`} id="relatedTo" name="relatedTo" value={formData?.relatedTo} aria-label="Related To" required aria-placeholder="select option" onChange={handleChange}>
                            <option selected disabled value="">select what you have concerns with</option>
                            <option value="Freelancer related">Freelancer related</option>
                            <option value="client related">client related</option>
                            <option value="payment related">payment related</option>
                            <option value="other">other</option>
                        </select>
                        <label htmlFor="relatedTo" className="form-label">Related To</label>
                    </div>

                    <div className="form-floating mb-3 ">
                        <input type="text" className={`form-control ${formData?.subject ? '' : 'is-invalid'}`} name="subject" id="subject" placeholder="Enter subject" value={formData?.subject} required onChange={handleChange} />
                        <label htmlFor="subject">Subject</label>
                    </div>

                    <div className="form-floating mb-3">
                        <textarea className={`form-control ${formData?.description ? '' : 'is-invalid'}`} name="description" id="description" rows={3} value={formData?.description} placeholder="Enter description" required style={{ height: "100px" }} onChange={handleChange}></textarea>
                        <label htmlFor="description" className="form-label">Description</label>
                    </div>

                    {/* <div className="mb-3">
                        <label htmlFor="formFileMultiple" className="form-label text-light fw-bold">Upload any related images</label>
                        <input className="form-control" name="imageLink" type="file" id="formFileMultiple" multiple />
                    </div> */}

                    <button type="submit" className="btn btn-primary me-5">Submit</button>
                    <button type="reset" className="btn btn-danger" onClick={handleReset} >Reset</button>
                </form>
            </div>
        </div>
    );
}