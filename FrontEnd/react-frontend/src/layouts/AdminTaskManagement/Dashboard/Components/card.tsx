import React, { useEffect, useState } from 'react';
import PublicNoticesModel from '../../../../Model/publicNoticesModel';


export const Cardcontent: React.FC<{ notice: PublicNoticesModel, key: number }> = (props) => {

    const posted = new Date(props.notice.datecreated).getTime();
    const lastupdated = new Date(props.notice.lastupdated).getTime();;
    const currentdate = new Date().getTime();
    let datedisplay: any;

    const [createdDate, setCreatedDate] = useState(0);

    const [diffinSerconds, setDiffinSeconds] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const createdDateDiff = currentdate - posted;

            const diffinDays = Math.floor(createdDateDiff / (1000 * 60 * 60 * 24));
            const diffinHours = Math.floor((createdDateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffinMinutes = Math.floor((createdDateDiff % (1000 * 60 * 60)) / (1000 * 60));
            setDiffinSeconds(Math.floor((createdDateDiff % (1000 * 60)) / 1000));

            if (diffinDays >= 1) {
                datedisplay = ` ${diffinDays} days ago`;
            } else if (diffinHours >= 1) {
                datedisplay = `${diffinHours}  hours and ${diffinMinutes}  minutes ago`;
            } else {
                datedisplay = ` ${diffinMinutes} minutes ago`;
            }
            setCreatedDate(datedisplay);
        }

        fetchData();
    });

    return (


        <div className='container d-flex justify-content-center mb-5'>
            <div className="card mt-3" style={{ width: "80%",borderRadius:"20px", borderColor:"rgba(70, 11, 120, 0.7)", borderWidth:"4px", boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)"}}>
                <div className="card-body">
                    <div className="text-left"> {/* Wrapper for text and button */}
                        <h4 className="card-title">{props.notice.title}</h4>
                        <h6>{lastupdated !== posted ? `Edited` : ``}</h6>
                        <h6>Posted:{createdDate}</h6>
                        <p className="card-text">
                            {props.notice.description}
                        </p>
                        {props.notice.moreDetailsLink !== "" && props.notice.moreDetailsLink !== null ?
                            <p>
                                for more details visit: <a href={props.notice.moreDetailsLink}>{props.notice.moreDetailsLink}</a>
                            </p> : ""
                        }
                    </div>
                    <h6></h6>
                </div>
                <div className="d-flex justify-content-center " >
                    {props.notice.imagelink !== "" && props.notice.imagelink !== null ?
                        <img className="card-img-bottom "  
                            src={props.notice.imagelink}
                            alt="Card image"
                            style={{ width: "80%", height: "90%" ,borderRadius:"20px"}} /> : ""}
                </div>
            </div>

        </div>



    );

}