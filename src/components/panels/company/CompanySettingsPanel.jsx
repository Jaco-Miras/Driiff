import React from "react";
import styled from "styled-components";
import ProfileSettings from "../settings/ProfileSettings";

const Wrapper = styled.div`
`;

const CompanySettingsPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row row-settings">
                <div className="col-md-4">
                    <ProfileSettings/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(CompanySettingsPanel);