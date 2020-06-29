import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`    
`;

const UserNotificationPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
            <div className="row row-user-profile-panel">
                <div className="col-md-4">
                    <div className="card">
                        <h6>Notifications</h6>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(UserNotificationPanel);