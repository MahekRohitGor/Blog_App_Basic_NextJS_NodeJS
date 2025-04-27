const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const { t } = require('localizify');

class userModel{
        async add_blog(request_data){
            try{
                console.log("Req Data in model: ", request_data)
                const tags = request_data.tags;
                const blog_data = {
                    title: request_data.title,
                    content: request_data.content,
                    status: 1
                }
                const [data] = await database.query(`INSERT INTO tbl_blogs SET ?`, [blog_data]);
                const id = data.insertId;
                for (const tag of tags) {
                    const obj_tag = {
                        tag_id: tag,
                        blog_id: id
                    };
                    await database.query(`INSERT INTO tbl_tags_blog_rel SET ?`, obj_tag);
                }
                return {
                    code: response_code.SUCCESS,
                    message: t('blogs_add_success'),
                    data: id
                }

            } catch(error){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("user_already_exists_login"),
                    data: error.message
                }
            }
        }

        async list_blog(request_data){
            try{
                const [data] = await database.query(`SELECT blog_id, title, content from tbl_blogs where status = 1 and is_active = 1 and is_deleted = 0`);
                if(data.length > 0){
                    const response = []
                    data.map((res) => {
                        const resp = {
                            blog_id: res.blog_id,
                            title: res.title,
                            content: res.content
                        }
                        response.push(resp);
                    })

                    return {
                        code: response_code.SUCCESS,
                        message: "DATA FOUND",
                        data: response
                    }
                } else{
                    return {
                        code: response_code.NOT_FOUND,
                        message: "NOT FOUND",
                        data: []
                    }
                }

            } catch(error){
                console.log(error);
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "Some Error Occured",
                    data: error.message
                }
            }
        }

        async delete_blog(request_data){
            try{
                const blog_id = request_data?.blog_id;
                if(!blog_id){
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: "INVALID REQUEST FORMAT",
                        data: null
                    }
                } else{
                    const resp = await common.get_blog_by_id(blog_id);
                    if(resp.message && resp.data != null){
                        await database.query(`UPDATE tbl_blogs SET is_deleted = 1 WHERE blog_id = ?`, [blog_id]);
                        return {
                            code: response_code.SUCCESS,
                            message: "DELETED SUCCESSFULLY",
                            data: blog_id
                        }
                    } else{
                        return{
                            code: response_code.OPERATION_FAILED,
                            message: "Already Deleted or Blog Not Found",
                            data: null
                        }
                    }
                }
            } catch(error){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "SOME ERROR OCCURED",
                    data: error
                }
            }
        }

        async blog_by_id(id){
            try{
                const blog_id = id;
                if(!blog_id){
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: "INVALID REQUEST FORMAT",
                        data: null
                    }
                } else{
                    const [data] = await database.query(`SELECT blog_id, title, content from tbl_blogs where status = 1 and is_active = 1 and is_deleted = 0 and blog_id = ?`, [blog_id]);

                    if(data.length === 0){
                        return {
                            code: response_code.NOT_FOUND,
                            message: "NO BLOG FOUND",
                            data: data[0]
                        }
                    } else{
                        const resp = {
                            blog_id: data[0].blog_id,
                            title: data[0].title,
                            content: data[0].content
                        }
    
                        return {
                            code: response_code.SUCCESS,
                            message: "SUCCESS",
                            data: resp
                        }
                    }
                }
            } catch(error){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "SOME ERROR OCCURED",
                    data: error
                }
            }
        }

        async edit_blog(request_data, id){
            try{
                const blog_id = id;
                if(!blog_id){
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: "INVALID REQUEST FORMAT",
                        data: null
                    }
                } else{
                    const data = await common.get_blog_by_id(blog_id);
                    if(data.message && data.data !== null){
                        const updated_data = {};
                        if(request_data.title){
                            updated_data.title = request_data.title;
                        }
                        if(request_data.content){
                            updated_data.content = request_data.content;
                        }
                        if(request_data.status){
                            updated_data.status = request_data.status;
                        }

                        if(Object.keys(updated_data).length === 0){
                            return {
                                code: response_code.DATA_NOT_FOUND,
                                message: "NO DATA PROVIDED TO UPDATE",
                                data: updated_data
                            }
                        } else{
                            await database.query(`UPDATE tbl_blogs SET ? where blog_id = ?`, [updated_data, id]);

                            return {
                                code: response_code.SUCCESS,
                                message: "UPDATED SUCCESSFULLY",
                                data: updated_data
                            }
                        }
                    } else{
                        return {
                            code: response_code.OPERATION_FAILED,
                            message: "BLOG ID INVALID",
                            data: data.data
                        }
                    }
                }

            } catch(error){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "OPERATION FAILED",
                    data: error.message
                }
            }
        }

        async get_tags(){
            try{
                const [tags] = await database.query(`SELECT tag_id, tag_name from tbl_tags where is_active = 1 and is_deleted = 0`);
                if(tags.length === 0){
                    return{
                        code: response_code.NOT_FOUND,
                        message: "TAGS NOT FOUND",
                        data: null
                    }
                } else{
                    const resp_tags = tags.map((tag) => {
                        return {
                            tag_id: tag.tag_id,
                            tag_name: tag.tag_name
                        };
                    });

                    return {
                        code: response_code.SUCCESS,
                        message: "TAGS FOUND",
                        data: resp_tags
                    }
                }
            } catch(error){
                return {
                    code: response_code.OPERATION_FAILED,
                    message: "OPERATION FAILED",
                    data: error.message
                }
            }
        }
}

module.exports = new userModel();