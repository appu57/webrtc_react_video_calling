import React, { useState, useContext, useRef } from 'react';
import FormInput from './FormInput';
import axios from 'axios';
import { UserContext } from '../socket/loginContext';
import {useNavigate} from 'react-router-dom';

const RegisterForm = ({ setUserLogin }) => {
    const [title, setTitle] = useState("Register");
    const navaigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let endpoint = title == "Register" ? "registerUser" : "loginUser"
        try {
            const response = await axios.post(`http://localhost:3000/users/${endpoint}`, formValues);
            if (response.data.status && title == "SignIn") {
                localStorage.setItem('userId',response.data.user._id);
                console.log(response.data.user._id);
                setUserLogin(response.data.user._id);
                navaigation('/home')
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const inputs = [
        {
            name: "username",
            type: "text",
            placeholder: "Username"
        },
        {
            name: "email",
            type: "email",
            placeholder: "Email"
        },
        {
            name: "password",
            type: "password",
            placeholder: "Password"
        },

    ]
    const [inputField, setInputField] = useState(inputs);//since the changes is rendered when there is a changes in the state  , or we can use useEffect
    const [formValues, setFormValues] = useState({
        username: "",
        email: "",
        password: ""
    });
    const onChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    }

    const addUserName = () => {
        let username = {
            name: "username",
            type: "text",
            placeholder: "Username"
        };
        title != "Register" ? inputField.unshift(username) : inputField.shift(username);//add username at first using unshift if title is register
        setTitle(title == "Register" ? "SignIn" : "Register");
    }
    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h4>{title} to explore Connect</h4>
                <hr></hr>
                {
                    inputField.map((input, index) => (
                        <FormInput key={index} {...input} onChange={onChange} />
                    ))}
                <button type="submit" className="registerbtn" >{title}</button>
                <div className="form-footer">
                    <p>{title == "Register" ? 'Already have an account ?' : 'New to Connect ?'} <span onClick={addUserName} className="navigateBtn">{title == "Register" ? 'SignIn' : 'Register'}</span></p>
                </div>
            </form>


        </div>
    );
}
export default RegisterForm;