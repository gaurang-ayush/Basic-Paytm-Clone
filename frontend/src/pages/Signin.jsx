import { BottomWarning } from "../Components/BottomWarning";
import { Button } from "../Components/Button";
import { Heading } from "../Components/Heading";
import { SubHeading } from "../Components/SubHeading";
import { InputBox } from "../Components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const Signin = ()=>{
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"}/>
                <SubHeading label={"Enter your credentials to access your account"}/>
                <InputBox onChange={(e)=>{
                    setEmail(e.target.value);
                }} placeholder={"Enter your Email"} label={"Email"} />
                <InputBox onChange={(e)=>{
                    setPassword(e.target.value);
                }} placeholder={"Enter your password"} label={"Password"}/>
                <div className="pt-4">
                <Button onClick={async () =>{
                    const response  =  await axios.post("http://localhost:3000/api/v1/user/signin" ,{
                        email,
                        password
                    });
                    localStorage.setItem("token",response.data.token);
                    navigate("/dashboard")
                } } local label={"Sign in"}/>
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"}/>
            </div>
        </div>
    </div>
}