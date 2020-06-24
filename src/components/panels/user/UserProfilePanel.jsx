import React, {useCallback, useEffect, useRef, useState} from "react";
import {FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from "reactstrap";
import styled from "styled-components";
import {Avatar, SvgIcon, SvgIconFeather} from "../../common";
import InputFeedback from "../../forms/InputFeedback";
import {useToaster, useUserActions, useUsers} from "../../hooks";

const Wrapper = styled.div`    
    overflow: auto;  
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    
    .row-user-profile-panel {
        justify-content: center;
    }
    
    label {
        padding: 5px 10px;
        border-radius: 6px;
        width: 100%;
    }
    
    .btn-toggle {
        &:hover {            
            .input-group-text {
                border: 1px solid #e1e1e1;
                background: #fff;
                color: #7a1b8b;
            }
        }
        .input-group-text {
            border: 1px solid #7a1b8b;
            background: #7a1b8b;
            color: #fff;
        }
        svg {
            cursor: pointer;
            cursor: hand;
        }
    }
`;

const ImportWarning = styled.div`
`;

const UserProfilePanel = (props) => {

    const {className = ""} = props;

    const toaster = useToaster();
    const {users, loggedUser} = useUsers();
    const {update, fetchById, getReadOnlyFields, getRequiredFields} = useUserActions();

    const user = users[props.match.params.id];
    const readOnlyFields = getReadOnlyFields(user ? user.import_from : "");
    const requiredFields = getRequiredFields(user ? user.import_from : "");

    const [editInformation, setEditInformation] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [passwordUpdate, setPasswordUpdate] = useState(false);
    const [form, setForm] = useState(user && user.loaded ? user : {});
    const [formUpdate, setFormUpdate] = useState({
        valid: {},
        feedbackState: {},
        feedbackText: {},
    });

    const refs = {
        first_name: useRef(null),
        password: useRef(null),
    };

    const getValidClass = useCallback((valid) => {
        if (typeof valid !== "boolean") {

        } else {
            return valid ? "is-valid" : "is-invalid";
        }
    }, []);

    //const [user, setUser] = useState(null);
    const togglePasswordUpdate = useCallback(() => {
        setPasswordUpdate(prevState => !prevState);
    }, [setPasswordUpdate]);

    // console.log(user)
    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility(prevState => !prevState);
    }, [setPasswordVisibility]);

    useEffect(() => {
        if (passwordUpdate && refs.password.current) {
            refs.password.current.focus();
        }
    }, [passwordUpdate, refs.password]);

    const toggleEditInformation = useCallback(() => {
        setEditInformation(prevState => !prevState);
        setForm({...user});
        setFormUpdate({
            valid: {},
            feedbackState: {},
            feedbackText: {},
        });
        setPasswordUpdate(false);
    }, [user, setForm, setPasswordUpdate, setEditInformation]);

    useEffect(() => {
        if (editInformation && refs.first_name.current) {
            refs.first_name.current.focus();
        }
    }, [editInformation, refs.first_name]);

    const handleInputChange = useCallback((e) => {
        if (e.target !== null) {
            const {name, value} = e.target;
            setForm(prevState => ({
                ...prevState,
                [name]: value.trim(),
            }));
        }
    }, []);

    const handleInputBlur = useCallback((e) => {
        if (e.target !== null) {
            const {name, value} = e.target;

            if (user[name] === form[name]) {
                setFormUpdate(prevState => ({
                    valid: {
                        ...prevState.valid,
                        [name]: undefined,
                    },
                    feedbackState: {
                        ...prevState.feedbackState,
                        [name]: undefined,
                    },
                    feedbackText: {
                        ...prevState.feedbackText,
                        [name]: undefined,
                    },
                }));
                return;
            }

            if (requiredFields.includes(name)) {
                setFormUpdate(prevState => ({
                    valid: {
                        ...prevState.valid,
                        [name]: value.trim() !== "",
                    },
                    feedbackState: {
                        ...prevState.feedbackState,
                        [name]: value.trim() !== "",
                    },
                    feedbackText: {
                        ...prevState.feedbackText,
                        [name]: value.trim() === "" ? `Field is required.` : "",
                    },
                }));
            } else {
                setFormUpdate(prevState => ({
                    valid: {
                        ...prevState.valid,
                        [name]: true,
                    },
                    feedbackState: prevState.feedbackState,
                    feedbackText: prevState.feedbackText,
                }));
            }
        }
    }, [user, form, requiredFields]);

    const handleSave = useCallback(() => {
        if (Object.values(formUpdate.valid).find(v => v === false) === false) {
            toaster.error(`Some fields require your attention.`,
                {position: "bottom-left"});
        } else if (Object.values(formUpdate.valid).find(v => v === true) === true) {
            update(form, (err, res) => {
                if (err) {
                }
                if (res) {
                    setEditInformation(false);
                }
            });
        } else {
            toaster.info(`Nothing was updated.`,
                {position: "bottom-left"});
            setEditInformation(false);
        }
    }, [form, formUpdate, update, setEditInformation]);

    useEffect(() => {
        const selectedUser = users[props.match.params.id] ? users[props.match.params.id] : {};
        if (selectedUser.hasOwnProperty("loaded")) {
            if (form.id !== selectedUser.id)
                setForm(selectedUser);
        } else {
            fetchById(props.match.params.id);
        }
    }, [props.match.params.id, users, setForm]);

    if (!form.id) {
        return <></>;
    }

    return (
        <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
            <div className="row row-user-profile-panel">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            {
                                user.import_from === "gripp" &&
                                <SvgIcon className="mb-2" width={500} height={40} icon="gripp-logo"/>
                            }
                            {
                                editInformation && user.import_from !== "driff" &&
                                <ImportWarning className="text-primary mb-3">
                                    The profile data is synchronized from an external source.<br/>
                                    Some fields cannot be edited.
                                </ImportWarning>
                            }
                            <Avatar
                                imageLink={user.profile_image_link}
                                name={user.name}
                                id={user.id}
                                noDefaultClick={true}
                            />
                            {
                                editInformation ?
                                <h5 className="mb-1">{form.first_name} {form.middle_name} {form.last_name}</h5>
                                                :
                                <h5 className="mb-1">{user.first_name} {user.middle_name} {user.last_name}</h5>
                            }
                            <p className="text-muted small">{user.role.name}</p>
                            {
                                loggedUser.id === user.id &&
                                <span className="btn btn-outline-primary" onClick={toggleEditInformation}>
                                    <SvgIconFeather className="mr-2" icon="edit-2"/> Edit Profile
                                </span>
                            }
                        </div>
                    </div>

                    <div className="card">
                        {
                            !editInformation ?
                            <div className="card-body">
                                <h6 className="card-title d-flex justify-content-between align-items-center">
                                    Information
                                    {
                                        loggedUser.id === user.id &&
                                        <span onClick={toggleEditInformation} className="btn btn-outline-light btn-sm">
                                            <SvgIconFeather className="mr-2" icon="edit-2"/> Edit
                                        </span>
                                    }
                                </h6>
                                {
                                    user.first_name &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">First Name:</div>
                                        <div className="col-6">
                                            {user.first_name}
                                        </div>
                                    </div>
                                }
                                {
                                    user.middle_name &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Middle Name:</div>
                                        <div className="col-6">
                                            {user.middle_name}
                                        </div>
                                    </div>
                                }
                                {
                                    user.last_name &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Last Name:</div>
                                        <div className="col-6">
                                            {user.last_name}
                                        </div>
                                    </div>
                                }
                                <div className="row mb-2">
                                    <div className="col-6 text-muted">Password</div>
                                    <div className="col-6">
                                        *****
                                    </div>
                                </div>
                                {
                                    user.role &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Position:</div>
                                        <div className="col-6">{user.role.name}</div>
                                    </div>
                                }
                                {
                                    user.place &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">City:</div>
                                        <div className="col-6">
                                            {user.place}
                                        </div>
                                    </div>
                                }
                                {
                                    user.address &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Address:</div>
                                        <div className="col-6">{user.address}</div>
                                    </div>
                                }
                                {
                                    user.phone &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Phone:</div>
                                        <div className="col-6">{user.phone}</div>
                                    </div>
                                }
                            </div>
                                             :
                            <div className="card-body">
                                <h6 className="card-title d-flex justify-content-between align-items-center">
                                    Information
                                    <div>
                                        <span onClick={handleSave} className="btn btn btn-outline-primary btn-sm mr-2">
                                            <SvgIconFeather className="mr-2" icon="save"/> Save
                                        </span>
                                        <span onClick={toggleEditInformation} className="btn btn-outline-light btn-sm">
                                            <SvgIconFeather className="mr-2" icon="x"/> Close
                                        </span>
                                    </div>
                                </h6>
                                {
                                    !readOnlyFields.includes("first_name") &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">First Name:</div>
                                        <div className="col-6">
                                            <Input
                                                className={getValidClass(formUpdate.valid.first_name)}
                                                innerRef={refs.first_name}
                                                name="first_name"
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                defaultValue={user.first_name}
                                            />
                                            <InputFeedback
                                                valid={formUpdate.feedbackState.first_name}>{formUpdate.feedbackText.first_name}</InputFeedback>
                                        </div>
                                    </div>
                                }
                                {
                                    !readOnlyFields.includes("middle_name") &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Middle Name:</div>
                                        <div className="col-6">
                                            <Input
                                                className={getValidClass(formUpdate.valid.middle_name)}
                                                name="middle_name"
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                defaultValue={user.middle_name}/>
                                            <InputFeedback
                                                valid={formUpdate.feedbackState.middle_name}>{formUpdate.feedbackText.middle_name}</InputFeedback>
                                        </div>
                                    </div>
                                }
                                {
                                    !readOnlyFields.includes("last_name") &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Last Name:</div>
                                        <div className="col-6">
                                            <Input
                                                className={getValidClass(formUpdate.valid.last_name)}
                                                name="last_name"
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                defaultValue={user.last_name}/>
                                            <InputFeedback
                                                valid={formUpdate.feedbackState.last_name}>{formUpdate.feedbackText.last_name}</InputFeedback>
                                        </div>
                                    </div>
                                }
                                {
                                    !readOnlyFields.includes("password") &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Password</div>
                                        <div className="col-6">
                                            <Label onClick={togglePasswordUpdate}
                                                   className={`cursor-pointer ${!passwordUpdate ? "" : "d-none"}`}>Click
                                                to
                                                change your password.</Label>
                                            <FormGroup
                                                className={`form-group-password ${!!passwordUpdate ? "" : "d-none"}`}>
                                                <InputGroup>
                                                    <Input
                                                        className={getValidClass(formUpdate.valid.password)}
                                                        innerRef={refs.password}
                                                        name="password"
                                                        onChange={handleInputChange}
                                                        onBlur={handleInputBlur}
                                                        defaultValue=""
                                                        type={passwordVisibility ? "text" : "password"}/>
                                                    <InputGroupAddon className="btn-toggle" addonType="append">
                                                        <InputGroupText className="btn"
                                                                        onClick={togglePasswordVisibility}>
                                                            <SvgIconFeather
                                                                icon={passwordVisibility ? "eye-off" : "eye"}/></InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <InputFeedback
                                                    valid={formUpdate.feedbackState.password}>{formUpdate.feedbackText.password}</InputFeedback>
                                            </FormGroup>
                                        </div>
                                    </div>
                                }
                                {
                                    !readOnlyFields.includes("place") &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">City:</div>
                                        <div className="col-6">
                                            <Input
                                                className={getValidClass(formUpdate.valid.place)}
                                                name="place"
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                defaultValue={user.place}/>
                                            <InputFeedback
                                                valid={formUpdate.feedbackState.place}>{formUpdate.feedbackText.place}</InputFeedback>
                                        </div>
                                    </div>
                                }
                                {
                                    !readOnlyFields.includes("address") &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Address:</div>
                                        <div className="col-6">
                                            <Input
                                                className={getValidClass(formUpdate.valid.address)}
                                                name="address"
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                defaultValue={user.address}/>
                                            <InputFeedback
                                                valid={formUpdate.feedbackState.address}>{formUpdate.feedbackText.address}</InputFeedback>
                                        </div>
                                    </div>
                                }
                                {
                                    !readOnlyFields.includes("phone") &&
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted">Phone:</div>
                                        <div className="col-6">
                                            <Input
                                                className={getValidClass(formUpdate.valid.phone)}
                                                name="phone"
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                defaultValue={user.phone}/>
                                            <InputFeedback
                                                valid={formUpdate.feedbackState.phone}>{formUpdate.feedbackText.phone}</InputFeedback>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Wrapper>);
};

export default React.memo(UserProfilePanel);