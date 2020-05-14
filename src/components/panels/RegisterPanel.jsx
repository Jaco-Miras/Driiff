import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.form`    
`;

const RegisterPanel = () => {

    const ref = {
        first_name: useRef(),
    };

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        ref.first_name.current.focus();

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <div className="form-group">
                <input ref={ref.first_name} onChange={handleInputChange} name="first_name" type="text"
                       className="form-control" placeholder="Firstname" required="" autoFocus/>
            </div>
            <div className="form-group">
                <input onChange={handleInputChange} name="last_name" type="text" className="form-control"
                       placeholder="Lastname" required=""/>
            </div>
            <div className="form-group">
                <input onChange={handleInputChange} name="email" type="email" className="form-control"
                       placeholder="Email" required=""/>
            </div>
            <div className="form-group">
                <input onChange={handleInputChange} name="password" type="password" className="form-control"
                       placeholder="Password" required=""/>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleRegister}>Register</button>
            <hr/>
            <p className="text-muted">Already have an account?</p>
            <Link className={`btn btn-outline-light btn-sm`} to="/login">Sign in!</Link>
        </Wrapper>
    );
};

export default React.memo(RegisterPanel);