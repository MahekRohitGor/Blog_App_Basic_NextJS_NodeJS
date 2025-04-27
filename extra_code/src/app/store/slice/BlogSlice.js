const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');
import { encrypt, decrypt } from '../../utilities/encdec';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
    const response = await fetch('http://localhost:5000/v1/blog/list', {
        method: 'POST',
        headers: {
            "api-key": "P8OMC4cVxSxAghN6ebetQQ==",
            "Content-Type": "text/plain",
        }
    })
    const encryptedData = await response.text();
    const data_ = decrypt(encryptedData);
    return data_.data;
});

export const delete_blog = createAsyncThunk('blogs/deleteBlog', async (id) => {
    const response = await fetch(`http://localhost:5000/v1/blog/delete`, {
        method: 'POST',
        headers: {
            "api-key": "P8OMC4cVxSxAghN6ebetQQ==",
            "Content-Type": "text/plain",
        },
        body: encrypt(JSON.stringify({"blog_id": id})),
    });
    const encryptedData = await response.text();
    const data_ = decrypt(encryptedData);
    return data_.data;
});

export const show_details = createAsyncThunk('blogs/showBlog', async (id) => {
    const resp = await fetch(`http://localhost:5000/v1/blog/list/${id}`, {
        method: 'POST',
        headers: {
            "api-key": "P8OMC4cVxSxAghN6ebetQQ==",
            "Content-Type": "text/plain",
        }
    });
    console.log(resp);
    const encryptedData = await resp.text();
    const data_ = decrypt(encryptedData);
    console.log(data_.data);
    return data_.data;
});

export const create_blog = createAsyncThunk('blogs/createBlog', async (data) => {
    try{
        const resp = await fetch('http://localhost:5000/v1/blog/create', {
            method: 'POST',
            headers: {
                "api-key": "P8OMC4cVxSxAghN6ebetQQ==",
                "Content-Type": "text/plain",
            },
            body: encrypt(JSON.stringify(data)),
        });
        const encryptedData = await resp.text();
        const data_ = decrypt(encryptedData);
        return data_.data;
    } catch(error){
        console.error('Error creating blogs:', error);
        throw new Error('Failed creating blogs');
    }
    
});

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
    try {
        const response = await fetch('http://localhost:5000/v1/blog/get-tags', {
            method: 'POST',
            headers: {
                "api-key": "P8OMC4cVxSxAghN6ebetQQ==",
                "Content-Type": "text/plain",
            }
        });

        const encryptedData = await response.text();
        const data = decrypt(encryptedData);
        return data.data; 
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw new Error('Failed to fetch tags');
    }
});


export const edit_blog = createAsyncThunk('blogs/editBlog', async (data) => {
    const resp = fetch(`https://jsonplaceholder.typicode.com/posts/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    return resp;
})

const initialState = {
    blogs: [],
    blog: [],
    created_blog: [],
    tags: [],
    error: null,
    loading: false,
};

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(delete_blog.pending, (state) => {
                state.loading = true;
            })
            .addCase(delete_blog.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(delete_blog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(show_details.pending, (state) => {
                state.loading = true;
            })
            .addCase(show_details.fulfilled, (state, action) => {
                state.loading = false;
                state.blog = action.payload;

            }).addCase(show_details.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(create_blog.pending, (state) => {
                state.loading = true;
            })
            .addCase(create_blog.fulfilled, (state, action) => {
                state.loading = false;
                state.created_blog.push(action.payload);
            })
            .addCase(create_blog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(edit_blog.pending, (state) => {
                state.loading = true;
            })
            .addCase(edit_blog.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(edit_blog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchTags.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.loading = false;
                state.tags.push(action.payload);
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default blogSlice.reducer;