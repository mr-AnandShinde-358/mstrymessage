import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
 
    try {

       const resEmail = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mymstry message | Verification code',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        //   console.log('Email is',email,'username is',username)
        // console.log(resEmail)
        return {success:true,message:'Verification email send successfully'}
    } catch (emailError) {
        console.error("Error sending verification email",emailError)
        return {success:false,message:'Failed to send verification email'}

    }
}