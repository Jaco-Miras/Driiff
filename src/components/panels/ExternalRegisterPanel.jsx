import React, {useCallback, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {useToaster, useUserActions} from "../hooks";
import {useHistory} from "react-router-dom";
import {SvgIconFeather} from "../common";
import {InputFeedback} from "../forms";
import {EmailRegex} from "../../helpers/stringFormatter";
import {$_GET} from "../../helpers/commonFunctions";

const Wrapper = styled.form`
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

const ExternalRegisterPanel = (props) => {

    const history = useHistory();
    const userAction = useUserActions();
    const toaster = useToaster();
    const [init, setInit] = useState(true);
    const [loading, setLoading] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const refs = {
        first_name: useRef(),
    };

    const [form, setForm] = useState({
        user_id: 0,
        topic_id: 0,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [formResponse, setFormResponse] = useState({
        valid: {},
        message: {},
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let valid = true;
        let errorData = {email: "", password: "", form: ""};

        if (form.email === "") {
            valid = false;
            errorData = {...errorData, email: "Email is required."};
        } else if (!EmailRegex.test(form.email)) {
            valid = false;
            errorData = {...errorData, email: "Invalid email format."};
        }

        if (form.first_name === "") {
            valid = false;
            errorData = {...errorData, first_name: "First name is required."};
        }

        if (form.last_name === "") {
            valid = false;
            errorData = {...errorData, last_name: "Last name is required."};
        }

        if (form.password === "") {
            valid = false;
            errorData = {...errorData, password: "Password is required."};
        }

        setFormResponse({
            valid: {
                first_name: errorData.first_name === "",
                last_name: errorData.last_name === "",
                email: errorData.email === "",
                password: errorData.password === "",
            },
            message: {
                first_name: errorData.first_name,
                last_name: errorData.last_name,
                email: errorData.email,
                password: errorData.password
            },
        });

        return valid;
    }

    const resetFormResponse = () => {
        setFormResponse({
            valid: {},
            message: {}
        });
    }

    const handleAccept = (e) => {
        e.preventDefault();
        resetFormResponse();

        if (loading) {
            return;
        }
        setLoading(true);
        validateForm();

        userAction.updateExternalUser(form, (err, res) => {
            if (res) {
                toaster.success(`Login successful!`);

                const returnUrl =
                    typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
                        ? props.location.state.from.pathname + props.location.state.from.search
                        : "/workspace/chat";
                userAction.login(res.data.auth_login, returnUrl);
            }
        });
    };

    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility(prevState => !prevState);
    }, [setPasswordVisibility]);

    useEffect(() => {
        userAction.fetchStateCode($_GET("state_code"), (err, res) => {
            if (err) {
                history.push(`/login`);
            }

            if (res) {
                if (res.data.auth_login) {
                    toaster.success(`Activation successful!`);

                    const returnUrl =
                        typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
                            ? props.location.state.from.pathname + props.location.state.from.search
                            : "/workspace/chat";
                    userAction.storeLoginToken(res.data.auth_login);
                    userAction.processBackendLogin(res.data.auth_login, returnUrl);
                } else {
                    setForm(prevState => ({
                        ...prevState,
                        user_id: res.data.user.id,
                        topic_id: res.data.topic.id,
                        email: res.data.user.email
                    }))
                    setInit(false);

                    refs.first_name.current.focus();
                }
            }
        })

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (init)
        return <></>;

    return (
        <Wrapper>
            <FormGroup className="form-group">
                <Input
                    ref={refs.first_name} onChange={handleInputChange} name="first_name" type="text"
                    className="form-control" placeholder="First name"
                    valid={typeof formResponse.valid.first_name === "undefined" ? null : formResponse.valid.first_name}
                    invalid={typeof formResponse.valid.first_name === "undefined" ? null : !formResponse.valid.first_name}
                    required autoFocus/>
                <InputFeedback valid={formResponse.valid.first_name}>{formResponse.message.first_name}</InputFeedback>
            </FormGroup>
            <FormGroup className="form-group">
                <Input onChange={handleInputChange} name="middle_name" type="text" className="form-control"
                       placeholder="Middle name"/>
            </FormGroup>
            <FormGroup className="form-group">
                <Input
                    onChange={handleInputChange} name="last_name" type="text" className="form-control"
                    placeholder="Last name"
                    valid={typeof formResponse.valid.last_name === "undefined" ? null : formResponse.valid.last_name}
                    invalid={typeof formResponse.valid.last_name === "undefined" ? null : !formResponse.valid.last_name}
                    required/>
                <InputFeedback valid={formResponse.valid.last_name}>{formResponse.message.last_name}</InputFeedback>
            </FormGroup>
            <FormGroup className="form-group">
                <Input
                    value={form.email}
                    onChange={handleInputChange} name="email" type="email" className="form-control"
                    placeholder="Email"
                    valid={typeof formResponse.valid.email === "undefined" ? null : formResponse.valid.email}
                    invalid={typeof formResponse.valid.email === "undefined" ? null : !formResponse.valid.email}
                    required/>
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
            <button className="btn btn-primary btn-block" onClick={handleAccept}>
                Accept
            </button>
        </Wrapper>
    );
};

export default React.memo(ExternalRegisterPanel);
