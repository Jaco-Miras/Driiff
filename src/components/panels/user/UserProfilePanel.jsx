import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from "reactstrap";
import styled from "styled-components";
import {EmailRegex, replaceChar} from "../../../helpers/stringFormatter";
import {addToModals} from "../../../redux/actions/globalActions";
import {Avatar, SvgIcon, SvgIconFeather} from "../../common";
import {DropDocument} from "../../dropzone/DropDocument";
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

        .avatar {
            width: 68px;
            height: 68px;
        }

        input.designation {
            &::-webkit-input-placeholder {
                font-size: 12px;
            }
            &:-ms-input-placeholder {
                font-size: 12px;
            }
            &::placeholder {
                font-size: 12px;
            }
        }

        .col-label {
            max-width: 130px;

            @media only screen and (min-width: 1200px) {
                max-width: 180px;
            }
        }
    }

    .close {
        border-radius: 100%;
        padding: 2px;
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

    const history = useHistory();
    const dispatch = useDispatch();

    const toaster = useToaster();
    const {users, loggedUser} = useUsers();
    const {checkEmail, fetchById, getReadOnlyFields, getRequiredFields, update, updateProfileImage} = useUserActions();

    const user = users[props.match.params.id];
    const isLoggedUser = user && loggedUser.id === user.id;
    const readOnlyFields = getReadOnlyFields(user ? user.import_from : "");
    const requiredFields = getRequiredFields(user ? user.import_from : "");

    const [editInformation, setEditInformation] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [passwordUpdate, setPasswordUpdate] = useState(false);
    const [showDropZone, setShowDropZone] = useState(false);
    const [form, setForm] = useState(user && user.loaded ? user : {});
    const [formUpdate, setFormUpdate] = useState({
        valid: {},
        feedbackState: {},
        feedbackText: {},
    });

    const refs = {
        dropZoneRef: useRef(null),
        first_name: useRef(null),
        password: useRef(null),
    };

    const getValidClass = useCallback((valid) => {
        if (typeof valid !== "boolean") {

        } else {
            return valid ? "is-valid" : "is-invalid";
        }
    }, []);

    const togglePasswordUpdate = useCallback(() => {
        setPasswordUpdate(prevState => !prevState);
    }, [setPasswordUpdate]);

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

            if (name === "email") {
                if (requiredFields.includes(name) && value.trim() === "") {
                    setFormUpdate(prevState => ({
                        valid: {
                            ...prevState.valid,
                            [name]: false,
                        },
                        feedbackState: {
                            ...prevState.feedbackState,
                            [name]: false,
                        },
                        feedbackText: {
                            ...prevState.feedbackText,
                            [name]: `Email is required`,
                        },
                    }));


                } else if (value.trim() !== "" && !EmailRegex.test(value.trim())) {
                    setFormUpdate(prevState => ({
                        valid: {
                            ...prevState.valid,
                            [name]: false,
                        },
                        feedbackState: {
                            ...prevState.feedbackState,
                            [name]: false,
                        },
                        feedbackText: {
                            ...prevState.feedbackText,
                            [name]: `Invalid email format`,
                        },
                    }));


                } else {
                    checkEmail(form.email, (err, res) => {
                        if (res) {
                            if (res.data.status) {
                                setFormUpdate(prevState => ({
                                    valid: {
                                        ...prevState.valid,
                                        [name]: false,
                                    },
                                    feedbackState: {
                                        ...prevState.feedbackState,
                                        [name]: false,
                                    },
                                    feedbackText: {
                                        ...prevState.feedbackText,
                                        [name]: `Email is already taken`,
                                    },
                                }));
                            } else {
                                setFormUpdate(prevState => ({
                                    valid: {
                                        ...prevState.valid,
                                        [name]: true,
                                    },
                                    feedbackState: {
                                        ...prevState.feedbackState,
                                    },
                                    feedbackText: {
                                        ...prevState.feedbackText,
                                    },
                                }));
                            }
                        }
                    });
                }

            } else if (requiredFields.includes(name)) {
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
            toaster.error(`Some fields require your attention.`);
        } else if (Object.values(formUpdate.valid).find(v => v === true) === true) {
            if (form.profile_image_link !== user.profile_image_link) {
                updateProfileImage(form, formUpdate.feedbackText.profile_image_link, (err, res) => {
                    if (res) {
                        setEditInformation(false);
                    }
                });
            } else {
                update(form, (err, res) => {
                    if (res) {
                        setEditInformation(false);
                    }
                });
            }
        } else {
            toaster.info(`Nothing was updated.`);
            setEditInformation(false);
        }
    }, [form, formUpdate, update, setEditInformation]);

    const handleAvatarClick = () => {
        if (isLoggedUser) {
            refs.dropZoneRef.current.open();
        }
    };

    const handleShowDropZone = useCallback(() => {
        if (!showDropZone)
            setShowDropZone(true);
    }, [showDropZone, setShowDropZone]);

    const handleHideDropzone = useCallback(() => {
        setShowDropZone(false);
    }, [setShowDropZone]);

    const handleUseProfilePic = useCallback((file, fileUrl) => {
        setForm(prevState => ({
            ...prevState,
            profile_image_link: fileUrl,
        }));
        setFormUpdate(prevState => ({
            valid: {
                ...prevState.valid,
                profile_image_link: true,
            },
            feedbackState: {
                ...prevState.feedbackState,
            },
            feedbackText: {
                ...prevState.feedbackText,
                profile_image_link: file,
            },
        }));
        setEditInformation(true);
        toaster.info(<>Click the <b>Save Changes</b> button to update your profile image.</>);
    }, []);

    const dropAction = useCallback((uploadedFiles) => {
        if (uploadedFiles.length === 0) {
            toaster.error("File type not allowed. Please use an image file.");
        } else if (uploadedFiles.length > 1) {
            toaster.warning("Multiple files detected. First selected image will be used.");
        }

        let modal = {
            type: "file_crop_upload",
            imageFile: uploadedFiles[0],
            mode: "profile",
            handleSubmit: handleUseProfilePic,
        };

        dispatch(
            addToModals(modal, () => {
                handleHideDropzone();
            }),
        );
    }, [handleUseProfilePic, handleHideDropzone]);

    const handleEmailClick = useCallback(() => {
        window.location.href = `mailto:${user.email}`;
    }, [user]);

    useEffect(() => {
        const selectedUser = users[props.match.params.id] ? users[props.match.params.id] : {};
        if (selectedUser.hasOwnProperty("loaded")) {
            if (form.id !== selectedUser.id)
                setForm(selectedUser);
        } else {
            fetchById(props.match.params.id);
        }
    }, [props.match.params.id, users, setForm]);

    useEffect(() => {
        if (props.match.params.mode === "edit") {
            if (form.id && loggedUser.id === form.id) {
                history.push(`/profile/${form.id}/${replaceChar(form.name)}`);
                setEditInformation(true);
            }
        }

        if (props.match.params.mode === "view") {
            if (form.id && loggedUser.id === form.id) {
                history.push(`/profile/${form.id}/${replaceChar(form.name)}`);
                setEditInformation(false);
            }
        }
    }, [form, props.match.params.mode]);

    if (!form.id) {
        return <></>;
    }
    return (
        <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
            <div className="row row-user-profile-panel">
                <div className="col-12 col-lg-5 col-xl-4">
                    <div className="card">
                        <div className="card-body text-center" onDragOver={handleShowDropZone}>
                            {
                                isLoggedUser &&
                                <DropDocument
                                    acceptType="imageOnly"
                                    hide={!showDropZone}
                                    ref={refs.dropZoneRef}
                                    onDragLeave={handleHideDropzone}
                                    onDrop={({acceptedFiles}) => {
                                        dropAction(acceptedFiles);
                                    }}
                                    onCancel={handleHideDropzone}
                                />
                            }
                            {
                                user.import_from === "gripp" &&
                                <SvgIcon
                                    className={editInformation ? "mb-2" : "mb-4"}
                                    width={500} height={40}
                                    icon="gripp-logo"/>
                            }
                            {
                                editInformation && user.import_from !== "driff" &&
                                <ImportWarning className="text-primary mb-3">
                                    The profile data is synchronized from an external source.<br/>
                                    Some fields cannot be edited.
                                </ImportWarning>
                            }
                            {
                                <Avatar
                                    className="mb-2"
                                    imageLink={form.profile_image_link}
                                    name={form.name}
                                    id={form.id}
                                    onClick={handleAvatarClick}
                                    noDefaultClick={true}
                                />
                            }
                            {
                                editInformation ?
                                <h5 className="mb-1">{form.first_name} {form.middle_name} {form.last_name}</h5>
                                                :
                                <h5 className="mb-1">{user.first_name} {user.middle_name} {user.last_name}</h5>
                            }
                            {
                                editInformation && !readOnlyFields.includes("designation") ?
                                <p className="text-muted small d-flex align-items-center mt-2">
                                    <Input
                                        style={{maxWidth: "320px", margin: "auto"}}
                                        placeholder="Job Title eg. Manager, Team Leader, Designer"
                                        className={`designation ${getValidClass(formUpdate.valid.designation)}`}
                                        name="designation"
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        defaultValue={user.designation}
                                    />
                                    <InputFeedback
                                        valid={formUpdate.feedbackState.designation}>{formUpdate.feedbackText.designation}</InputFeedback>
                                </p>
                                                                                           :
                                <p className="text-muted small">{user.designation}</p>
                            }
                            {
                                isLoggedUser &&
                                <>
                                    {
                                        editInformation ?
                                        <span className="btn btn-outline-primary" onClick={handleSave}>
                                            Save Changes
                                        </span>
                                                        :
                                        <span className="btn btn-outline-primary" onClick={toggleEditInformation}>
                                            <SvgIconFeather className="mr-2" icon="edit-2"/> Edit Profile
                                        </span>
                                    }
                                </>
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
                                        isLoggedUser &&
                                        <span onClick={toggleEditInformation} className="btn btn-outline-light btn-sm">
                                            <SvgIconFeather className="mr-2" icon="edit-2"/> Edit
                                        </span>
                                    }
                                </h6>
                                {
                                    user.first_name &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">First Name:</div>
                                        <div className="col col-form">
                                            {user.first_name}
                                        </div>
                                    </div>
                                }
                                {
                                    user.middle_name &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">Middle Name:</div>
                                        <div className="col col-form">
                                            {user.middle_name}
                                        </div>
                                    </div>
                                }
                                {
                                    user.last_name &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">Last Name:</div>
                                        <div className="col col-form">
                                            {user.last_name}
                                        </div>
                                    </div>
                                }
                                {
                                    user.id === loggedUser.id &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">Password</div>
                                        <div className="col col-form">
                                            *****
                                        </div>
                                    </div>
                                }
                                {
                                    user.role &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">Position:</div>
                                        <div className="col col-form">{user.role.name}</div>
                                    </div>
                                }
                                {
                                    user.place &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">City:</div>
                                        <div className="col col-form">
                                            {user.place}
                                        </div>
                                    </div>
                                }
                                {
                                    user.address &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">Address:</div>
                                        <div className="col col-form">{user.address}</div>
                                    </div>
                                }
                                {
                                    user.contact &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">Phone:</div>
                                        <div className="col col-form">{user.contact}</div>
                                    </div>
                                }
                                {
                                    user.email &&
                                    <div className="row mb-2">
                                        <div className="col col-label text-muted">Email:</div>
                                        <div className="col col-form cursor-pointer"
                                             onClick={handleEmailClick}>{user.email}</div>
                                    </div>
                                }
                            </div>
                                             :
                            <div className="card-body">
                                <h6 className="card-title d-flex justify-content-between align-items-center">
                                    Information
                                    <div>
                                        <span onClick={toggleEditInformation}
                                              className="close btn btn-outline-light btn-sm">
                                            <SvgIconFeather icon="x"/>
                                        </span>
                                    </div>
                                </h6>
                                <div className="row mb-2">
                                    <div className="col col-label text-muted">First Name:</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("first_name") ?
                                            <Label>{user.first_name}</Label>
                                                                                  :
                                            <>
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
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col col-label text-muted">Middle Name:</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("middle_name") ?
                                            <Label>{user.middle_name}</Label>
                                                                                   :
                                            <>
                                                <Input
                                                    className={getValidClass(formUpdate.valid.middle_name)}
                                                    name="middle_name"
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputBlur}
                                                    defaultValue={user.middle_name}/>
                                                <InputFeedback
                                                    valid={formUpdate.feedbackState.middle_name}>{formUpdate.feedbackText.middle_name}</InputFeedback>
                                            </>
                                        }
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col col-label text-muted">Last Name:</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("last_name") ?
                                            <Label>{user.last_name}</Label>
                                                                                 :
                                            <>
                                                <Input
                                                    className={getValidClass(formUpdate.valid.last_name)}
                                                    name="last_name"
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputBlur}
                                                    defaultValue={user.last_name}/>
                                                <InputFeedback
                                                    valid={formUpdate.feedbackState.last_name}>{formUpdate.feedbackText.last_name}</InputFeedback>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col col-label text-muted">Password</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("password") ?
                                            <Label>*****</Label>
                                                                                :
                                            <>
                                                <Label onClick={togglePasswordUpdate}
                                                       className={`cursor-pointer mb-0 ${!passwordUpdate ? "" : "d-none"}`}>Click
                                                    to
                                                    change your password.</Label>
                                                <FormGroup
                                                    className={`form-group-password mb-0 ${!!passwordUpdate ? "" : "d-none"}`}>
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
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col col-label text-muted">City:</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("place") ?
                                            <Label>{user.place}</Label>
                                                                             :
                                            <>
                                                <Input
                                                    className={getValidClass(formUpdate.valid.place)}
                                                    name="place"
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputBlur}
                                                    defaultValue={user.place}/>
                                                <InputFeedback
                                                    valid={formUpdate.feedbackState.place}>{formUpdate.feedbackText.place}</InputFeedback>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col col-label text-muted">Address:</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("address") ?
                                            <Label>
                                                {user.address}
                                            </Label>
                                                                               :
                                            <>
                                                <Input
                                                    className={getValidClass(formUpdate.valid.address)}
                                                    name="address"
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputBlur}
                                                    defaultValue={user.address}/>
                                                <InputFeedback
                                                    valid={formUpdate.feedbackState.address}>{formUpdate.feedbackText.address}</InputFeedback>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col col-label text-muted">Contact:</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("contact") ?
                                            <Label>{user.contact}</Label>
                                                                               :
                                            <>
                                                <Input
                                                    className={getValidClass(formUpdate.valid.contact)}
                                                    name="contact"
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputBlur}
                                                    defaultValue={user.contact}/>
                                                <InputFeedback
                                                    valid={formUpdate.feedbackState.contact}>{formUpdate.feedbackText.contact}</InputFeedback>
                                            </>
                                        }

                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col col-label text-muted">Email:</div>
                                    <div className="col col-form">
                                        {
                                            readOnlyFields.includes("email") ?
                                            <Label>{user.email}</Label>
                                                                             :
                                            <>
                                                <Input
                                                    type="email"
                                                    className={getValidClass(formUpdate.valid.email)}
                                                    name="email"
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputBlur}
                                                    defaultValue={user.email}/>
                                                <InputFeedback
                                                    valid={formUpdate.feedbackState.email}>{formUpdate.feedbackText.email}</InputFeedback>
                                            </>
                                        }
                                    </div>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between align-items-center mt-0">
                                    <div>&nbsp;</div>
                                    <div>
                                        <span onClick={handleSave} className="btn btn-primary mr-2">
                                            Save Changes
                                        </span>
                                        <span onClick={toggleEditInformation} className="btn btn-outline-light">
                                            Cancel
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Wrapper>);
};

export default React.memo(UserProfilePanel);