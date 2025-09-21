import React from "react";
import { Page, Text, Image, Document, StyleSheet, View } from "@react-pdf/renderer";
import logo from "../../../../images/Asset 3.png"
import { title } from "process";
import { text } from "stream/consumers";
import TicketResponseModel from "../../../../Model/TicketResponseModel";

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
    },
    text: {
        margin: 12,
        fontSize: 14,
        color: "black",
        textAlign: "justify",
        fontFamily: "Times-Roman"
    },
    header: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
        color: "black",
        fontWeight: 700
    },
    pagenumber: {
        position: "absolute",
        fontSize: 12,
        bottom: 2,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
        borderTopColor: 'black',
        borderTopWidth: 2,
        marginVertical: 10,
        paddingTop: 3

    },
    ticketdetails: {
        fontSize: 14,
        color: "black",
        textAlign: "left",
        fontFamily: "Times-Roman"
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    ticketdescription: {
        fontSize: 14,
        color: "purple",
        textAlign: "justify",
        fontFamily: "Times-Roman"
    },
    responsedescription: {
        fontSize: 14,
        color: "black",
        textAlign: "justify",
        fontFamily: "Times-Roman",
        margin: 12,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginVertical: 10,
        borderBottomStyle: 'dotted'
    },
    footer: {
        position: "absolute",
        bottom: 65,
        left: 35,
        right: 35,
        textAlign: "center",
        fontSize: 12,
        color: "black",
        fontFamily: "Times-Roman"
    },
    date: {
        position: "absolute",
        left: 0
    },
    signature: {
        position: "absolute",
        right: 0,
        borderTopColor: 'black',
        borderTopWidth: 2,
        borderTopStyle:"dotted",
        marginVertical: 10,
    }
    


});



export const Report: React.FC<{ ticketdata: any, ticketresponse?: TicketResponseModel[] }> = (props) => {
    const ticketcreatedtime = new Date(props.ticketdata.createdTime);
    const formattedDate = ticketcreatedtime.toLocaleDateString();
    const formattedTime = ticketcreatedtime.toLocaleTimeString();
    return (
        <Document>
            <Page style={styles.body}>
                <Image src={logo} style={{ width: 150, height: 50, display: "flex", marginLeft: "auto", marginRight: "auto", marginBottom: "10px" }} />
                <Text style={styles.header} fixed>
                    Ticket ID: {props.ticketdata.id} {'\n'}
                    {props.ticketdata.subject}
                </Text>
                <Text style={styles.ticketdetails}>
                    Ticket related to : {props.ticketdata.relatedTo} {'\n'}
                    Ticket raised date : {formattedDate} at {formattedTime}
                </Text>
                <View style={styles.horizontalLine} />
                {/* user ticket description */}
                <Text style={styles.ticketdetails}>
                    {props.ticketdata.user.userName}'s ticket description: {'\n'}
                </Text>
                <Text style={styles.ticketdescription}>
                    {props.ticketdata.description}
                </Text>
                <View style={styles.horizontalLine} />
                {/* ticket response */}
                <Text style={styles.ticketdetails}>
                    Admin Response: {'\n'}
                </Text>
                {props.ticketresponse ? (
                    <View>
                        {props.ticketresponse.map((response, index) => {
                            const responsecreated = new Date(response.createdTime);
                            const respnsecreatedate = responsecreated.toLocaleDateString();
                            const responsecreatedtime = responsecreated.toLocaleTimeString();
                            return (
                                <View key={index}>
                                    <Text style={styles.responsedescription}>
                                        Date: {respnsecreatedate} at {responsecreatedtime} {'\n'}
                                        Response: {response.response} {'\n'}
                                    </Text>
                                </View>
                            );
                        })}
                        <Text style={styles.responsedescription}>
                            End of responses
                        </Text>
                    </View>



                ) : (
                    <Text style={styles.responsedescription}>
                        No responses
                    </Text>
                )}


                <View style={styles.footer}>
                    <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
                    <Text style={styles.signature}>Signature</Text>
                </View>
                <Text style={styles.pagenumber}
                    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                    fixed />
            </Page>
        </Document>
    );
}