const users = require("../controllers/user");

const user = (app) =>{
        app.post("/v1/blog/create", users.add_blog);
        app.post("/v1/blog/list", users.list_blog);
        app.post("/v1/blog/delete", users.delete_blog);
        app.post("/v1/blog/list/:id", users.get_blog_id);
        app.post("/v1/blog/update/:id", users.update_blog);
        app.post("/v1/blog/get-tags", users.get_tags);
}

module.exports = user;