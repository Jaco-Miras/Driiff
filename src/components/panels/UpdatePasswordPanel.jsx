import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useHistory, useRouteMatch} from "react-router-dom";
import styled from "styled-components";
import {toggleLoading} from "../../redux/actions/globalActions";
import {updatePassword, userGoogleLogin} from "../../redux/actions/userAction";
import {processBackendLogin, storeLoginToken} from "../hooks";
import {getDriffName} from "../hooks/useDriff";

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

const UpdatePasswordPanel = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const match = useRouteMatch("/resetpassword/:token/:email");

    const ref = {
        password: useRef(),
    };

    const [form, setForm] = useState({
        token: match.params.token,
        email: match.params.email,
        password: "",
    });

    const [error, setError] = useState({
        password: "",
    });

    const [formMessage, setFormMessage] = useState({
        error: "",
        success: "",
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const _validateForm = () => {
        setFormMessage({error: "", success: ""});

        let valid = true;
        let errorData = {password: "", form: ""};

        if (form.password === "") {
            valid = false;
            errorData = {...errorData, password: "Password is required."};
        }

        setError(errorData);

        if (valid !== true) {
            if (errorData.password !== "") {
                ref.password.current.focus();
            }
        }

        return valid;
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();

        if (!_validateForm(e)) {
            return false;
        }

        dispatch(
            toggleLoading(true),
        );

        dispatch(
            updatePassword(form, (err, res) => {
                if (err) {
                    dispatch(
                        toggleLoading(false),
                    );

                    console.log(err);

                    setFormMessage({...formMessage, error: "Invalid or expired token."});
                    setTimeout(() => {
                        history.push("/reset-password");
                    }, 5000);
                }

                if (res) {
                    setFormMessage({
                        ...formMessage,
                        success: "Password is updated you are successfully logged in!",
                    });

                    const returnUrl = (
                                          (typeof props.location.state !== "undefined")
                                          && (typeof props.location.state.from !== "undefined")
                                          && (props.location.state.from !== "/logout")
                                      ) ? props.location.state.from.pathname + props.location.state.from.search : "/workspace/dashboard";
                    storeLoginToken(res.data);
                    processBackendLogin(res.data, returnUrl);
                }
            }),
        );
    };

    const handleGoogleLogIn = (e) => {
        e.preventDefault();

        dispatch(
            userGoogleLogin({
                driff: getDriffName(),
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
            <FormGroup className="form-group" error="">
                <input onChange={handleInputChange} name="email" type="email" className="form-control"
                       placeholder="Email" value={form.email} readOnly/>
            </FormGroup>
            <FormGroup className="form-group" error={error.password}>
                <input ref={ref.password} onChange={handleInputChange} name="password" type="password"
                       className="form-control"
                       placeholder="Password" required autoFocus/>
            </FormGroup>
            <button className="btn btn-primary btn-block" onClick={handleUpdatePassword}>Update password</button>
            <hr/>
            <p className="text-muted">Login with your social media account.</p>
            <ul className="list-inline">
                <li className="list-inline-item">
                    <a href="/" onClick={handleGoogleLogIn} className="btn btn-floating btn-google">
                        <i className="fa fa-google"/>
                    </a>
                </li>
            </ul>
            <hr/>
            <p className="text-muted">Don't have an account?</p>
            <Link className={`btn btn-outline-light btn-sm`} to="/register">Register now!</Link>
        </Wrapper>
    );
};

export default React.memo(UpdatePasswordPanel);