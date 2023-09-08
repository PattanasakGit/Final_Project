const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const url = 'http://localhost:8000'

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
//====================================================================================================
//                      Email for verification (ส่งโค๊ดไปยัง user)
//====================================================================================================
function sendEmail(Code_verify_Email, To) {
  try {
    const from = 'Yakkai.th@gmail.com';
    const to = To;
    const subject = 'รหัสยืนยันบัญชี: ' + Code_verify_Email;

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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

function html_in_mail(Code_verify_Email) {
  let html_code = `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #fff; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px;}
        h1 { color: #ff6800; font-size: 38px; font-weight: 700; }
        p { color: #ff6800; font-size: 16px; font-weight: 400; }
        .verification-code { color: #000; font-size: 65px; font-weight: 700; }
        .image-block { max-width: 100%; height: auto; display: block; margin: 20px auto; }
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
            <img class="image-block" src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2Fstand_passworld.jpg?alt=media&token=81dd14da-c306-4206-9e5a-b5b3882c80f7" />
        </center>
    </div>
</body>


</html>

`
  return html_code;
}

//======================================================================================================================
//                      Email forget & change Password
//======================================================================================================================
async function changePassword(req, res) {
  try {
    const User_Email = req.params.email;
    const from = 'Yakkai.th@gmail.com';
    const subject = 'เปลี่ยรหัสผ่านบัญชี YAKKAI';
    const token = jwt.sign({ User_Email }, 'TP_KEY_login', { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/resetPassword?token=${token}`;
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
      to: User_Email,
      subject: subject,
      html:

        `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Krub&family=Noto+Sans+Thai&display=swap">
      <style>
        body { margin: 0; padding: 0; background-color: #fafafa; font-family: 'Noto Sans Thai', sans-serif; }
        .container {width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
        .logo { text-align: center; }
        .logo img { max-width: 150px; border-radius: 100px; height: auto; }
        .content {text-align: center; padding: 40px; }
        .button { background-color: #f3560b; color: #ffffff; text-decoration: none; padding: 10px 30px; border-radius: 5px; font-family: 'Krub', sans-serif; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <a href="http://localhost:3000/">
            <img src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FLOGO_YaKKAI.png?alt=media&token=1410c18c-d307-4612-a1e4-30f21b6ee705" alt="Yakkai Logo">
          </a>
        </div>
        <div class="content">
          <h1 style="color: #333333;"><b>NEW</b> <strong>PASSWORD</strong></h1>
          <p>สวัสดีครับ เนื่องจากคุณได้ทำการร้องขอเปลี่ยนรหัสผ่านบัญชี Yakkai</p>
          <p>เราจึงส่ง Email ฉบับนี้เพื่อทำการเปลี่ยนแปลงรหัสผ่านของคุณ</p>
          <p>ลิ้งค์สำหรับรีเซ็ตรหัสผ่านจะหมดอายุใน 1 ชั่วโมง</p><br/>
          <p>คลิก <a href="${resetLink}">ที่นี่</a> เพื่อรีเซ็ตรหัสผ่านของคุณ</p>
        </div>
      </div>
    </body>
    </html>
    
    `
    };

    // ส่งอีเมล์
    transporter.sendMail(Email, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: error.message });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ status: true });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

//======================================================================================================================
//                      อันนี้จะเป็นการรับเอาค่าต่าง ๆ เพื่อส่ง email มีขึ้นเพื่อส่งอีเมลย์ถึงใครก็ได้ เนื้อหาใดก็ได้
//======================================================================================================================
async function Every_Email(req, res) {
  try {
    const data = req.body;
    const from = 'Yakkai.th@gmail.com';
    const subject = data.SUBJECT;

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
      to: data.SEND_TO,
      subject: subject,
      html:
        `
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Reset Password</title>
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Krub&family=Noto+Sans+Thai&display=swap">
                  <style>
                    body { margin: 0; padding: 0; background-color: #fafafa; font-family: 'Noto Sans Thai', sans-serif; }
                    .container {width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
                    .logo { text-align: center; }
                    .logo img { max-width: 150px; border-radius: 100px; height: auto; }
                    .content {text-align: center; padding: 0px 40px 40px 40px; margin-top: 0px;}
                    .button {background-color: #f3560b;color: #ffffff;text-decoration: none;padding: 10px 30px;border-radius: 5px;font-family: 'Noto Sans Thai', sans-serif; 
                  border: none;cursor: pointer;transition: background-color 0.3s ease-in-out;margin: 10px 0px;
                }
                .button:hover { background-color: #e74c3c; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="content">
                      <h1 style="color: #333333;font-family: 'Noto Sans Thai', sans-serif;" > มีผู้กำลังสนใจสินค้าของคุณ </h1>
                      <h2 style="color: #333333;font-family: 'Noto Sans Thai', sans-serif;" > โปรดติดต่อกลับไปยัง</h2>
                      <h2 style="margin: 0; background-color:#F8F0E5;color: #333333;font-family: 'Noto Sans Thai', sans-serif;" > คุณ ${data.CustomerName} </h2>
                      <h2 style="margin: 0; background-color:#EADBC8;color: #333333;font-family: 'Noto Sans Thai', sans-serif;" > เบอร์โทรศัพท์: <a href="tel://${data.CusttomerTel})">${data.CusttomerTel}</a> </h2>
                      <div style="margin: 30px 0px 0px 5px ; background-color:#F8F6F4;color: #333333;padding: 10px; border-radius: 20px;font-family: 'Noto Sans Thai', sans-serif;">
                        <h3 style="margin: 0;font-family: 'Noto Sans Thai', sans-serif;" >รายละเอียดเกี่ยวกับสินค้าของคุณ</h3>
                        
                        <p style="margin: 0;font-family: 'Noto Sans Thai', sans-serif;" >ID สินค้า: ${data.ID} </p>
                        <p style="margin: 0;font-family: 'Noto Sans Thai', sans-serif;" >ชื่อสินค้า:   ${data.P_NAME} </p>
                        <p style="margin: 0;font-family: 'Noto Sans Thai', sans-serif;" >ราคา ${formatNumber(data.P_PRICE)} บาท</p><br />
                        <img style="height:200px; border-radius: 15px;" src=${data.P_IMG[0]}><br />
                        <a href="http://localhost:3000/Product/${data.ID}">
                          <button class="button"> 
                            ดูรายการประกาศขายของคุณ!
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
                `
    };
    // ส่งอีเมล์
    transporter.sendMail(Email, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: error.message });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ status: true });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//======================================================================================================================
//                      อันนี้คือ เมื่อ Admin อนุมัติ/ไม่อนุมัต จะทำการส่ง Email ไปแจ้งคนขาย 
//======================================================================================================================
async function Send_Email_after_checkd(SEND_EMAIL_TO, data) {
  try {

    const status_text_to_user = () => {
      if (data.P_STATUS === 'รอตรวจสอบ') {
        return 'รอการตรวจสอบอีกครั้ง';
      } else if (data.P_STATUS === 'กำลังประกาศขาย') {
        return 'ผ่านการอนุมัติ';
      } else if (data.P_STATUS === 'ยกเลิกประกาศขาย') {
        return 'ไม่ผ่านการอนุมัติ';
      } else {
        return '!!! เกิดข้อผิดพลาด โปรดติดต่อผู้ดูแลระบบ !!!';
      }
    }

    let status_text = status_text_to_user();
    const from = 'Yakkai.th@gmail.com';
    const subject = 'แจ้งผลการประกาศขาย';

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
      to: SEND_EMAIL_TO,
      subject: subject,
      html:
        `
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Reset Password</title>
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Krub&family=Noto+Sans+Thai&display=swap">
                  <style>
                    body { margin: 0; padding: 0; background-color: #fafafa; font-family: 'Noto Sans Thai', sans-serif; }
                    .container {width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
                    .logo { text-align: center; }
                    .logo img { max-width: 150px; border-radius: 100px; height: auto; }
                    .content {text-align: center; padding: 0px 40px 40px 40px; margin-top: 0px;}
                    .button {background-color: #f3560b;color: #ffffff;text-decoration: none;padding: 10px 30px;border-radius: 5px;font-family: 'Noto Sans Thai', sans-serif; 
                  border: none;cursor: pointer;transition: background-color 0.3s ease-in-out;margin: 10px 0px;
                }
                .button:hover { background-color: #e74c3c; }
                  </style>
                </head>
                
                
                <body>
                  <div class="container">
                    <div class="content">
                    <div class="logo">
                      <a href="http://localhost:3000/">
                        <img src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FLOGO_YaKKAI.png?alt=media&token=1410c18c-d307-4612-a1e4-30f21b6ee705" alt="Yakkai Logo">
                      </a>
                    </div>
                    <h2> ระบบได้ทำการตรวจสอบ <br/> รายการประกาศขายของคุณแล้ว <h2>
                    <h2> ผลการตรวจสอบคือ <h2>
                    <h1 style='background-color: #F8F0E5'> ${status_text} <h1>
                      
                        <a href="http://localhost:3000/Product/${data.ID}">
                          <button class="button"> 
                            ดูรายการประกาศขายของคุณ!
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
                `
    };
    // ส่งอีเมล์
    transporter.sendMail(Email, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดที่กระบวนการส่ง Email:', error);
  }
}

//======================================================================================================================
//                      อันนี้คือ เมื่อ Admin รายการการขอลงโฆษณากับรับบ 29 วัน จะทำการส่ง Email ไปแจ้งคนขาย 
//======================================================================================================================
async function Send_Email_after_checkd_Ads(SEND_EMAIL_TO, data, status, Ads_Limit_Time) {
  try {

    function text_status() {
      if (status === true) {
        return '✅ หลักฐานการชำระเงินถูกต้อง ✅'
      } else {
        return '❌ รายการโฆษณาของคุณหยุดลงแล้ว ❌'
      }
    }
    const message_status = text_status();

    //----------------------------------------------------------------
    const html_if_OK = ` 
        <h2> ระบบได้ทำการตรวจสอบ หลักฐานการชำระเงิน <br/> การลงโฆษณา ของประกาศขายของคุณเรียบร้อยแล้ว <h2>
        <div style='background-color: #FFF5E0'>
          <h2> ID สินค้า #${data.ID} </h2>
          <h2> ${data.P_NAME} </h2>
          <h2 style='background-color: #E2C799'> ${message_status} <h2>
          <h3 style='background-color: #FFF5E0'> ผลการลงโฆษณาของคุณ จะสิ้นสุดลง </h3> 
          <h2 style='background-color: #E2C799'> วันที่ ${Ads_Limit_Time}</h2>
        </div>
    `;

    const html_if_Not_OK = `
        <h2> ระบบได้ทำการยกเลิกประกาศขายของคุณแล้ว <h2>
        <div style='background-color: #FFF5E0;padding:10px'>
          <h2> ID สินค้า #${data.ID} </h2>
          <h2> ${data.P_NAME} </h2>
          <h2 style='background-color: #E2C799'> ❌สิ้นสุดการลงโฆษณา❌ </h2>
          <h3> ขอบคุณที่เลือกใช้บริการโฆษณากับเรา <br/> หากคุณพบปัญหาโปรดติดต่อหาเราโดยตรง <h3>
        </div>
    `;


    function html_for_send() {
      if (status === true) {
        return html_if_OK;
      } else {
        return html_if_Not_OK;
      }
    }

    //----------------------------------------------------------------

    const from = 'Yakkai.th@gmail.com';
    const subject = 'แจ้งผลการลงโฆษณา 29 วัน';

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
      to: SEND_EMAIL_TO,
      subject: subject,
      html:
        `
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Krub&family=Noto+Sans+Thai&display=swap">
                <style>
                  body { margin: 0; padding: 0; background-color: #fafafa; font-family: 'Noto Sans Thai', sans-serif; }
                  .container {width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
                  .logo { text-align: center; }
                  .logo img { max-width: 150px; border-radius: 100px; height: auto; }
                  .content {text-align: center; padding: 0px 40px 40px 40px; margin-top: 0px;}
                  .button {background-color: #f3560b;color: #ffffff;text-decoration: none;padding: 10px 30px;border-radius: 5px;font-family: 'Noto Sans Thai', sans-serif; 
                border: none;cursor: pointer;transition: background-color 0.3s ease-in-out;margin: 10px 0px;
              }
              .button:hover { background-color: #e74c3c; }
                </style>
              </head>
              
              
              <body>
              <center>
                <div class="container">
                  <div class="content">
                    <div class="logo">
                      <a href="http://localhost:3000/">
                        <img src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FLOGO_YaKKAI.png?alt=media&token=1410c18c-d307-4612-a1e4-30f21b6ee705" alt="Yakkai Logo">
                      </a>
                    </div>
                    ${html_for_send()}
                    <a href="http://localhost:3000/Product/${data.ID}">
                      <button class="button"> 
                        ดูรายการประกาศขายของคุณ!
                      </button>
                    </a>
                    <h3> ขอบคุณที่เลือกใช้บริการโฆษณากับเรา <br/> หากคุณพบปัญหาโปรดติดต่อหาเราโดยตรง <h3>
                  </div>
                </div>
                </div>
                </center>
              </body>
              </html>
              `
    };
    // ส่งอีเมล์
    transporter.sendMail(Email, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดที่กระบวนการส่ง Email:', error);
  }
}
module.exports = { sendEmail, changePassword, Every_Email, Send_Email_after_checkd, Send_Email_after_checkd_Ads };