import '../../css/footer.css'
import { useEffect, useState } from 'react';
import { getDataWeb } from './HTTP_Request ';

const URL_front = 'http://localhost:3000';

const Footer = () => {
  let blank_dataWeb = { W_NAME: "", W_ADDR: "", W_CONTACT: "", W_EMAIL: "", ABOUT_WEB: "" }
  const [dataWeb, setDataWeb] = useState<any>(blank_dataWeb);
  const fetchDataWeb = async () => {
    const DataWeb_from_backend = await getDataWeb();
    console.log('|---footer โหลดข้อมูลเว็ปไซต์---|');
    if (DataWeb_from_backend) {
      setDataWeb(DataWeb_from_backend)
    }
  }
  useEffect(() => {
    fetchDataWeb();
  }, []);

  return (
    <footer className='containerFooter' >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
        <img src={dataWeb.W_IMG} className='logo_in_footer' />
        <h1 className='name_web_in_footer'> {dataWeb.W_NAME}</h1>
      </div>
      <div className='contain_contact_in_footer'>

        <div className='cover_content_footer'>
          <h3 style={{ margin: '20px 0 0 0' }}>  ช่องทางติดต่อ </h3>
          <div style={{ whiteSpace: 'pre-line' }}>{dataWeb.W_CONTACT}</div>
        </div>

        <div className='cover_content_footer'>
          <h3 style={{ margin: '20px 0 0 0' }}> ที่อยู่ </h3>
          <div style={{ whiteSpace: 'pre-line' }}>{dataWeb.W_ADDR}</div>
        </div>

        <div className='cover_content_footer'>
          <h3 style={{ margin: '20px 0 0 0' }}> เกี่ยวกับเรา </h3>
          <div style={{ whiteSpace: 'pre-line' }}>{dataWeb.ABOUT_WEB}</div>
        </div>

        <div className='cover_content_footer'>
          <a href={URL_front + '/PrivacyPolicy'} ><h3 style={{ margin: '20px 0 0 0' }}> * นโยบายความเป็นส่วนตัว </h3> </a>
          <a href='https://tinyurl.com/4dsc4h4t'><h3> * เครดิตการใช้รูปภาพ </h3> </a>
        </div>

      </div>
    </footer>
  );
}
export default Footer;