import React from "react";
import styled from "styled-components";
import {Avatar, SvgIconFeather} from "../../common";
import {useCountRenders, useUserActions, useUsers} from "../../hooks";

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

const UserProfilePanel = (props) => {

    const {className = ""} = props;
    const {id: userId} = props.match.params;

    const {users, currentUser} = useUsers();
    useCountRenders("user-profile");

    const {update, fetchById} = useUserActions();

    const [user, setUser] = useState(users[userId] ? users[userId] : null);
    const [editInformation, setEditInformation] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [passwordUpdate, setPasswordUpdate] = useState(false);

    const [form, setForm] = useState(user ? {...user} : {});

    //const [user, setUser] = useState(null);
    const togglePasswordUpdate = useCallback(() => {
        setPasswordUpdate(prevState => !prevState);
    }, [setPasswordUpdate]);

    // console.log(user)
    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility(prevState => !prevState);
    }, [setPasswordVisibility]);

    const toggleEditInformation = useCallback(() => {
        setEditInformation(prevState => !prevState);
    }, [setEditInformation]);

    const handleInputChange = useCallback((e) => {
        if (e.target !== null) {
            const {name, value} = e.target;
            setForm(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }, []);

    const handleSave = () => {
        update(form, (err, res) => {
            if (err) {
            }
            if (res) {
                setEditInformation(false);
            }
        });
    };

    useEffect(() => {
        if (user === null || !user.hasOwnProperty("loaded")) {
            fetchById(userId, (err, res) => {
                console.log(res);
            });
        }
    }, []);

    useEffect(() => {
        const user = users[userId] ? users[userId] : null;
        setForm(user);
        setUser(user);
    }, [users]);

    if (!user || !user.hasOwnProperty("loaded")) {
        return <></>;
    }

    return (
        <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
            <div className="row row-user-profile-panel">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
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
                            <p className="text-muted small">{user.designation}</p>
                            {
                                isCurrentUser &&
                                <span className="btn btn-outline-primary">
                                    <SvgIconFeather className="mr-2" icon="edit-2"/> Edit <Profile></Profile>
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
                                    <span onClick={toggleEditInformation} className="btn btn-outline-light btn-sm">
                                        <SvgIconFeather className="mr-2" icon="edit-2"/> Edit
                                    </span>
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
                                <div className="row mb-2">
                                    <div className="col-6 text-muted">First Name:</div>
                                    <div className="col-6">
                                        <Input name="first_name" onChange={(e) => handleInputChange(e)}
                                               defaultValue={form.first_name}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-muted">Middle Name:</div>
                                    <div className="col-6">
                                        <Input name="middle_name" onChange={handleInputChange}
                                               value={form.middle_name}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-muted">Last Name:</div>
                                    <div className="col-6">
                                        <Input name="last_name" onChange={handleInputChange} value={form.last_name}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-muted">Password</div>
                                    <div className="col-6">
                                        <Label onClick={togglePasswordUpdate}
                                               className={`cursor-pointer ${!passwordUpdate ? "" : "d-none"}`}>Click to
                                            change your password.</Label>
                                        <FormGroup
                                            className={`form-group-password ${!!passwordUpdate ? "" : "d-none"}`}>
                                            <InputGroup>
                                                <Input name="password" onChange={handleInputChange}
                                                       type={passwordVisibility ? "text" : "password"}/>
                                                <InputGroupAddon className="btn-toggle" addonType="append">
                                                    <InputGroupText className="btn" onClick={togglePasswordVisibility}>
                                                        <SvgIconFeather icon={passwordVisibility ? "eye-off" : "eye"}/></InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-6 text-muted">City:</div>
                                    <div className="col-6">
                                        <Input name="place" onChange={handleInputChange} value={form.place}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-muted">Address:</div>
                                    <div className="col-6">
                                        <Input name="address" onChange={handleInputChange} value={form.address}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-muted">Phone:</div>
                                    <div className="col-6">
                                        <Input name="phone" onChange={handleInputChange} value={form.phone}/>
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