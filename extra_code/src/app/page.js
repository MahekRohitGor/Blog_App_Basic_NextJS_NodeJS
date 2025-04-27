"use client";
import { fetchBlogs, delete_blog } from "./store/slice/BlogSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handle_delete = (id) => {
    dispatch(delete_blog(id));
    dispatch(fetchBlogs());
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {blogs && blogs.length > 0 ? (
        <div className="space-y-6 mb-5">
          {blogs.map((blog) => (
            <div
              key={blog.blog_id}
              className="bg-indigo-950 text-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h1 className="text-2xl font-bold">{blog.title}</h1>
              <p className="mt-2">{blog.content}</p>
              <button onClick={() => handle_delete(blog.blog_id)} className="p-3 m-2 bg-white text-black">DELETE</button>
              <Link href={`/blogs/${blog.blog_id}`} className="bg-indigo-950 p-3 m-3 text-white rounded">Show</Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-black">No blogs available.</p>
      )}

      <Link href="/create" className="bg-indigo-950 p-3 m-3 text-white rounded">Create Blog</Link>
    </div>
  );
}
