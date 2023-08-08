// import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const port = 8000; // พรอตหลังบ้าน


//==============================================================================================================================================================================================================
export const submit = (data: any, part: string) => {
  const apiUrl = `http://localhost:${port}/${part}`;

  axios
    .post(apiUrl, data)
    .then((response) => {
      const res = response.data;
      console.log(res);

      if (res.status === true) {
        Swal.fire({
          title: 'บันทึกสำเร็จ',
          icon: 'success',
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

  const apiUrl = `http://localhost:${port}/sendEmaiChangePassword/${email}`;
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

//======================================================== Update  Data  ==========================================================================================================================================
export const update = (data: any, part: string) => {
  const apiUrl = `http://localhost:${port}/${part}`;
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
              window.location.href = 'http://localhost:3000/Login'; 
            }
          })
        } else {
          Swal.fire({
            title: 'บันทึกรายการอัพเดตสำเร็จ',
            icon: 'success',
          })
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
  const apiUrl = `http://localhost:${port}/Check_Token`;
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: Token
      }
    });
    // console.log('Check_Token',response.data);
    return response.data;

  } catch (error) {
    console.log('พบข้อผิดพลาด:' + error);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    window.location.href = "http://localhost:3000/Login";
    return false;
  }
};

//==============================================================================================================================================================================================================
// ฟังก์ชันสำหรับอ่านข้อมูลจาก token และคืนค่าเป็น object ของข้อมูล
export const submitLogin = (data: any, part: string) => {
  const apiUrl = `http://localhost:${port}/${part}`;
  axios
    .post(apiUrl, data)
    .then((response) => {
      const res = response.data;
      // console.log(res);

      if (res.status === true) {



        localStorage.setItem('token', response.data.token);
        console.log(localStorage.getItem('token'));
        // console.log(response);
        interface DecodedToken { email: string; role: string; }
        const decoded: DecodedToken = jwt_decode(response.data.token);

        localStorage.setItem('email', decoded.email); //เก็บค่าที่อ่านได้จาก token ไว้ที่ client
        localStorage.setItem('role', decoded.role);

        Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ',
          // text: 'เรากำลังนำท่า',
          icon: 'success',
          showConfirmButton: false, // ไม่แสดงปุ่ม OK
          timer: 1500, // แสดง SweetAlert เป็นเวลา 1 วินาที
        }).then(() => {
          window.location.href = 'http://localhost:3000/'; // เมื่อหมดเวลา 1 วินาที จะเปลี่ยนหน้าไปที่ Home
        });
      }
      else {
        Swal.fire({
          title: 'เข้าสู่ระบบไม่สำเร็จ',
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
export const TP_VerifyEmail = (data: any, part: string) => {
  const apiUrl = `http://localhost:${port}/${part}`;

  axios
    .post(apiUrl, data)
    .then((response) => {
      const res = response.data;
      if (res.status === true) {
        Swal.fire({
          title: 'กรุณาใส่รหัส',
          text: `เราได้ส่ง รหัสยืนยันไปยัง ${data.U_EMAIL}`,
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          // showCancelButton: true,
          confirmButtonText: 'ตรวจสอบ',
          showLoaderOnConfirm: true,
          preConfirm: async (verifyCode) => {
            const email = data.U_EMAIL;
            try {
              const response = await axios.post(`http://localhost:8000/TP_VerifyEmail`, { //ส่ง email กับ รหัสยืนยันไปตรวจสอบ หลังบ้าน
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
              const response = await axios.post(`http://localhost:8000/createUser`, data); //ที่ backend จะตรวจสถานะ Verify ก่อนเพิ่มผู้ใช้
              if (!response.status) {
                throw new Error('บันทึกข้อมูลบุคคลไม่สำเร็จ');
              }

              // return response.data;
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
                window.location.href = 'http://localhost:3000/Login';
              }
              setTimeout(() => { window.location.href = 'http://localhost:3000/Login'; }, 1500);
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
export const listProduct = (part: string) => {
  const apiUrl = `http://localhost:${port}/${part}`;
  // const apiUrl = `http://localhost:8000/getProduct/1`;

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
type Category = {
  id: string;
  name: string;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const apiUrl = `http://localhost:${port}/listCategoryProduct`;
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
  const apiUrl = `http://localhost:${port}/getProductByMultipleConditions`;
  // console.log(filterData);
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
  const apiUrl = `http://localhost:${port}/getProduct/${ID}`;
  try {
    const response = await axios.get(apiUrl, ID);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูลสินค้า:' + error);
    return [];
  }
};

//============================ user  ======================================
export const getUserByID = async (ID: any) => {
  const apiUrl = `http://localhost:${port}/getUser/${ID}`;
  try {
    const response = await axios.get(apiUrl, ID);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูลขาย:' + error);
    return [];
  }
};
export const getUserByEmail = async (email: any) => {
  const apiUrl = `http://localhost:${port}/getUserByEmail`;
  try {
    const response = await axios.post(apiUrl, email);
    return response.data;
  } catch (error) {
    console.log('พบข้อผิดพลาดในการดึงข้อมูลขาย:' + error);
    return [];
  }
};



