class TicketResponseModel{
    id:number;
    response:string;
    ticketId:number;
    userId:number;
    userName:string;
    relatedTo:string;
    createdTime:Date;
    updatedTime:Date;
    status:string;
    ticektdescription:string;
    subject:string;
    responseTime:Date;
    responsesubject:string;

    constructor(id:number, response:string, responseTime:Date, responsesubject:string,ticket:{ticketId:number, relatedTo:string, createdTime:Date, updatedTime:Date, status:string, ticektdescription:string, subject:string,user:{userId:number, userName:string}}){
        this.id = id;
        this.response = response;
        this.ticketId = ticket.ticketId;
        this.userId = ticket.user.userId;
        this.userName = ticket.user.userName;
        this.relatedTo = ticket.relatedTo;
        this.createdTime = ticket.createdTime;
        this.updatedTime = ticket.updatedTime;
        this.status = ticket.status;
        this.ticektdescription = ticket.ticektdescription;
        this.subject = ticket.subject;
        this.responseTime = responseTime;
        this.responsesubject = responsesubject;
    }
}
export default TicketResponseModel;