import React, {useState} from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import EditGig from './layouts/FreelancerWorkManagement/FreelancerDashboard/Components/EditGig';
import FreelancerDashboard from './layouts/FreelancerWorkManagement/FreelancerDashboard/FreelancerDashboard';
import FreelancerHome from './layouts/FreelancerWorkManagement/FreelancerHome/FreelancerHome';
import { CreateGigForm1 } from './layouts/FreelancerWorkManagement/GigManagement/Components/CreateGigForm1';
import CreateGigForm2 from './layouts/FreelancerWorkManagement/GigManagement/Components/CreateGigForm2';
import CreateGigForm3 from './layouts/FreelancerWorkManagement/GigManagement/Components/CreateGigForm3';
import { Footer } from './layouts/navbar&footers/Footer';
import { Navbar } from './layouts/navbar&footers/Navbar';
import { Dashboard } from './layouts/AdminTaskManagement/Dashboard/dashboard';
import { DashboardPage } from './layouts/AdminTaskManagement/Admin/DashboardPage';
import { EditNoticePage } from './layouts/AdminTaskManagement/Admin/EditNoticePage';
import { NewNoticePage } from './layouts/AdminTaskManagement/Admin/NewNoticePage';
import { RespondToTicketPage } from './layouts/AdminTaskManagement/Admin/RespondToTicketPage';
import { EditNoticeForm } from './layouts/AdminTaskManagement/Admin/components/EditNoticeForm';
import { RespondToTicekt } from './layouts/AdminTaskManagement/Admin/components/RespondtoticketComponents/RespondToTicekt';
import { HelpdeskPage } from './layouts/AdminTaskManagement/HelpDesk/HelpdeskPage';
import { NewTicket } from './layouts/AdminTaskManagement/HelpDesk/NewTicket';
import { RaisedTicketPage } from './layouts/AdminTaskManagement/HelpDesk/RaisedTicketPage';
import { SearchNoticesPage } from './layouts/AdminTaskManagement/SearchNotices/SearchNoticesPage';
import { UserSpecificTicketResponse } from './layouts/AdminTaskManagement/HelpDesk/Components/UserSpecificTicketResponse';
import { UserTicketResponsepage } from './layouts/AdminTaskManagement/HelpDesk/UserTicketResponsepage';
import { SupportNavBar } from './layouts/AdminTaskManagement/HelpDesk/Components/SupportNavBar';
import { GigOrder } from './layouts/FreelancerWorkManagement/GigOrder/GigOrder';
import { FormGenerate } from './layouts/AdminTaskManagement/HelpDesk/formGenerate/FormGenerate';
import { FreelancerLoginComponent } from './layouts/UserVerificationManagement/UserLogin/Components/FreelancerLoginComponent';
import { ClientLoginComponent } from './layouts/UserVerificationManagement/UserLogin/Components/ClientLoginComponent';
// import AdminLoginComponent from './layouts/UserVerificationManagement/UserLogin/Components/AdminLoginComponent';
import FreelancerRegComponent from './layouts/UserVerificationManagement/UserRegistration/FreelancerRegComponent'
import ClientRegComponent from './layouts/UserVerificationManagement/UserRegistration/ClientRegComponent'
//import QualificationComponent from './layouts/UserVerificationManagement/QualificationUpload/QualificationComponent'
import QualificationPage from './layouts/UserVerificationManagement/QualficationPage/QualificationPage'
import QualificationUploadPage from './layouts/UserVerificationManagement/QualificationUpload/QualificationUploadPage'
import ApplicantListPage from './layouts/UserVerificationManagement/ApplicationReviewPage/Components/ApplicantListPage'
import QualificationReview from './layouts/UserVerificationManagement/ApplicationReviewPage/Components/QualificationReview'
import InProgress from './layouts/UserVerificationManagement/UserRegistration/InProgress'
import ResubmissionUpload from './layouts/UserVerificationManagement/QualificationUpload/ResubmissionUpload'
import UserTest from './layouts/UserVerificationManagement/UserLogin/Components/UserTest';
import ListExamComponents from './layouts/ExamsManagment/Component/ListExamComponents';
import ExamComponent from './layouts/ExamsManagment/Component/ExamComponent';
import QuestionsComponent from './layouts/ExamsManagment/Component/QuestionsComponent';
import OptionsComponent from './layouts/ExamsManagment/Component/OptionsComponent';
import AttemptExamComponent from './layouts/ExamsManagment/Component/AttemptExamComponent';
import DisplayQuestionAndAnswers from './layouts/ExamsManagment/Component/DisplayQuestionAndAnswers';
import ClientDetails from './layouts/ProfileManagment/ClientDetails';
import FreelancerDetails from './layouts/ProfileManagment/FreelancerDetails';
import Message from './layouts/ProfileManagment/Message';
import ListRatingComponent from './layouts/DeliveringJobs&RatingManagement/deliveringJobsRatingSystemComponents/ListRatingComponent'
import RatingComponent from './layouts/DeliveringJobs&RatingManagement/deliveringJobsRatingSystemComponents/RatingComponent'
import ViewRatingComponent from './layouts/DeliveringJobs&RatingManagement/deliveringJobsRatingSystemComponents/ViewRatingComponent'
import FreelancerAgrementComponent from './layouts/DeliveringJobs&RatingManagement/deliveringJobsRatingSystemComponents/FreelancerAgrementComponent'
import ClientAgrementComponent from './layouts/DeliveringJobs&RatingManagement/deliveringJobsRatingSystemComponents/ClientAgrementComponent'
import ListProjectComponent from './layouts/DeliveringJobs&RatingManagement/deliveringJobsRatingSystemComponents/ListProjectComponent'


import ViewJobPostComponent from './layouts/ClientSideJobListingManagement/Component/ViewJobPostComponent';
import JobComponent from './layouts/ClientSideJobListingManagement/Component/JobComponent';
import ListJobComponent from './layouts/ClientSideJobListingManagement/Component/ListJobComponent';
import SearchJobComponent from './layouts/ClientSideJobListingManagement/Component/SearchJobComponent';
import FreelancerViewComponent from './layouts/ClientSideJobListingManagement/Component/FreelancerViewComponent';
import JobApplyForm from './layouts/ClientSideJobListingManagement/Component/JobApplyForm';
import JobAcceptanceComponent from './layouts/ClientSideJobListingManagement/Component/JobAcceptanceComponent';

import PaymentComponent from './layouts/PaymentManagement/components/PaymentComponent';
import PaymentHistoryComponent from './layouts/PaymentManagement/components/PaymentHistoryComponent';
import SelectPaymentType from './layouts/PaymentManagement/views/SelectPaymentType';
import CardPaymentProceed from './layouts/PaymentManagement/views/CardPaymentProceed';
import PayPalProceed from './layouts/PaymentManagement/views/PayPalProceed';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaymentDetailsFComponent from './layouts/PaymentManagement/components/PaymentDetailsFComponent';
import DetailsPage from './layouts/PaymentManagement/components/DetailsPage';
import TransactionDetails from './layouts/PaymentManagement/components/TransactionDetails';
import OTPVerification from './layouts/UserVerificationManagement/UserRegistration/OTPVerification';
import TestComponent from './layouts/ExamsManagment/Component/TestComponent';
import SheduleInterviewComponent from './layouts/ExamsManagment/Component/SheduleInterviewComponent';
import HomePage from './layouts/Home/HomePage';
import AdminLoginComponent from './layouts/UserVerificationManagement/UserLogin/Components/AdminLoginPage';
import RegisterPager from './layouts/Home/RegisterPage';
import { AdminNavbar } from './layouts/AdminTaskManagement/Admin/components/AdminNavbar';
//import { FreelancerContext } from './layouts/UserVerificationManagement/Context/Context';
import FreelancerContextProvider from './layouts/UserVerificationManagement/Context/ContextProvider';
import FreelancerContext from './layouts/UserVerificationManagement/Context/Context';
import { ThemeContext } from './layouts/UserVerificationManagement/Context/themeContext';


export const App = () => {
  const [theme, setTheme] = useState<string>("light");
  return (

  <FreelancerContextProvider>
   <ThemeContext.Provider value={{ theme, setTheme }} >
   
   <Router>
      <div className='d-flex flex-column min-vh-100'>
        <div className='flex-grow-1'>
          <Switch>
            <Route path="/HomePage">
              <Navbar />
              <HomePage />
            </Route>
            <Route path="/CreateGigForm1">
              <Navbar />
              <CreateGigForm1 />
              <Footer />
            </Route>
            <Route path="/CreateGigForm2/:gigId">
              <Navbar />
              <CreateGigForm2 />
              <Footer />
            </Route>
            <Route path="/CreateGigForm3/:gigId">
              <Navbar />
              <CreateGigForm3 />
              <Footer />
            </Route>
            <Route path="/FreelancerMain" exact>
              <Navbar />
              <FreelancerHome />
            </Route>
            <Route path="/gig/:id">
              <Navbar />
              <GigOrder />
              <Footer />
            </Route>
            <Route path="/FreelancerDashboard">
              <Navbar />
              <FreelancerDashboard />
              <Footer />
            </Route>
            <Route path="/edit/:id">
              <Navbar />
              <EditGig />
              <Footer />
            </Route>

            {/* dilshan gmamge(do not change) */}

            <Route path="/" exact>
              <Redirect to='/dashboard' />
            </Route>

            <Route path='/dashboard' exact>
              <Navbar />
              <Dashboard />
            </Route>

            <Route path='/dashboard/search'>
              <Navbar />
              <SearchNoticesPage />
            </Route>

            <Route path='/support' exact>
              <HelpdeskPage />
            </Route>

            <Route path='/raiseticket' exact>
              <NewTicket />
            </Route>

            <Route path='/tickets' exact>
              <RaisedTicketPage />
            </Route>

            <Route path='/tickets/:ticketId' exact>
              <SupportNavBar />
              <UserTicketResponsepage />
            </Route>


            <Route path='/admin' exact>
              <Navbar />
              <DashboardPage />
            </Route>

            <Route path='/admin/newnotice' exact>
              <Navbar />
              <NewNoticePage />
            </Route>

            <Route path='/admin/editnotice' exact>
              <Navbar />
              <EditNoticePage />
            </Route>

            <Route path='/admin/ticketrespond' exact>
              <Navbar />
              <RespondToTicketPage />
            </Route>

            <Route path='/admin/editnotice/:noticeId' exact>
              <Navbar />
              <EditNoticeForm />
            </Route>

            <Route path='/admin/ticketrespond/:ticketId' exact>
              <Navbar />
              <RespondToTicekt />
            </Route>

            {/* test file  */}
            <Route path='/report' exact>
              <FormGenerate />
            </Route>

            {/* end of dilshan gamage files */}


            {/* Starting supeshala's files */}

            <Route path='/Freelancer/Login' exact>
              <Navbar />
              <FreelancerLoginComponent />

            </Route>

            <Route path='/Client/Login' exact>
              <Navbar />
              <ClientLoginComponent />

            </Route>

            <Route path='/Admin/Login' exact>
              <AdminLoginComponent />
            </Route>

            <Route path='/Freelancer/Registration' exact>
              <Navbar />
              <FreelancerRegComponent />
              <Footer />
            </Route>

            <Route path='/Client/Registration' exact>
              <Navbar />
              <ClientRegComponent />
              <Footer />
            </Route>

            {/* dummy site */}
            {/* http://localhost:3000/Freelancer/QualificationUploader */}
            {/* <Route path='/Freelancer/QualificationUploader'  exact>
      <QualificationComponent/>
      
    </Route> */}

            <Route path='/upload-qualification' exact>
              <QualificationUploadPage />
            </Route>

            <Route path='/QualificationPage' exact>
              <QualificationPage />
            </Route>

            <Route path='/Applicant/Page' exact>
              <Navbar />
              <AdminNavbar />
              <ApplicantListPage />
              <Footer />
            </Route>

            <Route path='/Applicant/review/:username' exact>
              <Navbar />
              <QualificationReview />
              <Footer />
            </Route>

            <Route path='/InProgressPage' exact>
              <Navbar />
              <InProgress />
              <Footer />
            </Route>

            <Route path='/ReSubmission/:username' exact>
              <Navbar />
              <ResubmissionUpload />
              <Footer />
            </Route>

            <Route path='/UserTestPage' exact>
              <Navbar />
              <UserTest />
              <Footer />
            </Route>

            <Route path='/OTPVerificationPage' exact>
              <Navbar />
              <OTPVerification />
              <Footer />
            </Route>

            <Route path='/Admin/Login' exact>
              <Navbar />
              <AdminLoginComponent />
            </Route>

            <Route path='/User/Registration' exact>
              <Navbar />
              <RegisterPager />
            </Route>

            {/* Ending supeshala's files */}

            {/*Vaas file begin*/}
            <Route path="/exams">
              <Navbar />
              <ListExamComponents />
              <Footer />
            </Route>
            <Route path="/add-exam">
              <Navbar />
              <ExamComponent />
              <Footer />
            </Route>
            <Route path="/edit-exam/:id">
              <Navbar />
              <ExamComponent />
              <Footer />
            </Route>
            <Route path="/add-Question/:examId">
              <Navbar />
              <QuestionsComponent />
              <Footer />
            </Route>
            <Route path="/edit-Question/:questionId/:examId">
              <Navbar />
              <QuestionsComponent />
              <Footer />
            </Route>
            <Route path="/add-Option/:examId/:questionId">
              <Navbar />
              <OptionsComponent />
              <Footer />
            </Route>
            <Route path="/edit-Option/:examId/:questionId/:optionId">
              <Navbar />
              <OptionsComponent />
              <Footer />
            </Route>
            <Route path="/attempt-exam/:examIdPk">
              <Navbar />
              <AttemptExamComponent />
              <Footer />
            </Route>
            <Route path="/take-exam/:examIdPk">
              <Navbar />
              <DisplayQuestionAndAnswers />
              <Footer />
            </Route>
            <Route path="/add-interview">
              <Navbar />
              <SheduleInterviewComponent />
              <Footer />
            </Route>
            {/*Vaas files End*/}
            {/*vinuja's files */}
            <Route path="/clients/:username">
              <Navbar />
              <ClientDetails />
              <Footer />
            </Route>
            <Route path="/freelancers/:username">
              <Navbar />
              <FreelancerDetails />
              <Footer />
            </Route>
            <Route path="/Message/:username/:username2/:conversation">
              <Navbar />
              <Message />
            </Route>
            {/*vinuja's files end*/}

            {/*Nilmani's files */}
            {/* //http://localhost:3000/ratings */}
            <Route path="/ratings">
              <Navbar />
              <ListRatingComponent />
              <Footer />
            </Route>
            {/* //http://localhost:3000/add-rating */}
            <Route path="/add-rating">
              <Navbar />
              <RatingComponent />
              <Footer />
            </Route>
            {/* //http://localhost:3000/edit-rating/1 */}
            <Route path="/edit-rating/:id">
              <Navbar />
              <RatingComponent />
              <Footer />
            </Route>
            {/* //http://localhost:3000/view-rating/1 */}
            <Route path="/view-rating/:id">
              <Navbar />
              <ViewRatingComponent />
              <Footer />
            </Route>
            {/* //http://localhost:3000/freelancerAgreement */}
            <Route path="/freelancerAgreement">
              <Navbar />
              <FreelancerAgrementComponent />
              <Footer />
            </Route>
            {/* //http://localhost:3000/clientAgreement */}
            <Route path="/clientAgreement">
              <Navbar />
              <ClientAgrementComponent />
              <Footer />
            </Route>
            {/* //http://localhost:3000/projects */}
            <Route path="/projects">
            </Route>

            {/* <Route path='/edit-details/:userName' >
      <Navbar />
      <ListProjectComponent />
      <Footer />
    </Route> */}
            {/*Nilmani's files end*/}

            {/*Geesarani */}
            <Route path='/view-jobpost/:id'>
              <Navbar />
              <ViewJobPostComponent />
              <Footer />
            </Route>
            <Route path='/create-newJobPost'>
              <JobComponent />
              <Footer />
            </Route>
            <Route path='/jobs'>
              <Navbar />
              <ListJobComponent />
              <Footer />
            </Route>
            <Route path='/searchjobs'>
              <Navbar />
              <SearchJobComponent />
              <Footer />
            </Route>
            <Route path='/edit-jobpost/:id'>
              <Navbar />
              <JobComponent />
              <Footer />
            </Route>
            <Route path='/freelancerView-jobpost/:id'>
              <Navbar />
              <FreelancerViewComponent />
              <Footer />
            </Route>
            <Route path='/applyJobPost'>
              <Navbar />
              <JobApplyForm />
              <Footer />
            </Route>
            <Route path='/jobrequests'>
              <Navbar />
              <JobAcceptanceComponent />
              <Footer />
            </Route>
            {/*Geesarani*/}

            {/* starting nipuni's file */}
            <Route path='/payment-details'>
              <Navbar />
              <SelectPaymentType />
              <Footer />
            </Route>

            <Route path='/payment'>
              <Navbar />
              <PaymentHistoryComponent />
              <Footer />
            </Route>

            <Route path='/make-payment'>
              <Navbar />
              <PaymentComponent />
              <Footer />
            </Route>

            <Route path='/card-payment'>
              <Navbar />
              <CardPaymentProceed />
              <Footer />
            </Route>

            <Route path='/paypal-payment'>
              <Navbar />
              <PayPalProceed />
              <Footer />
            </Route>

            <Route path='/details'>
              <Navbar />
              <PaymentDetailsFComponent />
              <Footer />
            </Route>

            <Route path='/edit-details/:userName'>
              <Navbar />
              <PaymentDetailsFComponent />
              <Footer />
            </Route>

            <Route path='/viewDetails/:userName'>
              <Navbar />
              <DetailsPage />
              <Footer />
            </Route>

            <Route path='/transaction-details'>
              <Navbar />
              <TransactionDetails />
              <Footer />
            </Route>
            {/* End nipuni's file */}


          </Switch>
        </div>
      </div>
    </Router>
    </ThemeContext.Provider>
    </FreelancerContextProvider>
 
   
  );
}

export default App;
