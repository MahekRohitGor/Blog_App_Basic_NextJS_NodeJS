"use client";
import { show_details } from "../../store/slice/BlogSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";
import { use } from "react";

export default function BlogsById({params}){
    const { id } = use(params);
    const dispatch = useDispatch();
    const blog = useSelector((state) => state.blogs.blog);

    useEffect(()=>{
        dispatch(show_details(id));
    }, [dispatch, id]);

    console.log(blog[0]);

    return (
        <div>
            {blog && 
                <div className="bg-indigo-950 text-white p-5 m-4">
                    <h1 className="text-3xl">{blog?.title}</h1>
                    <p>{blog?.content}</p>
                </div>
            }
            <Link href="/" className="m-5 p-3 bg-indigo-950 text-white">Back</Link>
        </div>
    );
}