import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { isValidPhoneNumber } from "react-phone-number-input";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import styled from "styled-components";
import { EmailRegex, replaceChar } from "../../../helpers/stringFormatter";
import { addToModals } from "../../../redux/actions/globalActions";
import { Avatar, SvgIconFeather } from "../../common";
import { DropDocument } from "../../dropzone/DropDocument";
import InputFeedback from "../../forms/InputFeedback";
import { useToaster, useTranslationActions, useUserActions, useUserChannels, useUsers } from "../../hooks";
import { FormInput, EmailPhoneInput } from "../../forms";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import UserOptions from "./UserOptions";
import moment from "moment";

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
        color: ${(props) => props.theme.colors.primary};
      }
    }
    .input-group-text {
      border: 1px solid #${(props) => props.theme.colors.primary};
      background: ${(props) => props.theme.colors.primary};
      color: #fff;
    }
    svg {
      cursor: pointer;
    }
  }

  .avatar-container {
    cursor: pointer;
    position: relative;
    width: 68px;
    height: 68px;
    margin: 0 auto;

    .edit-avatar {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #fff;
      border-radius: 50px 50px 50px 50px;
      height: 25px;
      width: 25px;
      padding: 5px;
      border-color: rgba(0, 0, 0, 0.2);
      color: #a5aeb3;
      border-width: 1px;
      color: #212529;
      svg {
        width: 1rem;
        height: 1rem;
      }
    }
    :hover {
      svg {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
    .dark & {
      svg {
        color: #fff;
      }
    }
  }

  .form-group {
    &.designation {
      margin: 0 auto;
      width: 66.66%;
    }
  }
  .email-phone-container {
    .input-group {
      flex-wrap: ${(props) => (props.registerMode === "email" ? "unset" : "wrap")};
    }
    .dropdown-menu.show {
      left: unset !important;
      right: 0;
    }
    input {
      width: 100%;
    }
  }
  .more-options {
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;

const lettersRegExp = /[a-zA-Z]/g;

const UserProfilePanel = (props) => {
  const { className = "" } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const toaster = useToaster();
  const { users, loggedUser } = useUsers();
  const { checkEmail, fetchById, getReadOnlyFields, getRequiredFields, update, updateProfileImage, fetchRoles, fetchUsersWithoutActivity } = useUserActions();
  const { selectUserChannel } = useUserChannels();
  const roles = useSelector((state) => state.users.roles);
  const generalSettings = useSelector((state) => state.settings.user.GENERAL_SETTINGS);
  const { dark_mode } = generalSettings;

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
  const [registerMode, setRegisterMode] = useState("email");
  const [countryCode, setCountryCode] = useState(null);
  const [accountType, setAccountType] = useState(users[props.match.params.id] ? users[props.match.params.id].role.id : null);

  const refs = {
    dropZoneRef: useRef(null),
    first_name: useRef(null),
    password: useRef(null),
  };

  const accountOptions = [
    {
      value: 1,
      label: "Admin",
    },
    {
      value: 2,
      label: "Supervisor",
    },
    {
      value: 3,
      label: "Employee",
    },
  ];

  const { _t } = useTranslationActions();

  const dictionary = {
    companyName: _t("PROFILE.COMPANY_NAME", "Company name"),
    information: _t("PROFILE.INFORMATION", "Information"),
    firstName: _t("PROFILE.FIRST_NAME", "First name:"),
    middleName: _t("PROFILE.MIDDLE_NAME", "Middle name:"),
    lastName: _t("PROFILE.LAST_NAME", "Last name:"),
    password: _t("PROFILE.PASSWORD", "Password:"),
    position: _t("PROFILE.POSITION", "Position:"),
    city: _t("PROFILE.CITY", "City:"),
    address: _t("PROFILE.ADDRESS", "Address:"),
    zip_code: _t("PROFILE.ZIP_POST_CODE", "ZIP/POST code:"),
    phone: _t("PROFILE.PHONE", "Phone:"),
    // email: _t("PROFILE.EMAIL", "Email:"),
    email: _t("LOGIN.EMAIL_PHONE", "Email / Phone number"),
    edit: _t("BUTTON.EDIT", "Edit"),
    saveChanges: _t("BUTTON.SAVE_CHANGES", "Save changes"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    clickToChangePassword: _t("PROFILE.CLICK_TO_CHANGE_PASSWORD", "Click to change your password"),
    external: _t("PROFILE.EXTERNAL", "External"),
    invalidPhoneNumber: _t("FEEDBACK.INVALID_PHONE_NUMBER", "Invalid phone number"),
    invalidEmail: _t("FEEDBACK.INVALID_EMAIL", "Invalid email format"),
    emailRequired: _t("FEEDBACK.EMAIL_REQUIRED", "Email is required."),
    accountType: _t("PROFILE.ACCOUNT_TYPE", "Account type"),
    lastLoggedIn: _t("PROFILE.LAST_LOGGED_IN", "Last Logged in"),
    invitedBy: _t("PROFILE.INVITED_BY", "Invited by"),
  };

  const isEditable = (loggedUser && loggedUser.type === "internal" && user && user.type === "external" && user.active === 1) || (loggedUser && loggedUser.role && loggedUser.role.id <= 2);

  const getValidClass = (valid) => {
    if (typeof valid === "boolean") {
      return valid ? "is-valid" : "is-invalid";
    }
  };

  const togglePasswordUpdate = () => {
    setPasswordUpdate((prevState) => !prevState);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevState) => !prevState);
  };

  const handleUserChat = (user) => selectUserChannel(user);

  const toggleEditInformation = () => {
    setEditInformation((prevState) => !prevState);
    setForm({ ...user });
    setFormUpdate({
      valid: {},
      feedbackState: {},
      feedbackText: {},
    });
    setPasswordUpdate(false);
  };

  const handleInputChange = (e) => {
    if (e.target !== null) {
      const { name, value } = e.target;
      setForm((prevState) => ({
        ...prevState,
        [name]: value.trim(),
      }));
    }
  };

  const handleInputBlur = (e) => {
    if (e.target !== null) {
      const { name, value } = e.target;
      if (user[name] === form[name]) {
        setFormUpdate((prevState) => ({
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
          setFormUpdate((prevState) => ({
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
              [name]: dictionary.emailRequired,
            },
          }));
        } else if (value.trim() !== "" && !EmailRegex.test(value.trim())) {
          setFormUpdate((prevState) => ({
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
              [name]: dictionary.invalidEmail,
            },
          }));
        } else {
          checkEmail(form.email, (err, res) => {
            if (res) {
              if (res.data.status) {
                setFormUpdate((prevState) => ({
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
                    [name]: "Email is already taken",
                  },
                }));
              } else {
                setFormUpdate((prevState) => ({
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
        setFormUpdate((prevState) => ({
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
            [name]: value.trim() === "" ? "Field is required." : "",
          },
        }));
      } else {
        setFormUpdate((prevState) => ({
          valid: {
            ...prevState.valid,
            [name]: true,
          },
          feedbackState: prevState.feedbackState,
          feedbackText: prevState.feedbackText,
        }));
      }
    }
  };

  const handleSave = () => {
    if (Object.values(formUpdate.valid).find((v) => v === false) === false) {
      toaster.error("Some fields require your attention.");
    } else if (Object.values(formUpdate.valid).find((v) => v === true) === true) {
      if (form.profile_image_link !== user.profile_image_link) {
        updateProfileImage(form, formUpdate.feedbackText.profile_image_link, (err, res) => {
          if (res) {
            setEditInformation(false);
          }
        });
      } else {
        if (user.email !== form.email) {
          update({ ...form, change_email: 1 }, (err, res) => {
            if (res) {
              setEditInformation(false);
            }
          });
        } else {
          update({ ...form }, (err, res) => {
            if (res) {
              setEditInformation(false);
            }
          });
        }
      }
    } else {
      //check for changes in email
      if (user && form.email && user.email !== form.email) {
        if (requiredFields.includes("email") && form.email.trim() === "") {
          setFormUpdate((prevState) => ({
            valid: {
              ...prevState.valid,
              email: false,
            },
            feedbackState: {
              ...prevState.feedbackState,
              email: false,
            },
            feedbackText: {
              ...prevState.feedbackText,
              email: dictionary.emailRequired,
            },
          }));
        } else if (form.email.trim() !== "" && form.email.charAt(0) === "+" && !lettersRegExp.test(form.email)) {
          if (!isValidPhoneNumber(form.email)) {
            setFormUpdate((prevState) => ({
              valid: {
                ...prevState.valid,
                email: false,
              },
              feedbackState: {
                ...prevState.feedbackState,
                email: false,
              },
              feedbackText: {
                ...prevState.feedbackText,
                email: dictionary.invalidPhoneNumber,
              },
            }));
          } else {
            //valid phone
            checkEmail(form.email, (err, res) => {
              if (res) {
                if (res.data.status) {
                  setFormUpdate((prevState) => ({
                    valid: {
                      ...prevState.valid,
                      email: false,
                    },
                    feedbackState: {
                      ...prevState.feedbackState,
                      email: false,
                    },
                    feedbackText: {
                      ...prevState.feedbackText,
                      email: "Phone number already taken",
                    },
                  }));
                } else {
                  if (user.email !== form.email) {
                    update({ ...form, change_email: 1 }, (err, res) => {
                      if (res) {
                        setEditInformation(false);
                      }
                    });
                  } else {
                    update({ ...form }, (err, res) => {
                      if (res) {
                        setEditInformation(false);
                      }
                    });
                  }
                }
              }
            });
          }
        } else if (form.email.trim() !== "" && !EmailRegex.test(form.email.trim())) {
          setFormUpdate((prevState) => ({
            valid: {
              ...prevState.valid,
              email: false,
            },
            feedbackState: {
              ...prevState.feedbackState,
              email: false,
            },
            feedbackText: {
              ...prevState.feedbackText,
              email: dictionary.invalidEmail,
            },
          }));
        } else {
          checkEmail(form.email, (err, res) => {
            if (res) {
              if (res.data.status) {
                setFormUpdate((prevState) => ({
                  valid: {
                    ...prevState.valid,
                    email: false,
                  },
                  feedbackState: {
                    ...prevState.feedbackState,
                    email: false,
                  },
                  feedbackText: {
                    ...prevState.feedbackText,
                    email: "Email is already taken",
                  },
                }));
              } else {
                if (user.email !== form.email) {
                  update({ ...form, change_email: 1 }, (err, res) => {
                    if (res) {
                      setEditInformation(false);
                    }
                  });
                } else {
                  update({ ...form }, (err, res) => {
                    if (res) {
                      setEditInformation(false);
                    }
                  });
                }
              }
            }
          });
        }
      } else if (user && accountType !== user.role.name) {
        update({ ...form }, (err, res) => {
          if (res) {
            setEditInformation(false);
          }
        });
      } else {
        toaster.info("Nothing was updated.");
        setEditInformation(false);
      }
    }
  };

  const handleAvatarClick = () => {
    if (!editInformation) {
      setEditInformation(true);
    }
    refs.dropZoneRef.current.open();
  };

  const handleShowDropZone = () => {
    if (!showDropZone) setShowDropZone(true);
  };

  const handleHideDropzone = () => {
    setShowDropZone(false);
  };

  const handleUseProfilePic = (file, fileUrl) => {
    setForm((prevState) => ({
      ...prevState,
      profile_image_link: fileUrl,
    }));
    setFormUpdate((prevState) => ({
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
    toaster.info(
      <>
        Click the <b>Save Changes</b> button to update your profile image.
      </>
    );
  };

  const dropAction = (uploadedFiles) => {
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
      })
    );
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${user.email}`;
  };

  const handleEmailNumberChange = (value) => {
    setForm((prevState) => ({
      ...prevState,
      email: value,
    }));

    setFormUpdate((prevState) => ({
      ...prevState,
      valid: {
        ...prevState.valid,
        email: undefined,
      },
      feedbackState: {
        ...prevState.feedbackState,
        email: undefined,
      },
      feedbackText: {
        ...prevState.feedbackText,
        email: undefined,
      },
    }));
  };

  const handleSelectAccountType = (e) => {
    setAccountType(e.value);
    setForm({
      ...form,
      role_ids: [e.value],
    });
  };

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((response) => {
        setCountryCode(response.country);
      })
      .catch((data, status) => {
        //console.log("Request failed");
      });

    if (!props.match.params.hasOwnProperty("id") || (props.match.params.hasOwnProperty("id") && !props.match.params.hasOwnProperty("name") && parseInt(props.match.params.id) === loggedUser.id)) {
      history.push(`/profile/${loggedUser.id}/${replaceChar(loggedUser.name)}`);
    }
    if (loggedUser.role.id <= 2) fetchUsersWithoutActivity();
    // check if roles has an object
    if (Object.keys(roles).length === 0) {
      fetchRoles();
    }
  }, []);

  useEffect(() => {
    const selectedUser = users[props.match.params.id] ? users[props.match.params.id] : {};
    if (selectedUser.hasOwnProperty("loaded")) {
      if (form.id !== selectedUser.id) setForm(selectedUser);
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

  useEffect(() => {
    if (passwordUpdate && refs.password.current) {
      refs.password.current.focus();
    }
  }, [passwordUpdate, refs.password]);

  useEffect(() => {
    if (editInformation && refs.first_name.current) {
      refs.first_name.current.focus();
      if (user && user.email.charAt(0) === "+" && !lettersRegExp.test(user.email)) {
        setRegisterMode("number");
      }
    }
  }, [editInformation, refs.first_name]);

  useEffect(() => {
    handleEmailNumberChange(registerMode === "email" ? "" : undefined);
    if (user) {
      const isPhoneNumber = user.email.charAt(0) === "+" && !lettersRegExp.test(user.email);
      setForm((prevState) => ({
        ...prevState,
        email: isPhoneNumber && registerMode === "email" ? "" : user.email,
      }));
    }
  }, [registerMode]);

  useEffect(() => {
    if (accountType === null && users[props.match.params.id]) {
      setAccountType(users[props.match.params.id].role.name);
    }
  }, [accountType, users]);
  if (!users[props.match.params.id]) {
    return <></>;
  }

  let emailDefaultValue = "";

  if (user) {
    const isPhoneNumber = user.email.charAt(0) === "+" && !lettersRegExp.test(user.email);
    emailDefaultValue = isPhoneNumber && registerMode === "email" ? "" : user.email;
  }



  return (
    <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`} registerMode={registerMode}>
      <div className="row row-user-profile-panel">

        <div className="col-12 col-lg-6 col-xl-6">
          <div className="card">
            {loggedUser.role.id <= 2 && loggedUser.id !== user.id && <UserOptions user={user} />}
            <div className="card-body text-center" onDragOver={handleShowDropZone}>
              {(isLoggedUser || isEditable) && (
                <DropDocument
                  acceptType="imageOnly"
                  hide={!showDropZone}
                  ref={refs.dropZoneRef}
                  onDragLeave={handleHideDropzone}
                  onDrop={({ acceptedFiles }) => {
                    dropAction(acceptedFiles);
                  }}
                  onCancel={handleHideDropzone}
                />
              )}
              <div className="avatar-container">
                {<Avatar imageLink={form.profile_image_link} name={form.name ? form.name : form.email} noDefaultClick={true} forceThumbnail={false} />}
                {(isLoggedUser || isEditable) && (
                  <span className="btn edit-avatar" onClick={handleAvatarClick}>
                    <SvgIconFeather icon="pencil" />
                  </span>
                )}
              </div>

              {editInformation ? (
                <h5 className="mb-1 mt-2">
                  {form.first_name} {form.middle_name} {form.last_name}
                </h5>
              ) : (
                <h5 className="mb-1 mt-2">
                  {user.first_name} {user.middle_name} {user.last_name}
                </h5>
              )}
              {editInformation && !readOnlyFields.includes("designation") ? (
                <div className="text-muted small d-flex align-items-center mt-2">
                  <FormInput
                    placeholder="Job Title eg. Manager, Team Leader, Designer"
                    className="designation"
                    name="designation"
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    defaultValue={user.designation}
                    isValid={formUpdate.feedbackState.designation}
                    valid={formUpdate.feedbackText.designation}
                  />
                </div>
              ) : (
                <p className="text-muted small">{user.designation}</p>
              )}
              <div className="col col-form my-lg-n3">{user.type === "external" && dictionary.external}</div>

              {loggedUser.id !== user.id && (
                <div className="d-flex justify-content-center">
                  {user.contact !== "" && loggedUser.type === "internal" && (
                    <button className="btn btn-outline-light mr-1">
                      <a href={`tel:${user.contact.replace(/ /g, "").replace(/-/g, "")}`}>
                        <SvgIconFeather className="" icon="phone" />
                      </a>
                    </button>
                  )}
                  {user.type !== "external" && loggedUser.type === "internal" && (
                    <button className="ml-1 btn btn-outline-light">
                      <SvgIconFeather
                        onClick={() => {
                          handleUserChat(user);
                        }}
                        icon="message-circle"
                      />
                    </button>
                  )}
                </div>
              )}
              {/*{
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
                            }*/}
            </div>
          </div>

          <div className="card">
            {!editInformation ? (
              <div className="card-body">
                <h6 className="card-title d-flex justify-content-between align-items-center">
                  {dictionary.information}
                  {isLoggedUser || isEditable ? (
                    <span onClick={toggleEditInformation} className="btn btn-outline-light btn-sm">
                      <SvgIconFeather className="mr-2" icon="edit-2" /> {dictionary.edit}
                    </span>
                  ) : null}
                </h6>
                {user.first_name && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.firstName}</div>
                    <div className="col col-form">{user.first_name}</div>
                  </div>
                )}
                {user.middle_name && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.middleName}</div>
                    <div className="col col-form">{user.middle_name}</div>
                  </div>
                )}
                {user.last_name && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.lastName}</div>
                    <div className="col col-form">{user.last_name}</div>
                  </div>
                )}
                {user.id === loggedUser.id && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.password}</div>
                    <div className="col col-form">*****</div>
                  </div>
                )}
                {user.type === "external" && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.companyName}</div>
                    <div className="col col-form">{user.external_company_name && user.external_company_name}</div>
                  </div>
                )}
                {user.place && loggedUser.type === "internal" && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.city}</div>
                    <div className="col col-form">{user.place}</div>
                  </div>
                )}
                {user.address && loggedUser.type === "internal" && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.address}</div>
                    <div className="col col-form">{user.address}</div>
                  </div>
                )}
                {/*{user.zip_code && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.zip_code}</div>
                    <div className="col col-form">{user.zip_code}</div>
                  </div>
                )}*/}
                {user.contact && loggedUser.type === "internal" && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.phone}</div>
                    <div className="col col-form">{user.contact}</div>
                  </div>
                )}
                {user.email && loggedUser.type === "internal" && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.email}</div>
                    <div className="col col-form cursor-pointer" onClick={handleEmailClick}>
                      {user.email}
                    </div>
                  </div>
                )}
                {user.role && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.accountType}</div>
                    <div className="col col-form">{user.type === "external" ? dictionary.external : user.role.display_name}</div>
                  </div>
                )}
                {user.type === "external" &&
                  <>
                    <div className="row mb-2">
                      <div className="col col-label text-muted">{dictionary.lastLoggedIn}</div>
                      <div className="col col-form">{moment.unix(user?.last_login?.timestamp).format("MMMM DD YYYY hh:mm A").toString()}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col col-label text-muted">{dictionary.invitedBy}</div>
                      <div className="col col-form">{user?.invited_by?.invitedBy}</div>
                    </div>
                  </>
                }
              </div>
            ) : (
              <div className="card-body">
                <h6 className="card-title d-flex justify-content-between align-items-center">
                  {dictionary.information}
                  {/*<div>
                                        <span onClick={toggleEditInformation}
                                              className="close btn btn-outline-light btn-sm">
                                            <SvgIconFeather icon="x"/>
                                        </span>
                                    </div>*/}
                </h6>
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.firstName}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("first_name") ? (
                      <Label>{user.first_name}</Label>
                    ) : (
                      <>
                        <Input
                          className={getValidClass(formUpdate.valid.first_name)}
                          //disabled={!isLoggedUser}
                          innerRef={refs.first_name}
                          name="first_name"
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          defaultValue={user.first_name}
                        />
                        <InputFeedback valid={formUpdate.feedbackState.first_name}>{formUpdate.feedbackText.first_name}</InputFeedback>
                      </>
                    )}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.middleName}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("middle_name") ? (
                      <Label>{user.middle_name}</Label>
                    ) : (
                      <>
                        <Input className={getValidClass(formUpdate.valid.middle_name)} name="middle_name" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.middle_name} />
                        <InputFeedback valid={formUpdate.feedbackState.middle_name}>{formUpdate.feedbackText.middle_name}</InputFeedback>
                      </>
                    )}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.lastName}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("last_name") ? (
                      <Label>{user.last_name}</Label>
                    ) : (
                      <>
                        <Input className={getValidClass(formUpdate.valid.last_name)} name="last_name" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.last_name} />
                        <InputFeedback valid={formUpdate.feedbackState.last_name}>{formUpdate.feedbackText.last_name}</InputFeedback>
                      </>
                    )}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.password}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("password") || isEditable ? (
                      <Label>*****</Label>
                    ) : (
                      <>
                        <Label onClick={togglePasswordUpdate} className={`cursor-pointer mb-0 ${!passwordUpdate ? "" : "d-none"}`}>
                          {dictionary.clickToChangePassword}
                        </Label>
                        <FormGroup className={`form-group-password mb-0 ${passwordUpdate ? "" : "d-none"}`}>
                          <InputGroup>
                            <Input
                              className={getValidClass(formUpdate.valid.password)}
                              innerRef={refs.password}
                              name="password"
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                              defaultValue=""
                              type={passwordVisibility ? "text" : "password"}
                            />
                            <InputGroupAddon className="btn-toggle" addonType="append">
                              <InputGroupText className="btn" onClick={togglePasswordVisibility}>
                                <SvgIconFeather icon={passwordVisibility ? "eye-off" : "eye"} />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                          <InputFeedback valid={formUpdate.feedbackState.password}>{formUpdate.feedbackText.password}</InputFeedback>
                        </FormGroup>
                      </>
                    )}
                  </div>
                </div>
                {user.type === "external" && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.companyName}</div>
                    <div className="col col-form">
                      {readOnlyFields.includes("company_name") ? (
                        <Label>{user.external_company_name && user.external_company_name}</Label>
                      ) : (
                        <>
                          <Input
                            className={getValidClass(true)}
                            name="company_name"
                            disabled={isEditable || !isLoggedUser}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            defaultValue={user.external_company_name ? user.external_company_name : ""}
                          />
                          {/* <InputFeedback valid={true}>{formUpdate.feedbackText.place}</InputFeedback> */}
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.city}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("place") ? (
                      <Label>{user.place}</Label>
                    ) : (
                      <>
                        <Input className={getValidClass(formUpdate.valid.place)} name="place" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.place} />
                        <InputFeedback valid={formUpdate.feedbackState.place}>{formUpdate.feedbackText.place}</InputFeedback>
                      </>
                    )}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.address}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("address") ? (
                      <Label>{user.address}</Label>
                    ) : (
                      <>
                        <FormInput name="address" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.address} isValid={formUpdate.feedbackState.address} feedback={formUpdate.feedbackText.address} />
                      </>
                    )}
                  </div>
                </div>
                {/*
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.zip_code}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("zip_code") ? (
                      <Label>{user.zip_code}</Label>
                    ) : (
                      <>
                        <FormInput name="zip_code" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.zip_code} isValid={formUpdate.feedbackState.zip_code} feedback={formUpdate.feedbackText.zip_code} />
                      </>
                    )}
                  </div>
                </div>*/}
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.phone}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("contact") ? (
                      <Label>{user.contact}</Label>
                    ) : (
                      <>
                        <Input className={getValidClass(formUpdate.valid.contact)} name="contact" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.contact} />
                        <InputFeedback valid={formUpdate.feedbackState.contact}>{formUpdate.feedbackText.contact}</InputFeedback>
                      </>
                    )}
                  </div>
                </div>
                <div className="row mb-2 email-phone-container">
                  <div className="col col-label text-muted">{dictionary.email}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("email") ? (
                      <Label>{user.email}</Label>
                    ) : (
                      <>
                        <EmailPhoneInput
                          onChange={handleEmailNumberChange}
                          name="email_phone"
                          isValid={formUpdate.feedbackState.email}
                          feedback={formUpdate.feedbackText.email}
                          placeholder={dictionary.emailOnly}
                          registerMode={registerMode}
                          setRegisterMode={setRegisterMode}
                          value={form.email}
                          defaultCountry={countryCode}
                          defaultValue={emailDefaultValue}
                        />
                        {/* <Input type="email" className={getValidClass(formUpdate.valid.email)} name="email" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.email} /> */}
                        {/* <InputFeedback valid={formUpdate.feedbackState.email}>{formUpdate.feedbackText.email}</InputFeedback> */}
                      </>
                    )}
                  </div>
                </div>
                {loggedUser.role.id <= 2 && loggedUser.id !== user.id && user.type === "internal" && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.accountType}</div>
                    <div className="col col-form">
                      <Select
                        className={"react-select-container"}
                        classNamePrefix="react-select"
                        styles={dark_mode === "0" ? lightTheme : darkTheme}
                        value={accountOptions.find((o) => o.value === accountType)}
                        onChange={handleSelectAccountType}
                        options={accountOptions}
                        menuPlacement={"top"}
                      />
                    </div>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between align-items-center mt-0">
                  <div>&nbsp;</div>
                  <div>
                    <span onClick={toggleEditInformation} className="btn btn-outline-light mr-2">
                      {dictionary.cancel}
                    </span>
                    <span onClick={handleSave} className="btn btn-primary">
                      {dictionary.saveChanges}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(UserProfilePanel);
