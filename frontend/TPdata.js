const products = [
    {
        P_NAME: "iPhone 13 Pro Max",
        P_CATEGORY: "Smartphone",
        P_PRICE: 499,
        P_TEXT: "iPhone 13 Pro Max สุดยอดสมาร์ทโฟนแห่งปี มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: [
            "https://img.kaidee.com/prd/20230721/368175113/m/837947ec-257c-4319-8fc8-541b2a8aa432.jpg",
            "https://support.apple.com/library/APPLE/APPLECARE_ALLGEOS/SP848/iphone13-pro-max-colors-480.png",
            "https://www.spigen.com/cdn/shop/products/detail_ip67p_la_navy_05_500x@2x.progressive.jpg?v=1631900889"
          ],
        P_PHONE: "021234567",
        P_TYPE: "สินค้ามือ 2",
        P_STATUS: "กำลังประกาศขาย",
        U_ID: 1
    },
    {
        P_NAME: "ipad",
        P_CATEGORY: "Smartphone",
        P_PRICE: 99,
        P_TEXT: "ipad สุดยอดสมาร์ทโฟนแห่งปี มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: ["https://img.kaidee.com/prd/20230721/368174941/m/ff03763f-2e94-4f88-902c-1af0e4c0ad1d.jpg"],
        P_PHONE: "021234567",
        P_TYPE: "สินค้ามือ 1",
        P_STATUS: "กำลังประกาศขาย",
        U_ID: 1
    },
    {
        P_NAME: "ลำโพง",
        P_CATEGORY: "Smartphone",
        P_PRICE: 399,
        P_TEXT: "ลำโพง มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: ["https://img.kaidee.com/prd/20230721/368174028/m/47cc1018-7290-4f81-bb94-34f5663ee1ad.jpg"],
        P_PHONE: "021234567",
        P_TYPE: "สินค้ามือ 2",
        P_STATUS: "กำลังประกาศขาย",
        U_ID: 1
    },
    {
        P_NAME: "ปากกา",
        P_CATEGORY: "Smartphone",
        P_PRICE: 20,
        P_TEXT: "iPhone 13 Pro Max สุดยอดสมาร์ทโฟนแห่งปี มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: ["https://img.kaidee.com/prd/20230722/368177400/m/ea315f60-1b5e-49bf-bd35-6102039e1f00.jpg"],
        P_PHONE: "021234567",
        P_TYPE: "สินค้ามือ 1",
        P_STATUS: "กำลังประกาศขาย",
        U_ID: 1
    },
    {
        P_NAME: "คอนโด 1 ",
        P_CATEGORY: "Home",
        P_PRICE: 600000,
        P_TEXT: "ที่อยู่",
        P_IMG: ["https://img.kaidee.com/prd/20230701/368095791/m/e3f7a81e-e33b-4d8b-a058-ba491e945de2.jpg"],
        P_PHONE: "021234567",
        P_TYPE: "สินค้ามือ 1",
        P_STATUS: "กำลังประกาศขาย",
        U_ID: 1
    },
    {
        P_NAME: "คอนโด 2 ",
        P_CATEGORY: "Home",
        P_PRICE: 900000,
        P_TEXT: "ที่อยู่",
        P_IMG: ["https://img.kaidee.com/prd/20230721/368175488/m/0dfd4640-a069-4c19-bc46-fa00eba45774.jpg"],
        P_PHONE: "021234567",
        P_TYPE: "สินค้ามือ 1",
        P_STATUS: "รอตรวจสอบ",
        U_ID: 1
    },
    {
        P_NAME: "คอนโด 3 ",
        P_CATEGORY: "Home",
        P_PRICE: 100000,
        P_TEXT: "ที่อยู่",
        P_IMG: ["https://img.kaidee.com/prd/20230703/368101748/m/3a02ca4c-ce4d-4357-a5ec-86c077ae35bc.jpg"],
        P_PHONE: "021234567",
        P_TYPE: "สินค้ามือ 2",
        P_STATUS: "ยกเลิกประกาศขาย",
        U_ID: 1
    },

];

//================================================================================================================



const DATA = [
    {
        CP_NAME: "Home",
        CP_ICON: "https://img.icons8.com/?size=512&id=gJEALNDj4J5j&format=png"
    },
    {
        CP_NAME: "smart",
        CP_ICON: "https://img.icons8.com/?size=512&id=ucDmdolNWVSa&format=png"
    },
    {
        CP_NAME: "สินค้ามือสอง",
        CP_ICON: "https://img.icons8.com/?size=512&id=12034&format=png"
    },
    {
        CP_NAME: "เสื้อผ้า",
        CP_ICON: "https://img.icons8.com/?size=512&id=38e2rijW2EqN&format=png"
    },
    {
        CP_NAME: "กางเกง",
        CP_ICON: "https://img.icons8.com/?size=512&id=16586&format=png"
    },
    {
        CP_NAME: "กระเป๋า",
        CP_ICON: "https://img.icons8.com/?size=512&id=sIguP1G6Ms0m&format=png"
    },
    {
        CP_NAME: "รองเท้า",
        CP_ICON: "https://img.icons8.com/?size=512&id=SBJjNvYuqycl&format=png"
    },
    {
        CP_NAME: "อุปกรณ์อิเล็กทรอนิกส์",
        CP_ICON: "https://img.icons8.com/?size=512&id=X54sJDVZjd5c&format=png"
    },
    {
        CP_NAME: "อุปกรณ์ตกแต่งบ้าน",
        CP_ICON: "https://img.icons8.com/?size=512&id=JWecsztbzjCS&format=png"
    },
    {
        CP_NAME: "อาหารและเครื่องดื่ม",
        CP_ICON: "https://img.icons8.com/?size=512&id=rv316gyK71QO&format=png"
    },
    {
        CP_NAME: "หนังสือ",
        CP_ICON: "https://img.icons8.com/?size=512&id=Fqihn9MGe0kQ&format=png"
    },
    {
        CP_NAME: "ดนตรี",
        CP_ICON: "https://img.icons8.com/?size=512&id=DkOgJ4APeev7&format=png"
    },
    {
        CP_NAME: "กีฬาและสันทนาการ",
        CP_ICON: "https://img.icons8.com/?size=512&id=WaqWKIMkdf06&format=png"
    },
    {
        CP_NAME: "การเดินทาง",
        CP_ICON: "https://img.icons8.com/?size=512&id=Pjn4ujEOB8wo&format=png"
    }
];

//============================================================================================================================    
import axios from 'axios';

const postProductData = async (product) => {
    try {
        const response = await axios.post('http://localhost:8000/createProduct', product);

        console.log('Data posted successfully:', response.data);
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

const postAllProducts = async () => {
    for (const product of products) {
        await postProductData(product);
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
};



const postCP = async (input) => {
    try {
        const response = await axios.post('http://localhost:8000/createCategoryProduct', input);

        console.log('Data posted successfully:', response.data);
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

const post_category = async () => {
    for (const new_data of DATA) {
        await postCP(new_data);
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
};



//================================================================================================================================


postAllProducts();
// post_category();