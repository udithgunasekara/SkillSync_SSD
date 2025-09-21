class PublicNoticesModel {
    id:number;
    title:string;
    description:string;
    audience:string;
    datecreated:Date;
    lastupdated:Date;
    moreDetailsLink:string;
    imagelink:string;
    

    constructor(id:number, title:string, description:string, audience:string, datecreated:Date, lastupdated:Date,moreDetailsLink:string,imagelink:string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.audience = audience;
        this.datecreated = datecreated;
        this.lastupdated = lastupdated;
        this.moreDetailsLink= moreDetailsLink;
        this.imagelink= imagelink;
    }

}

export default PublicNoticesModel;