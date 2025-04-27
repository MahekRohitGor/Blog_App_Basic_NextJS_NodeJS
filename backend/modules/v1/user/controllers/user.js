var userModel = require("../models/user_model");
var common = require("../../../../utilities/common");

class User{

    async add_blog(req, res) {
        const requested_data = req.body;
        try {
            const request_data = common.decrypt(requested_data);
            const response_data = await userModel.add_blog(request_data);
            console.log("Response Data from DB:", response_data);
            await common.response(res, response_data);
        } catch (error) {
            console.error("Error in adding blog:", error);
            return res.status(400).json({ error: "Invalid Encrypted Data", details: error.message });
        }
    }
    

    async list_blog(req,res){
        const requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const response_data = await userModel.list_blog(request_data);
            await common.response(res, response_data);

        } catch(error){
            console.error("Error in Lisitng blog:", error);
            return res.status(400).json({ error: "Invalid Encrypted Data", details: error.message });
        }
        
    }

    async delete_blog(req,res){
        const requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const response_data = await userModel.delete_blog(request_data);
            await common.response(res, response_data);
        } catch(error){
            console.error("Error in Deleting blog:", error);
            return res.status(400).json({ error: "Invalid Encrypted Data", details: error.message });
        }
    }

    async get_blog_id(req,res){
        const id = req.params.id;
        try{
            const response_data = await userModel.blog_by_id(id);
            await common.response(res, response_data);
        } catch(error){
            console.error("Error in Deleting blog:", error);
            return res.status(400).json({ error: "Invalid Encrypted Data", details: error.message });
        }
    }

    async update_blog(req,res){
        const requested_data = req.body;
        const id = req.params.id;
        try{
            const request_data = common.decrypt(requested_data);
            const response_data = await userModel.edit_blog(request_data, id);
            await common.response(res, response_data);
        } catch(error){
            console.error("Error in Updating blog:", error);
            return res.status(400).json({ error: "Invalid Encrypted Data", details: error.message });
        }
    }

    async get_tags(req,res){
        try{
            const response_data = await userModel.get_tags();
            await common.response(res, response_data);
        } catch(error){
            console.error("Error in Fetching Tags: ", error);
            return res.status(400).json({ error: "Invalid Encrypted Data", details: error.message });
        }
    }
}


module.exports = new User();