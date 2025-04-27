"use client";
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { create_blog, fetchTags } from "../store/slice/BlogSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function CreateBlog() {
    const dispatch = useDispatch();
    const router = useRouter();

    const tags = useSelector((state) => state.blogs.tags);
    const loading = useSelector((state) => state.blogs.loading);
    const error = useSelector((state) => state.blogs.error);

    const initialState = {
        title: '',
        content: '',
        tags: [],
    }

    const validate = Yup.object({
        title: Yup.string().trim().required("Title is Required"),
        content: Yup.string().trim().required("Content is Required"),
    });

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const data = {
                title: values.title,
                content: values.content,
                tags: values.tags.map((tag) => parseInt(tag, 10)),
            }
            console.log(data);
            const result = await dispatch(create_blog(data));
            if (result.meta.requestStatus === "fulfilled") {
                resetForm();
                router.push("/");
            } else {
                console.error('Failed to create blog:', result.error.message);
            }
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>

            <Formik
                initialValues={initialState}
                validationSchema={validate}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Title</label>
                            <Field
                                type="text"
                                name="title"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage
                                name="title"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">Content</label>
                            <Field
                                as="textarea"
                                name="content"
                                rows="5"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage
                                name="content"
                                component="div"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Tags</label>
                            {tags && tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tags[0].map((tag, index) => (
                                        <label key={index} className="flex items-center">
                                            <Field
                                                checked={values.tags.includes(tag.tag_id)}
                                                type="checkbox"
                                                name="tags"
                                                value={tag.tag_id}
                                                onChange={() => {
                                                    const newTags = values.tags.includes(tag.tag_id)
                                                        ? values.tags.filter(id => id !== tag.tag_id)
                                                        : [...values.tags, tag.tag_id];
                                                    setFieldValue("tags", newTags);
                                                }}
                                            />
                                            <span className="ml-2">{tag.tag_name}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p>Loading tags...</p>
                            )}

                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {isSubmitting ? "Submitting..." : "Create Blog"}
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    )
}