import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import PublicNoticesModel from "../../../../Model/publicNoticesModel";
import { AdminSideBar } from "./AdminSideBar";
import { useEffect, useRef, useState } from "react";
import { SpinnerLoading } from "../../../../utils/SpinnerLoading";
import "./editNoticeForm.css";
import axios from "axios";
import React from "react";
import { AdminNavbar } from "./AdminNavbar";
import { storage } from "../../../../utils/Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export const EditNoticeForm = () => {
    const { noticeId } = useParams<{ noticeId: string }>();
    const [data, setData] = useState<PublicNoticesModel | null>(null);
    const [error, setError] = useState(null);
    const [isloading, setIsloading] = useState(true);
    const [audience, setAudience] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>('');
    const history = useHistory();
    let response;

    const [imageupload,setImageUpload] = useState<any>("");
    const [image,setImage] = useState("");
    const [uploadprogress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        id: noticeId,
        title: "",
        audience: "",
        description: "",
        moreDetailsLink: "",
        imagelink: ""
    });

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                response = await axios.get(`http://localhost:8082/notices/findnotice/${noticeId}`);
            } catch (error) {
                throw new Error("Error in fetching data");
            }

            const responsedata = response.data;
            console.log(responsedata);
            setAudience(responsedata.audience);
            setData(responsedata);
            setIsloading(false);
            setFormData({
                id: responsedata.id,
                title: responsedata.title,
                audience: responsedata.audience,
                description: responsedata.description,
                moreDetailsLink: responsedata.moreDetailsLink,
                imagelink: responsedata.imagelink

            })
        };

        fetchData().catch(
            (error) => {
                setError(error.message)
            }
        )
    }, []);

    const uploadImage = async (e:any) => {
        e.preventDefault();
        const imageRef = ref(storage, `notice/${imageupload.name + v4()}`);
        console.log(imageRef);
        const uploadTask = uploadBytesResumable(imageRef, imageupload);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error(error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    // Getting the URL of the uploaded image
                    console.log(url);
                    setImage(url);
                    setFormData(prevState => ({...prevState, imagelink: url}));
                });
            }
        );
    }

    if (isloading) {
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
            console.log(formData);
        }


    };

    const handlesubmt = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.title !== "" || formData.audience !== "" || formData.description !== "") {
            try {
                const response = await fetch(`http://localhost:8082/notices/updatenotice/${noticeId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    alert("Notice updated successfully");
                    setFormData({
                        id: "",
                        title: "",
                        audience: "",
                        description: "",
                        moreDetailsLink: "",
                        imagelink: ""
                    });

                    formRef.current?.reset();
                    history.push("/admin/editnotice");


                } else {
                    alert("Failed to update notice. Please try again");
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Please fill all the fields");
        }

    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedfile = e.target.files && e.target.files[0];
        if (selectedfile) {
            validateAndSetImage(selectedfile);
        }
    }

    const validateAndSetImage = (file: File) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const allowedSize = 8 * 1024 * 1024; // 1MB

        if (file && allowedTypes.includes(file.type) && file.size <= allowedSize) {
            setImageUpload(file);
            setErrorMessage('');
        } else {
            setErrorMessage('Please select a JPEG or PNG file less than 8MB.');
        }
    }




    return (
        <div className=" below-navbar-admin align-items-center" style={{ height: "100vh" }}>
            <AdminNavbar />

            <div className="d-flex flex-column align-items-center" style={{ width: "100%" }} id="formback">
                <Link to={"/admin/editnotice"} className="position-absolute top-0 start-0 m-3">
                    <button className="btn main-color text-white fw-bolder">Back to All Notices</button>
                </Link>

                <h1 className="text-center text-light fw-bold">Edit Notice</h1>

                <form style={{ width: "50%", fontWeight: "bold"}} ref={formRef} onSubmit={handlesubmt} className="ticketform mt-2">
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label text-light fw-bold">Title</label>
                        <input type="text" className={`form-control ${formData?.title ? '' : 'is-invalid'}`} id="title" name="title" value={formData?.title} required onChange={handleChange} />
                        <div className="invalid-feedback" >
                            Please provide a Title.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="audience" className="form-label text-light fw-bold">Audience</label>
                        <select className={`form-select ${formData?.audience ? '' : 'is-invalid'}`} name="audience" id="audience" aria-label="Related To" value={formData?.audience} required onChange={handleChange}>
                            <option selected disabled value="">select audience</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="client">Client</option>
                            <option value="all">All</option>
                        </select>
                        <div className="invalid-feedback">
                            select a audience
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label text-light fw-bold">Description(must start with alphanumaric character or whitespace)</label>
                        <textarea className={`form-control ${formData?.description ? '' : 'is-invalid'}`} id="description" value={formData?.description} name="description" rows={12} onChange={handleChange} required></textarea>
                        <div className="invalid-feedback">
                            Please provide description.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="moreDetailsLink" className="form-label text-light fw-bold">More Details Link</label>
                        <input type="text" className="form-control" value={formData?.moreDetailsLink} id="moreDetailsLink" name="moreDetailsLink" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                                <label htmlFor="noticeimage" className="form-label text-light fw-bold">Upload again if need to change image(only png, jpeg, jpg are supported)</label>
                                <input className="form-control" name="noticeimage" type="file" id="noticeimage"
                                    // onChange={(e) => {
                                    //     setImageUpload(e.target.files![0])
                                    // }}
                                    onChange={handleFileChange}

                                />
                                {errorMessage && <div className="text-danger">{errorMessage}</div>}
                                <div>
                                    {/* <button onClick={uploadImage} >Upload</button> */}
                                    <button className="btn btn-success  mt-2 me-2" onClick={uploadImage} disabled={!imageupload || Boolean(errorMessage)}>Upload</button>
                                    <progress value={uploadprogress} max={100} style={{
                                        width: '100%',
                                        height: '10px',
                                        borderRadius: '10px',
                                        border: '1px solid #ccc',
                                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                    }} />
                                </div>
                            </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>

        </div>
    );
}