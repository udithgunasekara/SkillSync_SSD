import axios from "axios";
import { useState, useEffect } from "react";
import "./RespondtoticketComponents/viewticketpage.css"
import PublicNoticesModel from "../../../../Model/publicNoticesModel";
import { SpinnerLoading } from "../../../../utils/SpinnerLoading";
import { EditNoticeRow } from "./EditNoticeRow";

export const EditNotice = () => {
    const [data, setData] = useState<PublicNoticesModel[]>([]);
    const [error, setError] = useState(null);
    const [isloading, setIsloading] = useState(true);

    const [createddate, setCreatedDate] = useState<Date>();
    let response;


    useEffect(() => {
        const fetchData = async () => {
            try {
                response = await axios.get('http://localhost:8082/notices/allnotices');
            } catch (error) {
                throw new Error("Error in fetching data");
            }

            const responsedata = response.data;
            console.log(responsedata);

            const loadedNotices: PublicNoticesModel[] = [];
            for (const element in responsedata) {
                loadedNotices.push({
                    id: responsedata[element].id,
                    title: responsedata[element].title,
                    audience: responsedata[element].audience,
                    description: responsedata[element].description,
                    datecreated: responsedata[element].datecreated,
                    moreDetailsLink: responsedata[element].moreDetailsLink,
                    lastupdated: responsedata[element].lastupdated,
                    imagelink: responsedata[element].imagelink
                });
            }

            setData(loadedNotices);
            console.log("data length : " + loadedNotices.length);
            setIsloading(false);
        };

        fetchData().catch(
            (error) => {
                setError(error.message)
            }
        )
    }, []);

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




    console.log(data);
    return (
        <div className="below-navbar-admin d-flex flex-column align-items-center">
            <div className="background-image" style={{textAlign:"center"}}>
                <h1 className="mt-3 ">All Notices</h1>
                <table className="table table-bordered border-primary  m-5" style={{ width: "95%", textAlign: "center", marginBottom: "50px" }}>
                    <thead className="table-dark border-primary">
                        <tr >
                            <th scope="col">No</th>
                            <th scope="col">NoticeId</th>
                            <th scope="col">Title</th>
                            <th scope="col">Audience</th>
                            <th scope="col">Description</th>
                            <th scope="col">Created Date</th>
                            <th scope="col">Image link</th>
                            <th scope="col">More Details</th>
                            <th scope="col">action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.slice().reverse().map((element, index) => (

                            <EditNoticeRow element={element} key={index} index={index}
                                onDelete={(noticeid) => {
                                    setData(data.filter((data) => data.id !== noticeid));
                                }} />

                        ))}

                    </tbody>
                </table>
            </div>

        </div>
    );
}