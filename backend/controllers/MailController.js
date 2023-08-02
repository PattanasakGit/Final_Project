const nodemailer = require('nodemailer');

function sendEmail(Code_verify_Email, To) {

    const from = 'Yakkai.th@gmail.com';
    const to = To ;
    const subject = 'รหัสยืนยันบัญชี: '+Code_verify_Email;

    // สร้าง transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'Yakkai.th@gmail.com',
            pass: 'zqbswfzjdfaykmxa'
        }
    });

    // สร้างข้อความอีเมล์
    const Email = {
        from: from,
        to: to,
        subject: subject,
        html: html_in_mail(Code_verify_Email)
    };

    // ส่งอีเมล์
    transporter.sendMail(Email, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

}
module.exports = { sendEmail };


function html_in_mail(Code_verify_Email) {
    let html_code = `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            color: #ff6800;
            font-size: 38px;
            font-weight: 700;
        }

        p {
            color: #ff6800;
            font-size: 16px;
            font-weight: 400;
        }

        .verification-code {
            color: #000;
            font-size: 65px;
            font-weight: 700;
        }

        .image-block {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
        }
    </style>
</head>

<body>
    <div class="container">
        <center>
            <h1>Verify Your Email Address</h1>
            <p>กรุณาใช้รหัสต่อไปนี้เพื่อยืนยัน Email ของท่าน</p>
            <div class="verification-code">
                ${Code_verify_Email.split('').join(' ')}
            </div>
            <img class="image-block" src="https://img.freepik.com/free-vector/my-password-concept-illustration_114360-6924.jpg?w=1060&t=st=1689826034~exp=1689826634~hmac=7edeb5bf7c1839ec3c8de26aefdad3c5699f27487238b4c0f4567081c1c0d78d" alt="email verification" />
        </center>
    </div>
</body>


</html>

`
    return html_code;
}
