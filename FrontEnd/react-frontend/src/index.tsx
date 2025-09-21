import React from 'react';
import ReactDOM from 'react-dom/client';
import { QualificationsProvider } from './layouts/UserVerificationManagement/QualificationUpload/QualificationsContext'
import './index.css';
import {App} from './App';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
   <QualificationsProvider>
    
     {/* added by nipuni. if there any error please comment */}
   <React.StrictMode>
        <App />
        <ToastContainer
          theme="colored"
          position="top-right"
          autoClose={3000}
          closeButton={true}
        />
      </React.StrictMode>

    </QualificationsProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

