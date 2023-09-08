const mongoose = require('mongoose');
const { Schema } = mongoose;
const { insertData, getNextDataId, getToken_check } = require('../database/Database.js');
var str_collection = "Token";
const jwt = require('jsonwebtoken');

const TokenSchema = new Schema({
    ID: { type: Number, required: true, unique: true },
    Token: { type: String },
    EMAIL: { type: String },
    role: { type: String }
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, TokenSchema);

async function addToken(Token_input, email, role) {
    const Data = {
        ID: "",
        Token: Token_input,
        EMAIL: email,
        role: role
    };
    try {
        Data.ID = await getNextDataId(DataModel);

        await insertData(Data, DataModel);

        console.log('Token added successfully');
    } catch (error) {
        console.error('Failed to insert Token:', error);
    }
}

async function Token(req, res) {
    try {
        const token = req.headers.authorization;

        // ตรวจสอบและแยก payload จาก JWT เพื่อดึงค่าเวลาหมดอายุของ token
        let decodedToken = "";
        try {
            decodedToken = jwt.decode(token);
        } catch (error) {
            decodedToken = "";
        }
        // ตรวจสอบว่า token ยังคงใช้งานได้หรือไม่
        if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
            return res.status(401).json({ status: false, message: 'Token has expired' });
        }
        // ค้นหา token ในฐานข้อมูล
        const tokenData = await getToken_check(token, DataModel);

        if (tokenData) {
            // console.log(tokenData); //จะแสดงทุกครั้เมื่อมีการ ตรวจสอบ Token
            // ตรวจสอบเส้นทางของ token โดยตรวจสอบข้อมูลเพิ่มเติมจาก tokenData และจัดการตามที่ต้องการ
            // ส่งข้อมูลต่างๆ ที่เกี่ยวข้องกับ token กลับไปยัง Frontend
            return res.json({ status: true, message: 'Token OK', data: tokenData });
        } else {
            return res.status(404).json({ status: false, message: 'Token not found on the server' });
        }
    } catch (error) {
        console.error('Failed to verify token:', error);
        return res.status(500).json({ status: false, error: 'Internal server error' });
    }
}
module.exports = {
    Token,
    addToken,
};
