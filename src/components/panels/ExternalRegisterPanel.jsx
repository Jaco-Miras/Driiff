import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";

const Wrapper = styled.form``;

const ExternalRegisterPanel = () => {

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

    const handleAccept = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        ref.first_name.current.focus();

        //$_GET("state_code")

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
            <button className="btn btn-primary btn-block" onClick={handleAccept}>
                Accept
            </button>
        </Wrapper>
    );
};

export default React.memo(ExternalRegisterPanel);
