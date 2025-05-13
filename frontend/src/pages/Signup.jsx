import { useState } from "react";
import { BottomWarning } from "../Components/BottomWarning";
import { Button } from "../Components/Button";
import { Heading } from "../Components/Heading";
import { InputBox } from "../Components/InputBox";
import { SubHeading } from "../Components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = ()=>{
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    return<div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign-up"}/>
                <SubHeading label={"Enter your details to create an account"} />
                <InputBox onChange={(e)=>{
                    setFirstName(e.target.value);
                }} placeholder={"Enter your first name"} label={"First Name"}/>
                <InputBox onChange={(e)=>{
                    setLastName(e.target.value);
                }} placeholder={"Enter your last name"} label={"Last Name"} />
                <InputBox onChange={(e)=>{
                    setUsername(e.target.value);
                }} placeholder={"Enter your Email-ID"} label={"Email"} />
                <InputBox onChange={(e)=>{
                    setPassword(e.target.value);
                }} placeholder={"Enter your Password"} label={"Password"}/>
                <div className="pt-4">
                <Button onClick={async () => {
                    try {
                        const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                            firstName,
                            lastName,
                            username,
                            password
                        });
                        localStorage.setItem("token", response.data.token);
                        navigate("/dashboard")
                        } catch (err) {
                        console.error("Signup error:", err);
                        alert(err?.response?.data?.message || "Signup failed");
                        }
                        }} label={"Sign up"} />

                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
            </div>
        </div>
    </div>
}