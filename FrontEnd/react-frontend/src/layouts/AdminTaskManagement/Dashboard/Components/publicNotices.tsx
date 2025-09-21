import "../dashboard.css";
import { Card, Button } from 'react-bootstrap';
import { Cardcontent } from "./card";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PublicNoticesModel from "../../../../Model/publicNoticesModel";
import { SpinnerLoading } from "../../../../utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const PublicNotices = () => {
  const [data, setData] = useState<PublicNoticesModel[]>([]);
  const [error, setError] = useState(null);
  const [isloading, setIsloading] = useState(true);
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
          description: responsedata[element].description,
          audience: responsedata[element].audience,
          datecreated: responsedata[element].datecreated,
          lastupdated: responsedata[element].lastupdated,
          moreDetailsLink: responsedata[element].moreDetailsLink,
          imagelink: responsedata[element].imagelink
        });
      }

      setData(loadedNotices);
      console.log("data length : " + data.length);
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
    <div className="container">
      <div className="container-fluid py-0 text-black d-flex justify-content-between align-items-center">
        <h1 className="display-5 fw-bold ms-4">Public Notices</h1>
        <Link 
        className="btn btn-lg main-color text-white p-3 d-flex align-items-center justify-content-center" 
        style={{borderRadius:"50%", width: "60px", height: "60px",backgroundColor:"purple"}} 
        to={`/dashboard/search`}>

           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg> 
          
        </Link>
      </div>
      <hr style={{color:"purple"}} />

      {data.slice().reverse().map((element) => (

        <Cardcontent notice={element} key={element.id} />
      ))}



    </div>
  );


}