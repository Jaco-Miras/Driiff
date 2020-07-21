import React, {useCallback, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {$_GET, getThisDeviceInfo} from "../../helpers/commonFunctions";
import {EmailRegex} from "../../helpers/stringFormatter";
import {toggleLoading} from "../../redux/actions/globalActions";
import {userGoogleLogin, userLogin} from "../../redux/actions/userAction";
import {CheckBox, InputFeedback} from "../forms";
import {processBackendLogin, storeLoginToken, useToaster} from "../hooks";
import {getDriffName} from "../hooks/useDriff";
import {Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {SvgIconFeather} from "../common";

const Wrapper = styled.form`
  margin: 50px auto;
  max-width: 430px;  
`;

const FormGroup = styled.div`
    .form-control {
        margin-bottom: 0 !important;
    }
    .invalid-feedback {
        text-align: left;
    }
    .input-group-text {
      height: 36px;
    }
`;

const LoginPanel = (props) => {

    const dispatch = useDispatch();
    const toaster = useToaster();

    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const refs = {
        email: useRef(),
        password: useRef(),
    };

    const [form, setForm] = useState({
        email: "",
        password: "",
        remember_me: true,
    });

    const [formResponse, setFormResponse] = useState({
        valid: {},
        message: {},
    });

    const resetFormResponse = () => {
        setFormResponse({
            valid: {},
            message: {}
        });
    }

    const toggleCheck = (e) => {
        setForm({
            ...form,
            [e.target.dataset.name]: !form[e.target.dataset.name],
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
        resetFormResponse();

        let valid = true;
        let errorData = {email: "", password: "", form: ""};

        if (form.email === "") {
            valid = false;
            errorData = {...errorData, email: "Email is required."};
        } else if (!EmailRegex.test(form.email)) {
            valid = false;
            errorData = {...errorData, email: "Invalid email format."};
        }

        if (form.password === "") {
            valid = false;
            errorData = {...errorData, password: "Password is required."};
        }

        setFormResponse({
            valid: {
                email: errorData.email === "",
                password: errorData.password === "",
            },
            message: {
                email: errorData.email,
                password: errorData.password
            },
        });

        if (valid !== true) {
            if (errorData.email !== "") {
                refs.email.current.focus();
            } else if (errorData.password !== "") {
                refs.password.current.focus();
            }
        } else {
            const device = getThisDeviceInfo();
            let payload = {
                ...form,
                serial: device.serial,
                device: device.device,
                browser: device.browser,
            };

            let acceptedParams = ["first_name", "slug", "free_account", "topic_id", "topic_name", "slug_from", "invited_by", "invited_by_id"];

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

            dispatch(toggleLoading(true));

            dispatch(
                userLogin(payload, (err, res) => {
                    if (err) {
                        dispatch(toggleLoading(false));
                        setFormResponse(prevState => ({
                            ...prevState,
                            valid: {
                                email: false,
                                password: false,
                            },
                        }));
                        toaster.error(`Invalid email or password.`);
                        refs.email.current.focus();
                    }

                    if (res) {
                        if (res.data.message && res.data.message === "need_verify_via_email") {
                            toaster.success(`Login successful! A code was sent to your email for further verification.`);

                            let cb = {
                                key: new Date().getTime(),
                                type: "modal",
                                modal: "modal_login_verification",
                                title: "Two-step verification",
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
                            toaster.success(`Login successful!`);

                            const returnUrl =
                                typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
                                    ? props.location.state.from.pathname + props.location.state.from.search
                                    : "/workspace/chat";
                            storeLoginToken(res.data);
                            processBackendLogin(res.data, returnUrl);
                        }
                    }
                })
            );
        }
    };

    const handleGoogleLogIn = (e) => {
        e.preventDefault();

        dispatch(
            userGoogleLogin(
                {
                    driff: getDriffName(),
                },
                (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    if (res) {
                        toaster.notify(`Logging in via Google.`);
                        window.location.href = res.data.google_url;
                    }
                }
            )
        );
    };

    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility(prevState => !prevState);
    }, [setPasswordVisibility]);

    return (
        <Wrapper className="fadeIn">
            <FormGroup className="form-group">
                <Input
                    innerRef={refs.email}
                    onChange={handleInputChange}
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    required autoFocus
                    valid={typeof formResponse.valid.email === "undefined" ? null : formResponse.valid.email}
                    invalid={typeof formResponse.valid.email === "undefined" ? null : !formResponse.valid.email}

                    /*onFocus={handleNameFocus}
                    onBlur={handleNameBlur}
                    */
                />
                <InputFeedback valid={formResponse.valid.email}>{formResponse.message.email}</InputFeedback>
            </FormGroup>
            <FormGroup className="form-group">
                <InputGroup>
                    <Input
                        innerRef={refs.password}
                        name="password"
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                        defaultValue=""
                        type={passwordVisibility ? "text" : "password"}
                        valid={typeof formResponse.valid.password === "undefined" ? null : formResponse.valid.password}
                        invalid={typeof formResponse.valid.password === "undefined" ? null : !formResponse.valid.password}
                    />
                    <InputGroupAddon className="btn-toggle" addonType="append">
                        <InputGroupText className="btn" onClick={togglePasswordVisibility}>
                            <SvgIconFeather icon={passwordVisibility ? "eye-off" : "eye"}/>
                        </InputGroupText>
                    </InputGroupAddon>
                    <InputFeedback valid={formResponse.valid.password}>{formResponse.message.password}</InputFeedback>
                </InputGroup>
            </FormGroup>
            <div className="form-group d-flex justify-content-between">
                <CheckBox name="remember_me" checked={form.remember_me} onClick={toggleCheck}>
                    Remember me
                </CheckBox>
                <Link to="/reset-password">Reset password</Link>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleSignIn}>
                Sign in
            </button>
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
            <Link className={"btn btn-outline-light btn-sm"} to="/register">
                Register now!
            </Link>
        </Wrapper>
    );
};

export default React.memo(LoginPanel);
