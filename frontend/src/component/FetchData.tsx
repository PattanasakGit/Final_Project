// import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2' // Alert text --> npm install sweetalert2
const port = 8000;

export const submit = (data:any,part:string) => {

    const apiUrl = `http://localhost:${port}/${part}`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    };
    fetch(apiUrl, requestOptions)
    
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.status === true) {

          Swal.fire({
            title: 'บันทึกสำเร็จ',
            icon: 'success'
          });

        } else {
          Swal.fire({
            title: 'บันทึกไม่สำเร็จ',
            text: res.error,
            icon: 'error'
          });
        
        }
      });
  };