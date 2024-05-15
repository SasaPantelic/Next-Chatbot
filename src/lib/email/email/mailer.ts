
import nodemailer from 'nodemailer'
import { emailConfirmationHTML, passwordResetHTML } from './templates/confirmationEmail';

export const appName = process.env.NEXT_PUBLIC_APP_NAME
export default function sendConfirmationEmail(email: string, name: string, confirmationCode: number) {
    const transport = nodemailer.createTransport(emailTransportConfig);
    const mailData = {
        from: `"${appName}" ${process.env.EMAIL_FROM}`,
        to: email,
        subject: `${appName} Email Verification`,
        text: `We received a request to reset your password. Continue by clicking on the following link. If you didn't create an account with ${appName}, you can safely delete this email.
        Confirm your email If that doesn't work, copy and paste the following link in your browser:
        ${process.env.NEXT_PUBLIC_HOST}/api/auth/confirm?confirmatoncode=${confirmationCode}&email=${email}
        Thank you,
        ${appName}
        You received this email because we received a request for the password reset of your account. If you didn't request to reset your password you can safely delete this email.
        `,
        html: emailConfirmationHTML(name, confirmationCode, email)
    }
    transport.sendMail(mailData, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info)
    })
}

export async function sendPasswordReset(email: string, confirmationCode: number) {
    return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport(emailTransportConfig);
        const mailData = {
            from: fromLine,
            to: email,
            subject: `${name} Password Reset`,
            text: `
      We received a request to reset your password. Continue by clicking on the following link. If you didn't create an account with ${name}, you can safely delete this email.
      Confirm your email If that doesn't work, copy and paste the following link in your browser:
      ${process.env.NEXT_PUBLIC_HOST}/api/auth/password-reset?confirmationCode=${confirmationCode}&email=${email}
      Thank you,
      ${name}
      You received this email because we received a request for the password reset of your account. If you didn't request to reset your password you can safely delete this email.
`,
            html: passwordResetHTML(confirmationCode, email)
        }

        transport.sendMail(mailData, function (err, info) {
            if (err) {
                console.log(err)
                reject(err)
            }
            else {
                console.log(info)
                resolve(info)
            }
        })
    })
}


export const emailTransportConfig = {
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
    }
}

export const fromLine = `"${appName} Support" ${process.env.EMAIL_FROM}`