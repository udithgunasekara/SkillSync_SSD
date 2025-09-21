import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet , Image} from '@react-pdf/renderer';
import PAYMENT_SUCCESS from '../image/PAYMENT-SUCCESS.png'

interface TransactionDetails {
  transactionID: string;
  projectID: string;
  paymentMethod: string;
  date: string;
  amount: number;
}

const TransactionPDF: React.FC<{ transactionDetails: TransactionDetails }> = ({ transactionDetails }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.paymentReceipt}>Payment Receipt</Text>
      <Image src={PAYMENT_SUCCESS} style={styles.image} />
        {/* <Text>Transaction ID: {transactionDetails.transactionID}</Text>
        <Text>Project ID: {transactionDetails.projectID}</Text>
        <Text>Payment Method: {transactionDetails.paymentMethod}</Text>
        <Text>Date: {transactionDetails.date}</Text>
        <Text>Amount: {transactionDetails.amount}$</Text> */}

        <Text>Transaction ID: 45</Text>
        <Text>Project ID: 1237</Text>
        <Text>Payment Method: CreditCard</Text>
        <Text>Date: 2024/05/09</Text>
        <Text>Amount: 12$</Text>
      </View>
    </Page>
  </Document>
);

const TransactionDetails: React.FC = () => {
  const location = useLocation();
  const transactionDetails: TransactionDetails = location.state as TransactionDetails;
  const navigate = useHistory();

  // Function to navigate to the '/payment' page
  const goToHistory = () => {
    navigate.push('/payment');
  };

  return (
    <div className='main-section' style={{ background: 'linear-gradient(to right, #dbb2ce, #f9f2fa )' }}>
      <div className='row' >
        <h2 className='text-center mt-5'>Transaction Details</h2>
        <div className='card col-md-6 mt-5 offset-md-3' >
        <h3 className='text-center mt-5'>Payment Receipt</h3>
        
        <img 
          src={PAYMENT_SUCCESS}
          alt="Payment_success"
          
        />

          <div className='card-body my-2' >
            
            <div className='d-flex justify-content-between'>
              

              <div>
                <h5>Transaction ID</h5>
              </div>
              <div>
                {/* <h5>{transactionDetails.transactionID}</h5> */}
                <h5>45</h5>
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div>
                <h5>Project ID</h5>
              </div>
              <div>
                {/* <h5>{transactionDetails.projectID}</h5> */}
                <h5>1237</h5>
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div>
                <h5>Payment Method</h5>
              </div>
              <div>
                {/* <h5>{transactionDetails.paymentMethod}</h5> */}
                <h5>CreditCard</h5>
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div>
                <h5>Date</h5>
              </div>
              <div>
                {/* <h5>{transactionDetails.date}</h5> */}
                <h5>2024/05/09</h5>
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div>
                <h5>Amount</h5>
              </div>
              <div>
                {/* <h5>{transactionDetails.amount}$</h5> */}
                <h5>15$</h5>
              </div>
            </div>

            {/* Display Download Receipt as a button */}
            <PDFDownloadLink document={<TransactionPDF transactionDetails={transactionDetails} />} fileName="payment_receipt.pdf">
              {({ blob, url, loading, error }) => (
                <button className='btn btn-info download-receipt-btn'>
                  {loading ? 'Loading document...' : 'Download Receipt'}
                </button>
              )}
            </PDFDownloadLink>
            <hr />
            <button className='btn btn-info history-btn' onClick={() => goToHistory()}>
              Go to History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fcfafa',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  image: {
    marginBottom: 10, // Adjust as needed
  },
  paymentReceipt: {
    fontSize: 20, // Increase the font size as needed
    marginBottom: 20, // Adjust as needed
    textAlign: 'center'
  },
});

export default TransactionDetails;
