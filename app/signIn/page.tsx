
'use client';

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


type SignInState = {
    email: string;  
    password: string;
}

const SignIn = () => {
    const [form, setForm] = useState<SignInState>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

  

    const handleChange = (e: HTMLInputElement) => {
        const { name, value } = e;
        setForm(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await signInUser(form);
        setLoading(false);
    };

    const signInUser = async (data: SignInState) => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                toast.error(errorBody.error);
            } else {
                const dataBody = await response.json();
                toast.success('Sign in successful!');
                console.log(dataBody);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="border pt-[100px]">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Email:
                        <input type="email" name="email" value={form.email} onChange={(e) => handleChange(e.target)} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" name="password" value={form.password} onChange={(e) => handleChange(e.target)} />
                    </label>
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'login'}</button>
            </form>
        </div>
    );
};

export default SignIn;