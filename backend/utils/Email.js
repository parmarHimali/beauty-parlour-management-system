import { transporter } from "./EmailConfig.js";

export async function sendVerificationCode(email, verificationcode) {
  try {
    const info = await transporter.sendMail({
      from: '"BeautyBliss" <beautybliss.verify@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Your Verification Code for Secure Access",
      html: `
        <p>Dear User,</p>
        <p>Thank you for signing up with <strong>BeautyBliss</strong>. Please use the following verification code to complete your registration:</p>
        <h2 style="color:pink;">${verificationcode}</h2>
        <p>This code is valid for <strong>1 minutes</strong>. Do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>BeautyBliss Team</strong></p>
      `,
    });

    console.log("Message sent");
  } catch (error) {
    console.log(error);
  }
}
