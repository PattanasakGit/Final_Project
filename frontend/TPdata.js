const products = [
    {
        P_NAME: "iPhone 13 Pro Max",
        P_CATEGORY: "Smartphone",
        P_PRICE: 49999,
        P_TEXT: "iPhone 13 Pro Max สุดยอดสมาร์ทโฟนแห่งปี มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: "https://img.kaidee.com/prd/20230721/368175113/m/837947ec-257c-4319-8fc8-541b2a8aa432.jpg",
        P_PHONE: "021234567",
        P_TYPE: "New",
        P_STATUS: 1,
        U_ID: 1
    },
    {
        P_NAME: "ipad",
        P_CATEGORY: "Smartphone",
        P_PRICE: 49999,
        P_TEXT: "ipad สุดยอดสมาร์ทโฟนแห่งปี มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: "https://img.kaidee.com/prd/20230721/368174941/m/ff03763f-2e94-4f88-902c-1af0e4c0ad1d.jpg",
        P_PHONE: "021234567",
        P_TYPE: "New",
        P_STATUS: 1,
        U_ID: 1
    },
    {
        P_NAME: "ลำโพง",
        P_CATEGORY: "Smartphone",
        P_PRICE: 49999,
        P_TEXT: "ลำโพง มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: "https://img.kaidee.com/prd/20230721/368174028/m/47cc1018-7290-4f81-bb94-34f5663ee1ad.jpg",
        P_PHONE: "021234567",
        P_TYPE: "New",
        P_STATUS: 1,
        U_ID: 1
    },
    {
        P_NAME: "ปากกา",
        P_CATEGORY: "Smartphone",
        P_PRICE: 49999,
        P_TEXT: "iPhone 13 Pro Max สุดยอดสมาร์ทโฟนแห่งปี มาพร้อมกล้องที่ทรงพลัง จอแสดงผลที่สวยงาม และแบตเตอรี่ที่ใช้งานได้ยาวนาน",
        P_IMG: "https://img.kaidee.com/prd/20230722/368177400/m/ea315f60-1b5e-49bf-bd35-6102039e1f00.jpg",
        P_PHONE: "021234567",
        P_TYPE: "New",
        P_STATUS: 1,
        U_ID: 1
    },
    {
        P_NAME: "คอนโด 1 ",
        P_CATEGORY: "Home",
        P_PRICE: 49999,
        P_TEXT: "ที่อยู่",
        P_IMG: "https://img.kaidee.com/prd/20230701/368095791/m/e3f7a81e-e33b-4d8b-a058-ba491e945de2.jpg",
        P_PHONE: "021234567",
        P_TYPE: "New",
        P_STATUS: 1,
        U_ID: 1
    },
    {
        P_NAME: "คอนโด 2 ",
        P_CATEGORY: "Home",
        P_PRICE: 49999,
        P_TEXT: "ที่อยู่",
        P_IMG: "https://img.kaidee.com/prd/20230721/368175488/m/0dfd4640-a069-4c19-bc46-fa00eba45774.jpg",
        P_PHONE: "021234567",
        P_TYPE: "New",
        P_STATUS: 1,
        U_ID: 1
    },
    {
        P_NAME: "คอนโด 3 ",
        P_CATEGORY: "Home",
        P_PRICE: 49999,
        P_TEXT: "ที่อยู่",
        P_IMG: "https://img.kaidee.com/prd/20230703/368101748/m/3a02ca4c-ce4d-4357-a5ec-86c077ae35bc.jpg",
        P_PHONE: "021234567",
        P_TYPE: "New",
        P_STATUS: 1,
        U_ID: 1
    },

];






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

postAllProducts();