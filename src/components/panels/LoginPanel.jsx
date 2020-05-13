import React, {useRef, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.form`    
`;

const LoginPanel = () => {

    const ref = {
        email: useRef(),
        password: useRef(),
    };

    const [form, setForm] = useState({
        email: "",
        password: "",
        remember_me: true,
    });

    const handleRememberMe = (e) => {
    };

    const toggleCheck = (e) => {
        setForm({
            ...form,
            remember_me: !form.remember_me,
        });
    };

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignIn = (e) => {
        e.preventDefault();
    };

    return (
        <Wrapper>
            <div className="form-group">
                <input ref={ref.email} onChange={handleInputChange} name="email" type="email" className="form-control"
                       placeholder="Email" required autoFocus/>
            </div>
            <div className="form-group">
                <input ref={ref.password} onChange={handleInputChange} name="password" type="password"
                       className="form-control"
                       placeholder="Password" required/>
            </div>
            <div className="form-group d-flex justify-content-between">
                <div className="custom-control custom-checkbox" onClick={handleRememberMe}>
                    <input name="remember_me" type="checkbox" className="custom-control-input"
                           checked={form.remember_me} onChange={handleRememberMe}/>
                    <label className="custom-control-label" data-name="remember_me" onClick={toggleCheck}>Remember
                        me</label>
                </div>

                <Link to="/reset-password">Reset password</Link>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleSignIn}>Sign in</button>
            <hr/>
            <p className="text-muted">Login with your social media account.</p>
            <ul className="list-inline">
                <li className="list-inline-item">
                    <a href="/" className="btn btn-floating btn-google">
                        <i className="fa fa-google"></i>
                    </a>
                </li>
            </ul>
            <hr/>
            <p className="text-muted">Don't have an account?</p>
            <Link className={`btn btn-outline-light btn-sm`} to="/register">Register now!</Link>
        </Wrapper>
    );
};

export default React.memo(LoginPanel);