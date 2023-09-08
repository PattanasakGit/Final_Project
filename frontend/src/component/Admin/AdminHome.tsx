import '../../css/Background.css';
import '../../css/Admin_Home.css';

const url = 'http://localhost:3000';

function AdminHome() {
    return (
        <center>
            <div style={{ height: 'auto', width: '95%', backgroundColor: '#ffffff99' }} className='contentPage'>
                <h1 style={{ color: '#33333398' }}>ศูนย์ควบคุมสำหรับผู้ดูแลระบบ</h1>
                <div className='container_admin_home'>

                    <div id="menu_admin_1" className='menu_admin' onClick={() => window.location.href = url + '/AdminCheckProduct'}>
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2Fpage%20edit.png?alt=media&token=8b33d3a3-3308-4700-b785-b7d8df6632aa' />
                        <p>จัดการประกาศขายสินค้า</p>
                    </div>
                    <div id="menu_admin_2" className='menu_admin' onClick={() => window.location.href = url + '/AdminCheckAds'} >
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2Fads.png?alt=media&token=2c4b4259-7347-4741-be3a-e078f3bfbf9b' />
                        <p>ตรวจสอบผู้ซื้อโฆษณา</p>
                    </div>
                    <div id="menu_admin_3" className='menu_admin' onClick={() => window.location.href = url + '/CheckFraudReport'}>
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2FIconFraud.png?alt=media&token=fd40b98f-6af8-4da1-a398-28012047095f'  />
                        <p>ตรวจสอบรายงานการโกง</p>
                    </div>
                    <div id="menu_admin_3" className='menu_admin' onClick={() => window.location.href = url + '/AdminManagement'}>
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2Fadmin.png?alt=media&token=1245bfe8-d8f8-4154-bd7f-0b0004199a3e' />
                        <p>ผู้ดูแลระบบ</p>
                    </div>



                    <div id="menu_admin_4" className='menu_admin' onClick={() => window.location.href = url + '/DataWeb'}>
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2Fwebsites.png?alt=media&token=7bbd4347-6476-4339-99ce-1327d2b65838' />
                        <p>ตั้งค่าเว็ปไซต์</p>
                    </div>
                    <div id="menu_admin_5" className='menu_admin'onClick={() => window.location.href = url + '/AdminCategory'} >
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2Fcategory.png?alt=media&token=b0412637-b76d-435f-91e0-5949b6e5a287' />
                        <p>จัดการหมวดหมู่สินค้า</p>
                    </div>
                    <div id="menu_admin_6" className='menu_admin' onClick={() => window.location.href = url + '/AdminTopBanner'}>
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2Fads_sitting.png?alt=media&token=35e3952a-2a60-467c-98ab-46ac25de86be' />
                        <p>จัดการโฆษณาบนเว็ปไซต์</p>
                    </div>
                    <div id="menu_admin_6" className='menu_admin' onClick={() => window.location.href = url + '/HomePage'}>
                        <img src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/ICON%2FhomePage%20User.png?alt=media&token=3cacb854-dcc0-4dc0-a1e8-020aa14774f6' />
                        <p>หน้าแรกของผู้ใช้งานทั่วไป</p>
                    </div>

                </div>
            </div>
        </center>
    );
}

export default AdminHome;
