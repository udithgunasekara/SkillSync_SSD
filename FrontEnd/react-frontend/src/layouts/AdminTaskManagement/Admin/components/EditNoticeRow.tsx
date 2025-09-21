import { useState } from "react";
import PublicNoticesModel from "../../../../Model/publicNoticesModel";
import axios from "axios";
import { EditNoticeForm } from "./EditNoticeForm";
import { Link } from "react-router-dom";

export const EditNoticeRow: React.FC<{ element: PublicNoticesModel, index: number; onDelete: (ticketId: number) => void }> = (props) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const dateconverter = (data: Date) => {
        const date = new Date(data);
        const cdate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return cdate;
    }

    const deleteTicket = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8082/notices/deletenotice?id=${props.element.id}`);
            props.onDelete(id);
            alert("Notice Deleted Successfully");

        } catch (error: any) {
            if (error.response) {
                alert(error.response.data);

                // You can handle the error response here, for example, display it to the user
            }
        }
    }



    return (

        <tr className="table-light">
            <th scope="row">{props.index + 1}</th>
            <th >{props.element.id}</th>
            <td>{props.element.title}</td>
            <td>{props.element.audience}</td>
            <td style={{ maxWidth: "80vw", textAlign: "left" }}>
                {props.element.description.length < 200 ? props.element.description :
                    <>
                        {expanded ? props.element.description : `${props.element.description.slice(0, 200)}...`}
                        {!expanded && <a onClick={toggleExpanded} className="seemorelink main-color-text">See more</a>}
                        {expanded && <a onClick={toggleExpanded} className="seemorelink main-color-text"><br />See less</a>}
                    </>
                }
            </td>

            <td>{dateconverter(props.element.datecreated)}</td>
            <td>{
                props.element.imagelink ? <a href={props.element.imagelink}>Link</a> : "No Link Available"
            }</td>
            <td>{
                props.element.moreDetailsLink ? <a href={props.element.moreDetailsLink}>Link</a> : "No Link Available"
            }</td>
            <td>
                <Link to={`/admin/editnotice/${props.element.id}`}><button className="btn btn-primary mb-3">Edit</button></Link>
                <button className="btn btn-danger" onClick={() => deleteTicket(props.element.id)}>Delete</button>
            </td>

        </tr>

    );
}