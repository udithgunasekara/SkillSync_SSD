import emailjs from 'emailjs-com';

interface EmailParams {
    to_email: string;
}

const serviceId = 'service_4p9c9if';

const userId = 'Hv51HNHN8mKZoV0MQ';

//Request and approve mail sending
export const RequestEmail = (emailParams: EmailParams): void => {

    const templateId = 'request';

    emailjs.send(serviceId, templateId, { ...emailParams }, userId)
        .then((result) => {
            console.log('Email successfully sent!', result.text);
        }, (error) => {
            console.error('Failed to send email:', error.text);
        });
};

//Suspend mail sending
export const SuspendEmail = (emailParams: EmailParams): void => {

    const templateId = 'suspend';

    emailjs.send(serviceId, templateId, { ...emailParams }, userId)
        .then((result) => {
            console.log('Email successfully sent!', result.text);
        }, (error) => {
            console.error('Failed to send email:', error.text);
        });
};
