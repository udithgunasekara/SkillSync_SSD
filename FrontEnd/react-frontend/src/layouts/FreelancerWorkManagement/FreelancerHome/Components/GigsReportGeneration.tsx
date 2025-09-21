import { Gig } from "./FreelanceServices";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with the autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

// Initialize the autoTable plugin
const doc = new jsPDF({
    orientation: 'portrait', // 'portrait' or 'landscape'
    unit: 'mm',
    format: [210, 297] // A4 size: [width, height] in mm
}) as jsPDFWithAutoTable;

export const generateGigReport = (gigData: Gig[]) => {
    // Load SkillSync logo image
    const logoImg = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = '/Images/Logo.png'; // Replace 'logo.png' with the actual path to the logo image
        img.onload = () => resolve(img);
        img.onerror = error => reject(error);
    });

    // Once the image is loaded, add it to the document and generate PDF
    logoImg.then((img: HTMLImageElement) => {
        // Set font styles for the header
        doc.setFont("helvetica", "bold");
        doc.setTextColor(33, 150, 243);

        // Add title with logo
        doc.addImage(img, 'PNG', 80, 10, 50, 20); // Place logo at the top center
        doc.setFontSize(24);
        doc.text("Freelancer Gigs Report", 105, 40, { align: 'center' });

        // Header Section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Set text color to black

        const contactInfo = "skillsync@gmail.com | +112752458 | www.skillsync.com";

        // Add sample data to the header
        doc.setFont("helvetica", "bold");
        doc.setFont("helvetica", "normal");
        doc.text(contactInfo, 105, 50, { align: 'center' }); // Adjust position

        // Table data
        const data = gigData.map(gig => [
            gig.freelancerUsername,
            gig.gigTitle,
            gig.gigCategory,
            gig.gigDateCreated
        ]);

        // Add table using autoTable plugin
        doc.autoTable({
            head: [['Freelancer Name', 'Gig Title', 'Gig Category', 'Gig Date Created']],
            body: data,
            startY: 57, // Adjust startY to leave space for the title and logo
            theme: 'striped',
            styles: { cellPadding: 4, fontSize: 10, valign: 'middle', halign: 'center' },
            headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontStyle: 'bold' },
            columnStyles: { 0: { fontStyle: 'bold' } } // Make the first column bold
        });

        // Footer Section
        doc.setFontSize(10);
        doc.setTextColor(100); // Set text color to gray
        
        // Date in bottom left
        const currentDate = new Date().toLocaleDateString();
        doc.text("Thank you for doing business with us !!!", doc.internal.pageSize.width - 135, doc.internal.pageSize.height - 10);
        doc.text(`Date: ${currentDate}`, 20, doc.internal.pageSize.height - 30);
        // Signature in bottom right
        doc.text("Signature: _ _ _ _ _ _ _ _ _ _ _ _", doc.internal.pageSize.width - 70, doc.internal.pageSize.height - 30);

        // Save PDF
        doc.save("gig_report.pdf");
    }).catch(error => {
        console.error("Error loading image:", error);
    });
};
