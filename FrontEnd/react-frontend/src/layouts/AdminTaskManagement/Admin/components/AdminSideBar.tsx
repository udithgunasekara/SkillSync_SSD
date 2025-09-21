import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export const AdminSideBar = () => {



  return (
    <div className="container-flow">
      <div className="col-2 text-white bg-dark p-0" style={{ height: "100vh",marginTop:"45px",position:"fixed"}}>

<span className="fs-3 fw-bolder fw-semibold text-white border-bottom mb-3" style={{ textAlign: "center" }}>Admin</span>

<ul className="list-unstyled ps-0" id="adminsidebar">


  <li className="mb-2 ">
    <button className="rounded accordion-button   m-0" style={{ width: "100%", textAlign: "center" }} data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
      Dashboard
    </button>
    <div className=" align-items-center justify-content-center collapsed show" id="home-collapse">
      <ul className="btn-toggle-nav list-unstyled fw-normal small ">
        <li className="linklist"><NavLink to={"/admin"} className="link-light rounded" exact >Overview</NavLink></li>
      </ul>
    </div>
  </li>


  <li className="mb-2 ">
    <button className="accordion-button rounded  m-0" style={{ width: "100%", textAlign: "center" }} data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="true">
      Public Notice
    </button>
    <div className=" align-items-center justify-content-center collapsed show" id="dashboard-collapse">
      <ul className="btn-toggle-nav list-unstyled fw-normal  small ">
        <li className="linklist"><NavLink to={"/admin/newnotice"} className="link-light rounded" >New Notice</NavLink></li>
        <li className="linklist"><NavLink to={"/admin/editnotice"} className="link-light rounded">Edit Notice</NavLink></li>
      </ul>
    </div>
  </li>


  <li className="mb-4 ">
    <button className="accordion-button rounded  m-0" style={{ width: "100%", textAlign: "center" }} data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="true">
      Tickets
    </button>
    <div className=" align-items-center justify-content-center collapsed show" id="orders-collapse">
      <ul className="btn-toggle-nav list-unstyled fw-normal  small ">
        <li className="linklist"><NavLink to={"/admin/ticketrespond"} className="link-light rounded">Respond to ticket</NavLink></li>
      </ul>
    </div>
  </li>


  <li className="border-bottom"></li>


</ul>

</div>
    </div>
  );
}