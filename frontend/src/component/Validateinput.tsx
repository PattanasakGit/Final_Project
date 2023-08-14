

export const validateForm = (data:any) => {
  let  messageErrors = [];
  const fuullname = data.U_NAME.split(' ');
  var name = fuullname[0];
  var surname = fuullname[1];
  var gender = data.U_GENDER;
  var phone = data.U_PHONE;
  var email = data.U_EMAIL;
  var about = data.ABOUT_ME;
  // var password = data.pass;
  var password1 = data.pass1;
  var password2 = data.pass2;

  let isValid = false;

  // ตรวจสอบความถูกต้องของชื่อ
  if (name.trim() === '') {
    messageErrors.push('โปรดระบุชื่อ');
  }

  //ตรวจสอบความถูกต้องของนามสกุล
  else if (surname.trim() === '') {
    messageErrors.push('โปรดระบุนามสกุล');
    
  }

  // ตรวจสอบความถูกต้องของเพศ
  else if (gender === '') {
    messageErrors.push('โปรดระเพศ');
    
  }

  // ตรวจสอบความถูกต้องของเบอร์โทรศัพท์
  else if (phone.trim() === '' || phone.length != 10 || (!/^[0-9]{10}$/.test(phone)) ) {
    messageErrors.push('คุณระบุเบอร์โทรศัพท์ไม่ถูกต้อง');
    
  }

  // ตรวจสอบความถูกต้องของอีเมล
  else if (!/\S+@\S+\.\S+/.test(email)) {
    messageErrors.push('อีเมลของคุณไม่ถูกต้อง');
    
  }

  // ตรวจสอบความถูกต้องของข้อมูลเพิ่มเติม
  else if (about.length > 20000) {
    messageErrors.push('เพิ่มเติมความยามเกิน 20000 ตัวอักษร');
    
  }

  // ตรวจสอบความถูกต้องของรหัสผ่าน 1
  else if (password1.trim() === '') {
    messageErrors.push('โปรดระบุรหัสผ่าน');
    
  }
  // ตรวจสอบความถูกต้องของรหัสผ่าน 2
  else if (password2.trim() === '') {
    messageErrors.push('โปรดระบุรหัสผ่าน อีกครั้ง');
    
  }

  // ตรวจสอบความถูกต้องของรหัสผ่าน
  else if (password1!==password2) {
    messageErrors.push('รหัสผ่านไม่ตรงกัน');
    
  }
  else{
    isValid = true;
  }

  return { isValid, messageErrors};
};




export const validateCreateProduct = (data:any) => {
  let  messageErrors = [];
  var ProductName = data.P_NAME;
  var category = data.P_CATEGORY;
  var Price = data.P_PRICE;
  var phone = data.P_PHONE;
  var type = data.P_TYPE;
  let isValid = false;

  if (ProductName.trim() === '') {
    messageErrors.push('โปรดระบุชื่อสินค้า');
  }
  else if (category.trim() === '') {
    messageErrors.push('โปรดระบุหมวดหมู่สินค้า');
    
  }
  else if (type.trim() === '') {
    messageErrors.push('โปรดระบุประเภทสินค้า');
    
  }
  else if (Price === '' || Price ===null) {
    messageErrors.push('โปรดระบุจำนวนเงิน');
    
  }
  else if (phone.trim() === '' || phone.length != 10 || (!/^[0-9]{10}$/.test(phone)) ) {
    messageErrors.push('คุณระบุเบอร์โทรศัพท์ไม่ถูกต้อง');
    
  }
  else{
    isValid = true;
  }

  return { isValid, messageErrors};
};

