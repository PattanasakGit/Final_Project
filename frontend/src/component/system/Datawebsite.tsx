
import React, { useEffect, useState, } from 'react';
import { getDataWeb } from './HTTP_Request ';

let Default_DataWeb = {
    "W_NAME": "YakKai",
    "W_ADDR": "มหาวิทยาลัยเทคโนโลยีสุรนารี 111 ถนนมหาวิทยาลัย ตำบลสุรนารี อำเภอเมือง จังหวัดนครราชสีมา 30000",
    "W_CONTACT": "tel : 0988768438 \nEmail : Putjat145@gmail.com",
    "W_EMAIL": "Yakkai.th@gmail.com",
    "ABOUT_WEB": "****ทดสอบการเพิ่มข้อมูลเว็ปไซต์",
    "W_IMG": ""
    // "W_IMG": "https://firebasestorage.googleapis.com/v0/b/yakkai.appspot.com/o/images%2FSystem%2FLOGO_YaKKAI.png?alt=media&token=1410c18c-d307-4612-a1e4-30f21b6ee705"
}

function CheckDataWeb() {

    const fetchDataWeb = async () => {
        const DataWeb_from_backend = await getDataWeb();
        console.log('|---โหลดข้อมูลเว็ปไซต์---|');
        if (DataWeb_from_backend) {
            Default_DataWeb = DataWeb_from_backend
        }
    }
    useEffect(() => {
        fetchDataWeb();
    }, []);


    // const fetchDataWeb = async () => {
    //     if (!localStorage.getItem('DataWeb')) {
    //       console.log('|---โหลดข้อมูลเว็ปไซต์---|');
    //       const DataWeb_from_backend = await getDataWeb();
    //       if (DataWeb_from_backend) {
    //         localStorage.setItem('DataWeb', JSON.stringify(DataWeb_from_backend));
    //       }
    //     }
    //   }
    //   useEffect(() => {
    //     fetchDataWeb();
    // }, []);

    // useEffect(() => {
    //     const check_dataweb = () => {
    //         const dataWebJSON = localStorage.getItem('DataWeb');
    //         if (dataWebJSON) {
    //             const dataWebObject = JSON.parse(dataWebJSON);
    //             Default_DataWeb = dataWebObject;
    //         }
    //     }
    //     check_dataweb();
    // }, []);



    return (Default_DataWeb);
}

export default CheckDataWeb;
