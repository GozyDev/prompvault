"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from 'react-toastify'

type SignUpState = {
    name: string;
    email: string;
    password: string;
};

const SignUp: React.FC = () => {
    const [form, setForm] = useState<SignUpState>({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await signUpUser(form);
    };

    const signUpUser = async (data: SignUpState) => {
        try {
            const res = await fetch("https://api-prompvault-1.onrender.com/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            // Handle response as needed
            if (!res.ok) {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.error || "Something went wrong"}`);
            }
            else {
             const responseData = await res.json();
             toast.success("Sign up successful!");
             console.log("Response Data:", responseData);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Name:
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Email:
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <button type="submit" className="">Sign Up</button>
        </form>
    );
};

export default SignUp;