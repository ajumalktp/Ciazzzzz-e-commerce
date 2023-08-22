const nodemailer = require('nodemailer')

const sendOtp = (name , email , otp)=>{
    let transporter =  nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,

        tls:{
            rejectUnauthorized:false
        },
        auth:{
            user:process.env.OTP_EMAIL,
            pass:process.env.OTP_PASS,
        }
    })
    var mailOptions = {
        from:process.env.OTP_EMAIL,
        to: email,
        subject: " Email verification",
        html: `
                <h1>Verify Your Email For Ciazzzzz Store</h1>
                  <h3>${name} please use this code to verify your email</h3>
                  <h2>${otp}</h2>
                `,
      }

      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error)
        }else{
            console.log("email sended succesfully");
        }
      })
}

module.exports = sendOtp