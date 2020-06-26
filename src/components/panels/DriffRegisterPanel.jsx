import React, {useEffect, useRef, useState} from "react";
import {withRouter} from "react-router-dom";
import {Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import styled from "styled-components";
import {isIPAddress} from "../../helpers/commonFunctions";
import {SvgIcon} from "../common";
import {useUserLogout} from "../hooks";

const Wrapper = styled.div`
    margin: 50px auto;
    max-width: 430px;
    .input-group {
        input {
            margin-bottom: 0 !important;
        }
    }
`;

const DriffRegisterPanel = (props) => {

    const {className = "", checkDriffName, setDriff} = props;
    const {REACT_APP_localDNSName} = process.env;
    const {logout} = useUserLogout(props);

    const refs = {
        name: useRef(null),
    };

    const [error, setError] = useState({
        name: null,
    });

    const [form, setForm] = useState({
        name: "",
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleContinue = (e) => {
        e.preventDefault();

        checkDriffName(form.name, (err, res) => {
            if (res && res.data.status) {
                if (isIPAddress(window.location.hostname) || window.location.hostname === "localhost") {
                    setDriff(form.name);
                } else {
                    window.location.href = `${process.env.REACT_APP_apiProtocol}${form.name}.${process.env.REACT_APP_localDNSName}`;
                }
            }
        });
    };

    useEffect(() => {
        document.body.classList.add("form-membership");
    }, []);

    return (
        <Wrapper className={`driff-register-panel fadeIn form-wrapper ${className}`}>
            <div id="logo">
                <SvgIcon icon={`driff-logo`} width="110" height="80"/>
            </div>

            <h5>Your driff</h5>
            <Form>
                <FormGroup className="form-group" error={error.name}>
                    <InputGroup>
                        <Input ref={refs.name} onChange={handleInputChange} name="name" type="text"
                               className="form-control"
                               placeholder="driff" required autoFocus/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>.{REACT_APP_localDNSName}</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
                <button className="btn btn-primary btn-block" onClick={handleContinue}>Continue</button>
            </Form>
        </Wrapper>
    );
};

export default withRouter(DriffRegisterPanel);