import React, {useCallback} from "react";
import {CustomInput, FormGroup} from "reactstrap";
import styled from "styled-components";

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

const ProfileSettings = (props) => {

    const {className = ""} = props;

    const handleSwitchToggle = useCallback((e) => {
        e.persist();
        const {name, checked} = e.target;
        console.log(name);
        console.log(checked);
    }, []);

    return (
        <Wrapper className={`profile-settings ${className}`}>
            <div className="card">
                <div className="card-body">
                    <h6>Chat Settings</h6>
                    <FormGroup>
                        <CustomInput
                            type="switch"
                            id="sound"
                            name="sound"
                            onChange={handleSwitchToggle}
                            checked={true}
                            label="Play a sound when receiving a new chat message"
                        />
                    </FormGroup>
                    <FormGroup>
                        <CustomInput
                            type="switch"
                            id="channel_sort"
                            name="channel_sort"
                            onChange={handleSwitchToggle}
                            value={"off"}
                            label="Sort channel by latest/channel name"
                        />
                    </FormGroup>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h6>Localization</h6>

                    <div className="row mb-2">
                        <div className="col-6 text-muted">Language</div>
                        <div className="col-6">
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-6 text-muted">Timezone</div>
                        <div className="col-6">
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>);
};

export default React.memo(ProfileSettings);