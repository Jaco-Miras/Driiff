import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import styled from "styled-components";
import { EmailRegex, replaceChar } from "../../../helpers/stringFormatter";
import { addToModals } from "../../../redux/actions/globalActions";
import { Avatar, SvgIconFeather } from "../../common";
import { DropDocument } from "../../dropzone/DropDocument";
import InputFeedback from "../../forms/InputFeedback";
import { useToaster, useTranslationActions, useUserActions, useUserChannels, useUsers } from "../../hooks";
import { FormInput } from "../../forms";

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
    }
  }

  .avatar-container {
    cursor: pointer;
    position: relative;
    width: 68px;
    height: 68px;
    margin: 0 auto;

    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #fff;
      border-radius: 50px 50px 50px 50px;
      height: 25px;
      width: 25px;
      padding: 5px;
    }
  }

  .form-group {
    &.designation {
      margin: 0 auto;
      width: 66.66%;
    }
  }
`;

const UserProfilePanel = (props) => {
  const { className = "" } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const toaster = useToaster();
  const { users, loggedUser } = useUsers();
  const { checkEmail, fetchById, getReadOnlyFields, getRequiredFields, update, updateProfileImage } = useUserActions();
  const { selectUserChannel } = useUserChannels();

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
    phone: _t("PROFILE.Phone", "Phone:"),
    email: _t("PROFILE.EMAIL", "Email:"),
    edit: _t("BUTTON.EDIT", "Edit"),
    saveChanges: _t("BUTTON.SAVE_CHANGES", "Save changes"),
    cancel: _t("BUTTON.Cancel", "Cancel"),
    clickToChangePassword: _t("PROFILE.CLICK_TO_CHANGE_PASSWORD", "Click to change your password"),
    external: _t("PROFILE.EXTERNAL", "External"),
  };

  //const isAdmin = loggedUser && loggedUser.role && (loggedUser.role.name === "admin" || loggedUser.role.name === "owner") && user && user.type === "external" && user.active;
  const isAdmin = loggedUser && loggedUser.type === "internal" && user && user.type === "external" && user.active === 1;

  const getValidClass = useCallback((valid) => {
    if (typeof valid !== "boolean") {
    } else {
      return valid ? "is-valid" : "is-invalid";
    }
  }, []);

  const togglePasswordUpdate = useCallback(() => {
    setPasswordUpdate((prevState) => !prevState);
  }, [setPasswordUpdate]);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((prevState) => !prevState);
  }, [setPasswordVisibility]);

  const handleUserChat = (user) => selectUserChannel(user);

  const toggleEditInformation = useCallback(() => {
    setEditInformation((prevState) => !prevState);
    setForm({ ...user });
    setFormUpdate({
      valid: {},
      feedbackState: {},
      feedbackText: {},
    });
    setPasswordUpdate(false);
  }, [user, setForm, setPasswordUpdate, setEditInformation]);

  const handleInputChange = useCallback((e) => {
    if (e.target !== null) {
      const { name, value } = e.target;
      setForm((prevState) => ({
        ...prevState,
        [name]: value.trim(),
      }));
    }
  }, []);

  const handleInputBlur = useCallback(
    (e) => {
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
                [name]: "Email is required",
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
                [name]: "Invalid email format",
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
    },
    [user, form, requiredFields]
  );

  const handleSave = useCallback(() => {
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
        if (isAdmin) {
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
        } else {
          update(form, (err, res) => {
            if (res) {
              setEditInformation(false);
            }
          });
        }
      }
    } else {
      // check for changes in email
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
              email: "Email is required",
            },
          }));
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
              email: "Invalid email format",
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
                if (isAdmin) {
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
                } else {
                  update(form, (err, res) => {
                    if (res) {
                      setEditInformation(false);
                    }
                  });
                }
              }
            }
          });
        }
      } else {
        toaster.info("Nothing was updated.");
      }

      setEditInformation(false);
    }
  }, [form, formUpdate, update, setEditInformation, user, isAdmin]);

  const handleAvatarClick = () => {
    if (!editInformation) {
      setEditInformation(true);
    }
    refs.dropZoneRef.current.open();
  };

  const handleShowDropZone = useCallback(() => {
    if (!showDropZone) setShowDropZone(true);
  }, [showDropZone, setShowDropZone]);

  const handleHideDropzone = useCallback(() => {
    setShowDropZone(false);
  }, [setShowDropZone]);

  const handleUseProfilePic = useCallback((file, fileUrl) => {
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
  }, []);

  const dropAction = useCallback(
    (uploadedFiles) => {
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
    },
    [handleUseProfilePic, handleHideDropzone]
  );

  const handleEmailClick = useCallback(() => {
    window.location.href = `mailto:${user.email}`;
  }, [user]);

  useEffect(() => {
    if (!props.match.params.hasOwnProperty("id") || (props.match.params.hasOwnProperty("id") && !props.match.params.hasOwnProperty("name") && parseInt(props.match.params.id) === loggedUser.id)) {
      history.push(`/profile/${loggedUser.id}/${replaceChar(loggedUser.name)}`);
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
    }
  }, [editInformation, refs.first_name]);

  if (!form.id) {
    return <></>;
  }

  return (
    <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
      <div className="row row-user-profile-panel">
        <div className="col-12 col-lg-5 col-xl-6">
          <div className="card">
            <div className="card-body text-center" onDragOver={handleShowDropZone}>
              {(isLoggedUser || isAdmin) && (
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
              {/*{user.import_from === "gripp" && <SvgIcon className={editInformation ? "mb-2" : "mb-4"} width={500} height={40} icon="gripp-logo" />}*/}
              {/*{editInformation && ["driff", "gripp"].includes(user.import_from) && (
                <ImportWarning className="text-primary mb-3">
                  The profile data is synchronized from an external source.
                  <br/>
                  Some fields cannot be edited.
                </ImportWarning>
              )}*/}
              <div className="avatar-container">
                {<Avatar imageLink={form.profile_image_link} name={form.name ? form.name : form.email} noDefaultClick={true} forceThumbnail={false} />}
                {(isLoggedUser || isAdmin) && (
                  <span className="btn btn-outline-light btn-sm">
                    <SvgIconFeather icon="pencil" onClick={handleAvatarClick} />
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
                  {isLoggedUser || isAdmin ? (
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
                {user.role && (
                  <div className="row mb-2">
                    <div className="col col-label text-muted">{dictionary.position}</div>
                    <div className="col col-form">{user.type === "external" ? dictionary.external : user.role.name}</div>
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
                    {readOnlyFields.includes("password") || isAdmin ? (
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
                            disabled={isAdmin || !isLoggedUser}
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
                        <Input className={getValidClass(formUpdate.valid.place)} name="place" disabled={isAdmin || !isLoggedUser} onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.place} />
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
                        <FormInput
                          name="address"
                          disabled={isAdmin || !isLoggedUser}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          defaultValue={user.address}
                          isValid={formUpdate.feedbackState.address}
                          feedback={formUpdate.feedbackText.address}
                        />
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
                        <Input className={getValidClass(formUpdate.valid.contact)} name="contact" disabled={isAdmin || !isLoggedUser} onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.contact} />
                        <InputFeedback valid={formUpdate.feedbackState.contact}>{formUpdate.feedbackText.contact}</InputFeedback>
                      </>
                    )}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col col-label text-muted">{dictionary.email}</div>
                  <div className="col col-form">
                    {readOnlyFields.includes("email") ? (
                      <Label>{user.email}</Label>
                    ) : (
                      <>
                        <Input type="email" className={getValidClass(formUpdate.valid.email)} name="email" onChange={handleInputChange} onBlur={handleInputBlur} defaultValue={user.email} />
                        <InputFeedback valid={formUpdate.feedbackState.email}>{formUpdate.feedbackText.email}</InputFeedback>
                      </>
                    )}
                  </div>
                </div>
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
