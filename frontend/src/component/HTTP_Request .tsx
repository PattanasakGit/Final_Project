// import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2
import axios from 'axios';

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
export const submitLogin = (data: any, part: string) => {
  const apiUrl = `http://localhost:${port}/${part}`;
  axios
    .post(apiUrl, data)
    .then((response) => {
      const res = response.data;
      console.log(res);

      if (res.status === true) {
        Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ',
          // text: 'เรากำลังนำท่า',
          icon: 'success',
          showConfirmButton: false, // ไม่แสดงปุ่ม OK
          timer: 1500, // แสดง SweetAlert เป็นเวลา 1 วินาที
        }).then(() => {
          window.location.href = 'http://localhost:3000/Home'; // เมื่อหมดเวลา 1 วินาที จะเปลี่ยนหน้าไปที่ /Home
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
      Swal.fire({
        title: error.response.data.message,
        icon: 'warning',
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







