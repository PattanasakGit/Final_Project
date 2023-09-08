import axios from 'axios';
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode';

const PortBackend = 'http://localhost:8000'
const PortFrontend = 'http://localhost:3000'

//==============================================================================================================================================================================================================
export const submit = (data: any, part: string) => {
  const apiUrl = `${PortBackend}/${part}`;

  axios
    .post(apiUrl, data)
    .then((response) => {
      const res = response.data;
      console.log(res);

      if (res.status === true) {
        if (part === 'createProduct' || part === 'createAdmin') {
          Swal.fire({
            title: 'บันทึกสำเร็จ',
            icon: 'success',
            willClose: () => {
              window.location.reload();
            }
          });
          return true;
        } else {
          Swal.fire({
            title: 'บันทึกสำเร็จ',
            icon: 'success',
          });
          return true;
        }

      } else {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: res.error,
          icon: 'error',
        });
        return false;
      }
    })
    .catch((error) => {
      let errorMessage = '!!!';
      if (error.message === 'Network Error') {
        errorMessage = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ โปรดติดต่อผู้ดูแลระบบ'
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = error;
      }

      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
        icon: 'error',
      });
    });
  return false;
};
//==============================================================================================================================================================================================================
export const sendEmaiChangePassword = (email: any) => {

  let timerInterval: number
  Swal.fire({
    title: 'ระบบกำลังส่ง email',
    text: 'คุณจะได้รับ email เพื่อเปลี่ยนรหัสผ่าน',
    timer: 4000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  })

  const apiUrl = `${PortBackend}/sendEmaiChangePassword/${email}`;
  axios
    .post(apiUrl)
    .then((response) => {
      const res = response.data;
      console.log(res);

      if (res.status === true) {
        Swal.fire({
          title: 'ส่งเมลย์สำเร็จ',
          text: 'กรุณาตรวจสอบ email เพื่อเปลี่ยนรหัสผ่านของคุณ',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'ส่งเมลย์ไม่สำเร็จ',
          text: res.error,
          icon: 'error',
        });
      }
    })
    .catch((error) => {
      let errorMessage = '!!!';
      if (error.message === 'Network Error') {
        errorMessage = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ โปรดติดต่อผู้ดูแลระบบ'
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = error;
      }

      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
        icon: 'error',
      });
    });
};
//==============================================================================================================================================================================================================
export const Every_Email = (dataInput: {}) => {
  const apiUrl = `${PortBackend}/Every_Email`;
  axios
    .post(apiUrl, dataInput)
    .then((response) => {
      const res = response.data;
      console.log(res);

      if (res.status === true) {
        Swal.fire({
          html:
            `<center>
                  <h2>ขอบคุณที่สนใจสินค้า<br/>เราได้ดำเนินการแจ้งให้ผู้ขายติดต่อคุณกลับ เรียบร้อยแล้ว</h2>
                  <h3 style="margin: 0; background-color:#F8F0E5;">หากคุณไม่ได้รับการติดต่อกลับหรือต้องการซื้อสินค้าโดยด่วน โปรดเลือก"โทรหาผู้ขาย"</h3>
                  <img style="height:400px; border-radius: 15px;" src='https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FsendMessege.jpg?alt=media&token=9cd19af8-1813-41ad-a648-1594add57ada'>
              <center>
              `,
          showConfirmButton: true,
          showCancelButton: true,
          width: '60%',
        })
      } else {
        Swal.fire({
          title: 'ส่งเมลย์ไม่สำเร็จ',
          text: res.error,
          icon: 'error',
        });
      }
    })
    .catch((error) => {
      let errorMessage = '!!!';
      if (error.message === 'Network Error') {
        errorMessage = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ โปรดติดต่อผู้ดูแลระบบ'
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = error;
      }
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
        icon: 'error',
      });
    });
};
//======================================================== Update  Data  ==========================================================================================================================================
export const update = (data: any, part: string) => {
  const apiUrl = `${PortBackend}/${part}`;
  let timerInterval: number

  axios
    .put(apiUrl, data)
    .then((response) => {
      const res = response.data;
      if (res.status === true) {
        if (part === 'resetPass') {
          Swal.fire({
            title: 'บันทึกรายการอัพเดตสำเร็จ',
            icon: 'success',
            text: 'เรากำลังนำคุณไปยังหน้า Login หลังจากเปลี่ยนรหัสผ่านโปรดเข้าสู่ระบบอีกครั้ง',
            timer: 4000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
            },
            willClose: () => {
              clearInterval(timerInterval)
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = PortFrontend;
            }
          })
        } else {
          Swal.fire({
            title: 'บันทึกรายการอัพเดตสำเร็จ',
            icon: 'success',
          })
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

      } else {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: res.error,
          icon: 'error',
        });
      }
    })
    .catch((error) => {
      let errorMessage = '!!!';
      if (error.message === 'Network Error') {
        errorMessage = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ โปรดติดต่อผู้ดูแลระบบ'
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = error;
      }
      if (part === "resetPass" && error.message === 'Request failed with status code 401') {
        errorMessage = 'ลิ้งค์ของคุณหมดอายุแล้ว กรุณาทำรายการใหม่อีกครั้ง'
      }
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
        icon: 'error',
      });
    });
};
//==============================================================================================================================================================================================================
export const Check_Token = async () => {
  const Token = localStorage.getItem('token');
  const apiUrl = `${PortBackend}/Check_Token`;
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: Token
      }
    });
    return response.data;

  } catch (error) {
    console.log('พบข้อผิดพลาด:' + error);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    window.location.href = PortFrontend;
    return false;
  }
};

//==============================================================================================================================================================================================================
// ฟังก์ชันสำหรับอ่านข้อมูลจาก token และคืนค่าเป็น object ของข้อมูล
export const submitLogin = (data: any, part: string) => {
  const apiUrl = `${PortBackend}/${part}`;
  axios
    .post(apiUrl, data)
    .then((response) => {
      const res = response.data;
      if (res.status === true) {

        localStorage.setItem('token', response.data.token);
        console.log(localStorage.getItem('token'));
        interface DecodedToken { email: string; role: string; }
        const decoded: DecodedToken = jwt_decode(response.data.token);

        localStorage.setItem('email', decoded.email); //เก็บค่าที่อ่านได้จาก token ไว้ที่ client
        localStorage.setItem('role', decoded.role);

        Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = PortFrontend; // เมื่อหมดเวลา 1 วินาที จะเปลี่ยนหน้าไปที่ Home
        });
      }
    })
    .catch((error) => {

      if (error.message) {
        Swal.fire({
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: 'รหัสผ่านหรือ email ไม่ถูกต้อง',
          icon: 'error',
        });
      } else {
        let errorMessage = '!!!';
        if (error.message === 'Network Error') {
          errorMessage = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ โปรดติดต่อผู้ดูแลระบบ'
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = error;
        }
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: errorMessage,
          icon: 'error',
        });
      }
    });
};
//==============================================================================================================================================================================================================
export const TP_VerifyEmail = (data: any, part: string) => {
  const apiUrl = `${PortBackend}/${part}`;

  axios
    .post(apiUrl, data)
    .then((response) => {
      const res = response.data;
      if (res.status === true) {
        Swal.fire({
          title: 'กรุณาใส่รหัส',
          text: `เราทำการส่งรหัสยืนยันไปยัง ${data.U_EMAIL} แล้ว`,
          input: 'number',
          inputAttributes: {
            autocapitalize: 'off'
          },
          confirmButtonText: 'ตรวจสอบ',
          showLoaderOnConfirm: true,
          preConfirm: async (verifyCode) => {
            const email = data.U_EMAIL;
            try {
              const response = await axios.post(`${PortBackend}/TP_VerifyEmail`, { //ส่ง email กับ รหัสยืนยันไปตรวจสอบ หลังบ้าน
                email: email,
                CODE_VERIFY: verifyCode
              });

              if (!response.status) {
                throw new Error('รหัสผ่านไม่ถูกต้อง');
              }

              return response.data;
            } catch (error) {
              Swal.showValidationMessage(`รหัสผ่านที่ท่านป้อนไม่ถูกต้อง`);
            }
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await axios.post(`${PortBackend}/createUser`, data); //ที่ backend จะตรวจสถานะ Verify ก่อนเพิ่มผู้ใช้
              if (!response.status) {
                throw new Error('บันทึกข้อมูลบุคคลไม่สำเร็จ');
              }

            } catch (error) {
              Swal.fire({
                title: 'เกิดข้อผิดพลาด บันทึกข้อมูลบุคคลไม่สำเร็จ'
              })
            }
            Swal.fire({
              title: 'ยืนยันบัญขี เสร็จสิ้น',
              imageUrl: 'https://img.freepik.com/free-vector/product-quality-concept-illustration_114360-7301.jpg?w=1060&t=st=1689945663~exp=1689946263~hmac=807dd5d41f08c78fffaad29ee76cfee74f31b6cb600deb5c0be1ffcb6c7dde86',
              imageWidth: 'auto',
              imageHeight: 300,
              imageAlt: 'Custom image',
              confirmButtonText: 'ไปยังหน้า Login',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = PortFrontend;
              }
              setTimeout(() => { window.location.href = PortFrontend; }, 1500);
            });

          }
        });

      } else {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: res.error,
          icon: 'error',
        });
      }
    })
    .catch((error) => {
      let errorMessage = '!!!';
      if (error.message === 'Network Error') {
        errorMessage = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ โปรดติดต่อผู้ดูแลระบบ'
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = error;
      }

      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
        icon: 'error',
      });
    });
};
//==============================================================================================================================================================================================================
export const listProduct = () => {
  const apiUrl = `${PortBackend}/listProduct`;

  return axios.get(apiUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('พบข้อผิดพลาด:' + error);
      return [];
    });
};
//==============================================================================================================================================================================================================
// type Category = {  id: string;  name: string;};
type Category = { ID: number, CP_NAME: string, CP_ICON: string };
export const fetchCategories = async (): Promise<Category[]> => {
  const apiUrl = `${PortBackend}/listCategoryProduct`;
  return axios.get(apiUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('พบข้อผิดพลาด:' + error);
      return [];
    });
};
//==============================================================================================================================================================================================================
export const fillter_product = async (filterData: any) => {
  const apiUrl = `${PortBackend}/getProductByMultipleConditions`;
  try {
    const response = await axios.post(apiUrl, filterData);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาด:' + error);
    return [];
  }
};

//============================ product  ======================================
export const getProductByID = async (ID: any) => {
  const apiUrl = `${PortBackend}/getProduct/${ID}`;
  try {
    const response = await axios.get(apiUrl, ID);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูลสินค้า:' + error);
    return [];
  }
};
export const getProductBy_EmailUser = async (data: any) => {
  const apiUrl = `${PortBackend}/ListProductByUser`;
  try {
    const response = await axios.post(apiUrl, data);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูลสินค้า:' + error);
    return [];
  }
};

//============================ user  ======================================
export const getUserByID = async (ID: any) => {
  const apiUrl = `${PortBackend}/getUser/${ID}`;
  try {
    const response = await axios.get(apiUrl, ID);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูล User: ' + error);
    return [];
  }
};
export const getUserByEmail = async (email: any) => {
  const apiUrl = `${PortBackend}/getUserByEmail`;
  try {
    const response = await axios.post(apiUrl, email);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูล User:' + error);
    return [];
  }
};

//============================ Review  ======================================
export const addReview = async (data: any) => {
  const apiUrl = `${PortBackend}/addReview`;
  try {
    const response = await axios.post(apiUrl, data);
    Swal.fire({
      title: 'รีวิวสำเร็จ',
      text: 'ขอบคุณที่ร่วมแสดงความคิดเห็นต่อผู้ขาย',
      icon: 'success',
      showConfirmButton: true, // ไม่แสดงปุ่ม OK
      willClose: () => {
        window.location.reload();
      }
    })
    return response.data;
  } catch (error: any) {
    if (error.message === 'Request failed with status code 400') {
      Swal.fire({
        title: 'ขออภัย',
        text: 'คุณได้ทำการรีวิวผู้ใช้รายนี้แล้ว',
        icon: 'error',
        showConfirmButton: true,
        willClose: () => {
          window.location.reload();
        }
      })
    } else {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.message,
        icon: 'error'
      })
    };
    console.log('พบข้อผิดพลาดในการบันทึกรายการรีวิว:' + error);
    return [];
  }
};
//============================ Fraud Report  ======================================
export const addFRAUD_REPORT = async (data: any) => {
  const apiUrl = `${PortBackend}/addFRAUD_REPORT`;
  try {
    const response = await axios.post(apiUrl, data);
    Swal.fire({
      title: 'บันทึกรายการสำเร็จ',
      text: 'ระบบจะตรวจสอบรายการของท่าน ขอบคุณที่ร่วมเป็นส่วนหนึ่งที่ทำให้ชุมชน Yakkai น่าอยู่ยิ่งขึ้น',
      icon: 'success',
      showConfirmButton: true, // ไม่แสดงปุ่ม OK
      willClose: () => {
        window.location.reload();
      }
    })
    return response.data;
  } catch (error: any) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.message,
      icon: 'error'
    })
    console.log('พบข้อผิดพลาดในการบันทึกรายการรีวิว:' + error);
    return [];
  }
};
export const listFRAUD_REPORT = async () => {
  const apiUrl = `${PortBackend}/listFRAUD_REPORT`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูล Admin: ' + error);
    return [];
  }
};

//============================ Adverts  ======================================
export const Create_Ads = async (data: any) => {
  const apiUrl = `${PortBackend}/createAdvert`;
  try {
    const response = await axios.post(apiUrl, data);
    Swal.fire({
      icon: 'success',
      title: 'แนบหลักฐานการชำระเงินเสร็จสิ้น',
      text: 'ระบบจะแจ้งรายละเอียดทาง Email ให้คุณทราบ หลังจากทำการตรวจสอบข้อมูลการชำระเงินของคุณ',
      showCancelButton: false,
      width: '80%'
      // showConfirmButton: false,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    })
    return response.data;
  } catch (error: any) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.message,
      icon: 'error'
    })
    console.log('พบข้อผิดพลาดในการบันทึกหลักฐานการชำระเงิน:' + error);
    return [];
  }
};

export const ListAllAds = async () => {
  const apiUrl = `${PortBackend}/listAdvert`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึง Ads:' + error);
    return ({ ID: 0, P_ID: 0, Ad_CREATE_BILL: '', Ad_IMG: '', Ad_CHECKED: false, });
  }
};

export const getAdvertByProduct = async (ID: number | string) => {
  const apiUrl = `${PortBackend}/getAdvertByProduct/${ID}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูลสถานะ Ads:' + error);
    return ({ ID: 0, P_ID: 0, Ad_CREATE_BILL: '', Ad_IMG: '', Ad_CHECKED: false, });
  }
};
//=========================================================================

//============================ อื่น ๆ  ======================================
export const DeleteByID = async (ID: number, path: string) => {
  const apiUrl = `${PortBackend}/${path}/${ID}`;
  try {
    const response = await axios.delete(apiUrl);
    const res = response.data;
    if (res.status === true) {
      Swal.fire({
        title: 'ลบเสร็จสิ้น',
        text: '',
        icon: 'success'
      })
    } else {
      throw new Error("การลบล้มเหลว");
    }
    return response.data;
  } catch (error: any) {
    console.log('พบข้อผิดพลาดในการลบข้อมูล:' + error);
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.message,
      icon: 'error'
    })
    return [];
  }
};


//============================ admin  ======================================
export const listAdmins = async () => {
  const apiUrl = `${PortBackend}/List_admin`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูล Admin: ' + error);
    return [];
  }
};
//============================ Banner  ======================================
export const listData = async (path: string) => {
  const apiUrl = `${PortBackend}/${path}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูล Banner: ' + error);
    return [];
  }
};

//============================ Banner  ======================================
export const getDataWeb = async () => {
  const apiUrl = `${PortBackend}/getDataWeb/1`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูล เว็ปไซต์: ' + error);
    return [];
  }
};
