import React from "react";
import styled from "styled-components";

const Wrapper = styled.a`
`;

const Timestamp = styled.div`
`;

const Badge = styled.span`
    color: #fff !important;
`;

const ChatRecentList = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper href="/" className={`list-group-item active d-flex pl-0 pr-0 pb-3 pt-3 ${className}`}>

            <div className="pr-3">
                <span className="avatar avatar-sm avatar-state-warning">
                    <img src="https://via.placeholder.com/128X128"
                         className="rounded-circle" alt="fpo-placeholder"/></span>
            </div>
            <div className="flex-grow- 1">
                <h6 className="mb-1">Orelie Rockhall</h6>
                <span className="small text-muted">
                    Preview Text
                    <i className="fa fa-image mr-1"></i> Photo
                    <i className="fa fa-video-camera mr-1"></i> Video
                </span>
            </div>
            <Timestamp className="text-right ml-auto">
                <Badge className="badge badge-primary badge-pill ml-auto">3</Badge>
                <span className="small text-muted">Yesterday</span>
            </Timestamp>
        </Wrapper>
    );
};

export default React.memo(ChatRecentList);