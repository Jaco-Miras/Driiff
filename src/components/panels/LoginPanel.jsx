import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {$_GET, getThisDeviceInfo} from "../../helpers/commonFunctions";
import {getSlugName, processDriffLogin} from "../../helpers/slugHelper";
import {userLogin} from "../../redux/actions/actions";
import {userGoogleLogin} from "../../redux/actions/userAction";

const Wrapper = styled.form`
    ${props => props.error !== "" &&
    `&:before {        
        content: "${props.error}";
        display: block;
        color: red;
        margin-top: -20px;
        text-align: left;
        margin-left: 0;
        margin-bottom: 0.5rem;
    }`}
    
    ${props => props.success !== "" &&
    `&:before {        
        content: "${props.success}";
        display: block;
        color: #59a869;
        margin-top: -20px;
        text-align: left;
        margin-left: 0;
        margin-bottom: 0.5rem;
    }`}    
`;

const FormGroup = styled.div`
    ${props => props.error !== "" &&
    `&:after {        
        content: "${props.error}";
        display: block;
        color: red;
        margin-top: -20px;
        text-align: left;
        margin-left: 13px;
    }`}
`;

const LoginPanel = (props) => {

    const dispatch = useDispatch();

    const ref = {
        email: useRef(),
        password: useRef(),
    };

    const [form, setForm] = useState({
        email: "",
        password: "",
        remember_me: true,
    });

    const [error, setError] = useState({
        email: "",
        password: "",
    });

    const [formMessage, setFormMessage] = useState({
        error: "",
        success: "",
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
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSignIn = (e) => {
        e.preventDefault();

        let valid = true;
        let errorData = {email: "", password: "", form: ""};

        if (form.email === "") {
            valid = false;
            errorData = {...errorData, email: "Email is required."};
        }

        if (form.password === "") {
            valid = false;
            errorData = {...errorData, password: "Password is required."};
        }

        setError(errorData);
        setFormMessage({error: "", success: ""});

        if (valid !== true) {
            if (errorData.email !== "") {
                ref.email.current.focus();
            } else if (errorData.password !== "") {
                ref.password.current.focus();
            }
        } else {
            const device = getThisDeviceInfo();
            let payload = {
                ...form,
                serial: device.serial,
                device: device.device,
                browser: device.browser,
            };

            let acceptedParams = [
                "first_name",
                "slug",
                "free_account",
                "topic_id",
                "topic_name",
                "slug_from",
                "invited_by",
                "invited_by_id"];

            for (let i = 0; i < acceptedParams.length; i++) {
                let name = acceptedParams[i];
                let value = $_GET(name) ? $_GET(name) : "";

                if (value) {
                    payload = {
                        ...payload,
                        [name]: value,
                    };
                }
            }

            dispatch(
                userLogin(payload, (err, res) => {
                    if (err) {
                        setFormMessage({...formMessage, error: "Invalid email or password."});
                        ref.email.current.focus();
                    }

                    if (res) {
                        if (res.data.message && res.data.message === "need_verify_via_email") {
                            setFormMessage({...formMessage, success: "Login successful! A code was sent to your email for further verification."});
                            let cb = {
                                key: new Date().getTime(),
                                type: "modal",
                                modal: "modal_login_verification",
                                title: `Two-step verification`,
                                children: "",
                                dataSet: res.data,
                                callback: {
                                    handleVerify: this.loginCodeVerify,
                                    handleResend: this.loginCodeResend,
                                },
                            };
                            console.log(cb);
                            //openModalAction(cb);
                        } else {
                            setFormMessage({...formMessage, success: "Login successful! A code was sent to your email for further verification."});

                            const returnUrl = (
                                (typeof props.location.state !== "undefined")
                                && (typeof props.location.state.from !== "undefined")
                                && (props.location.state.from !== "/logout")
                            ) ? props.location.state.from.pathname + props.location.state.from.search : "/chat";
                            processDriffLogin(res.data, returnUrl);
                        }
                    }
                }),
            );
        }
    };

    const handleGoogleLogIn = (e) => {
        e.preventDefault();

        dispatch(
            userGoogleLogin({
                driff: getSlugName(),
            }, (err, res) => {
                if (err) {
                    console.log(err);
                }
                if (res) {
                    setFormMessage({...formMessage, success: "Logging in Google..."});
                    window.location.href = res.data.google_url;
                }
            }),
        );
    };

    return (
        <Wrapper error={formMessage.error} success={formMessage.success}>
            <FormGroup className="form-group" error={error.email}>
                <input ref={ref.email} onChange={handleInputChange} name="email" type="email" className="form-control"
                       placeholder="Email" required autoFocus/>
            </FormGroup>
            <FormGroup className="form-group" error={error.password}>
                <input ref={ref.password} onChange={handleInputChange} name="password" type="password"
                       className="form-control"
                       placeholder="Password" required/>
            </FormGroup>
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
                    <a href="/" onClick={handleGoogleLogIn} className="btn btn-floating btn-google">
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