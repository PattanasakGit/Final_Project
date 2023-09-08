import { useState } from 'react';

import '../../css/MyProduct.css';
import '../../css/Admin_Home.css';

import Swal from 'sweetalert2';
import { validateForm } from '../WebSystem/Validateinput';
import { submit } from '../WebSystem/HTTP_Request ';
import { Grid, FormControl, Button, Box } from '@mui/material';

const CreateAdmin = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [passworld1, setPassworld1] = useState('');
  const [passworld2, setPassworld2] = useState('');

  const handleChange = (event: any) => {
    setGender(event.target.value);
  };

  const handleSubmit = () => {
    let data = {
      U_NAME: name + ' ' + surname,
      U_GENDER: gender,
      U_PHONE: phone,
      U_EMAIL: email,
      U_IMG: '',
      ABOUT_ME: about,
      U_PASSWORD: passworld1,
      pass1: passworld1,
      pass2: passworld2
    }

    if (validateForm(data).isValid) {  //ผ่าน ไม่มี errors
      submit(data, 'createAdmin') // สร้างบัญชี admin โดยการส่งค่าไปเพื่อบันทึก เลยโดยไม่ verify email เพราะ จะสามารถกำหนด email จำลองได้(ไม่จำเป็นต้องใช้ email จริงสำหรับ email ของ ad`)
    } else { //ตรวจพบ errors
      Swal.fire({
        titleText: validateForm(data).messageErrors[0],
        icon: 'warning',
      })
    }
  };

  return (
    <div className="pageSignUp" style={{ borderRadius: '15px' }}>
      {/* <NavBar /> */}
      <div className="contentPage" style={{ marginTop: '2rem', width: '95%' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} >
            <Box>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2Fadmin.svg?alt=media&token=bff45d0e-7ac6-42f2-a731-0bc9873f78cf"
                alt="green iguana"
                style={{ maxWidth: '100%', height: '600px', marginTop: '1rem', borderRadius: '70px' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={5.6}>
            <div className="backform">
              <p className="Texttoppic" style={{ marginTop: '10px', marginBottom: '20px', color: '#33333395', fontSize: '30px' }}>เพิ่มบัญชีผู้ดูแลระบบ</p>
              <Box mb={2} marginLeft={-2.5}>
                <FormControl sx={{ width: '90%' }}>
                  <input
                    placeholder="ชื่อ"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="ThepatforInput"
                  />
                </FormControl>
              </Box>
              <Box mb={2} marginLeft={-2.5}>
                <FormControl sx={{ width: '90%' }}>
                  <input
                    className="ThepatforInput"
                    placeholder="สกุล"
                    value={surname}
                    onChange={(event) => setSurname(event.target.value)}
                  />
                </FormControl>
              </Box>
              <Box mb={2} marginLeft={5} marginRight={3}>
                <div style={{ display: 'flex', justifyContent: 'center' }} className='TP_Box_radio_create_user'>
                  <label className="TP_label_create_user"> <input type="radio" value="ชาย" checked={gender === 'ชาย'} onChange={handleChange} />
                    <span className="TP_span_create_user" style={{ width: '90px' }}> ชาย </span>
                  </label>
                  <label className="TP_label_create_user"> <input type="radio" value="หญิง" checked={gender === 'หญิง'} onChange={handleChange} />
                    <span className="TP_span_create_user" style={{ width: '90px' }}> หญิง </span>
                  </label>
                  <label className="TP_label_create_user"> <input type="radio" value="อื่น ๆ" checked={gender === 'อื่น ๆ'} onChange={handleChange} />
                    <span className="TP_span_create_user" style={{ width: '90px' }}> อื่นๆ </span>
                  </label>
                </div>
              </Box>
              <Box mb={2} marginLeft={-2.5}>
                <FormControl sx={{ width: '90%' }}>
                  <input
                    type="tel"
                    maxLength={10}
                    className="ThepatforInput"
                    placeholder="เบอร์โทรศัพท์"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </FormControl>
              </Box>
              <Box mb={2} marginLeft={-2.5}>
                <FormControl sx={{ width: '90%' }}>
                  <textarea
                    className="ThepatforInput"
                    placeholder="อธิบายเพิ่มเติมเกี่ยวกับคุณ สามารถเพิ่มเติม/แก้ไขข้อมูลส่วนนี้ภายหลังได้"
                    rows={2}
                    value={about}
                    maxLength={20000}
                    style={{ minHeight: '100px', resize: 'none', width: '100%' }}
                    onChange={(event) => setAbout(event.target.value)}
                  />
                </FormControl>
              </Box>
              <hr style={{ border: '0px', backgroundColor: '#ffcc00', height: '8px', width: '95%', marginBottom: '2rem', marginTop: '2rem', borderRadius: "15px" }} />
              <Box mb={2} marginLeft={-2.5}>
                <FormControl sx={{ width: '90%' }}>
                  <input
                    type="email"
                    className="ThepatforInput"
                    placeholder="อีเมล"
                    value={email}
                    onChange={(event) => setEmail(event.target.value.toLowerCase())}
                  />
                </FormControl>
              </Box>
              <Box mb={2} marginLeft={-2.5}>
                <FormControl sx={{ width: '90%' }}>
                  <input
                    type="password"
                    className="ThepatforInput"
                    placeholder="รหัสผ่าน"
                    value={passworld1}
                    onChange={(event) => setPassworld1(event.target.value)}
                  />
                </FormControl>
              </Box>
              <Box mb={2} marginLeft={-2.5}>
                <FormControl sx={{ width: '90%' }}>
                  <input
                    type="password"
                    className="ThepatforInput"
                    placeholder="ระบุรหัสผ่านอีกครั้ง"
                    value={passworld2}
                    onChange={(event) => setPassworld2(event.target.value)}
                  />
                </FormControl>
              </Box>

            </div>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box>
              <Button variant="contained" onClick={handleSubmit} className="TP_fun_button" style={{ height: '80px' }}>
                เพิ่มบัญชีผู้ดูแลระบบ
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default CreateAdmin;