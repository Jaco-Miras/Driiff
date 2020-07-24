import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {$_GET} from "../../helpers/commonFunctions";
import {Input} from "reactstrap";
import {useToaster, useUserActions} from "../hooks";
import {useHistory} from "react-router-dom";

const Wrapper = styled.form``;

const ExternalRegisterPanel = (props) => {

    const history = useHistory();
    const userAction = useUserActions();
    const toaster = useToaster();
    const [loading, setLoading] = useState(false);

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

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let valid = true;

        return valid;
    }

    const handleAccept = (e) => {
        e.preventDefault();
        if (loading) {
            return;
        }
        setLoading(true);

        userAction.updateExternalUser(form, (err, res) => {
            console.log(err);

            if (res) {
                toaster.success(`Login successful!`);

                const returnUrl =
                    typeof props.location.state !== "undefined" && typeof props.location.state.from !== "undefined" && props.location.state.from !== "/logout"
                        ? props.location.state.from.pathname + props.location.state.from.search
                        : "/workspace/chat";
                userAction.storeLoginToken(res.data.auth_login);
                userAction.processBackendLogin(res.data.auth_login, returnUrl);
            }
        });
    };

    useEffect(() => {
        refs.first_name.current.focus();

        userAction.fetchStateCode($_GET("state_code"), (err, res) => {
            if (err) {
                history.push(`/login`);
            }

            if (res) {
                if (res.data.auth_login) {
                    toaster.success(`Login successful!`);

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
                }
            }
        })

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <div className="form-group">
                <input ref={refs.first_name} onChange={handleInputChange} name="first_name" type="text"
                       className="form-control" placeholder="First name" required="" autoFocus/>
            </div>
            <div className="form-group">
                <input onChange={handleInputChange} name="middle_name" type="text" className="form-control"
                       placeholder="Middle name"/>
            </div>
            <div className="form-group">
                <input onChange={handleInputChange} name="last_name" type="text" className="form-control"
                       placeholder="Last name" required/>
            </div>
            <div className="form-group">
                <Input
                    value={form.email}
                    onChange={handleInputChange} name="email" type="email" className="form-control"
                    placeholder="Email" required=""/>
            </div>
            <div className="form-group">
                <Input
                    defaultValue={""}
                    onChange={handleInputChange} name="password" type="password" className="form-control"
                    placeholder="Password" required=""/>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleAccept}>
                Accept
            </button>
        </Wrapper>
    );
};

export default React.memo(ExternalRegisterPanel);
