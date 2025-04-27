var database = require("../config/database");
const crypto = require("crypto");
const response_code = require("./response-error-code");
const key = Buffer.from(process.env.HASH_KEY, 'hex');
const iv = Buffer.from(process.env.HASH_IV, 'hex');

class common{
    generateOtp(length){
        if(length <= 0){
            throw new Error("OTP length must be greater than 0");
        }
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    async get_blog_by_id(id){
        try{
            const [data] = await database.query(`SELECT blog_id, title, content FROM tbl_blogs where blog_id = ? and is_active = 1 and is_deleted = 0`, [id]);
            if(data.length === 0){
                return {
                    code: response_code.NOT_FOUND,
                    message: false,
                    data: null
                }
            } else{
                const blog_resp = {
                    blog_id: data[0].blog_id,
                    title: data[0].title,
                    content: data[0].content
                }

                return {
                    code: response_code.SUCCESS,
                    message: true,
                    data: blog_resp
                }
            }

        } catch(error){
            return {
                code: response_code.OPERATION_FAILED,
                message: error.message,
                data: null
            }
        }
    }

    generateToken(length){
        if(length <= 0){
            throw new Error("Token length must be greater than 0");
        }
        const alphaNumeric = '0123456789qwertyuiopasdfghjklzxcvbnm';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
        }
        return token;
    }

    async requestValidation(v) {
        if (v.fails()) {
            const Validator_errors = v.getErrors();
            const error = Object.values(Validator_errors)[0][0];
            return {
                code: true,
                message: error
            };
        } 
        return {
            code: false,
            message: ""
        };
    }

    async response(res, message){
        const encrypted = this.encrypt(message);
        return res.status(200).send(encrypted);
    }

    encrypt(requestData) {
        try {
            if (!requestData) {
                return null;
            }
            const data = typeof requestData === "object" ? JSON.stringify(requestData) : requestData;
            const cipher = crypto.createCipheriv('AES-256-CBC', key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            return encrypted;
        } catch (error) {
            console.error("Encryption error:", error);
            return error;
        }
    }

    decrypt(requestData) {
        try {
            if (!requestData) {
                return {};
            }
            const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);
            let decrypted = decipher.update(requestData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            console.log("--------- DECRYPT: ", decrypted);
            return this.isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
        } catch (error) {
            console.log("Error in decrypting: ", error);
            return requestData;
        }
    }

    isJson(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

}

module.exports = new common();