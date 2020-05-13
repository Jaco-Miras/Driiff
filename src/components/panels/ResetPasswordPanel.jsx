import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.form`    
`;

const ResetPasswordPanel = () => {

    const [form, setForm] = useState({
        email: "",
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Wrapper>
            <div className="form-group">
                <input onChange={handleInputChange} name="email" type="email" className="form-control" placeholder="Email" required="" autoFocus/>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleSubmit}>Submit</button>
            <hr/>
            <p className="text-muted">Take a different action.</p>
            <Link className={`btn btn-sm btn-outline-light mr-1-1`} to="/register">Register now!</Link>
            or
            <Link className={`btn btn-sm btn-outline-light ml-1`} to="/login">Login!</Link>
        </Wrapper>
    );
};

export default React.memo(ResetPasswordPanel);