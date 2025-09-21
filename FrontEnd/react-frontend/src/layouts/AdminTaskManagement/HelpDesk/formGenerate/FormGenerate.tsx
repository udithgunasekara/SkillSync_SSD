import { PDFDownloadLink } from '@react-pdf/renderer';
import {Report} from './Report'; // Import the 'Report' component using the correct path
import { Button } from 'react-bootstrap';

export const FormGenerate =()=>{
    return(
        <div></div>
        // <div>
        //     <PDFDownloadLink document={<Report/>} fileName="report.pdf">
        //         {({loading}) => (loading ? <button>loading document</button> : <button>Download now</button>)}
        //     </PDFDownloadLink>
        // </div>
    );
}