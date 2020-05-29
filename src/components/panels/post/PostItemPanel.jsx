import React from "react";
import styled from "styled-components";
import {Avatar, SvgIconFeather} from "../../common";
import {CheckBox} from "../../forms";

const Wrapper = styled.li`
`;

const PostItemPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`list-group-item post-item-list ${className}`}>
            <div className="custom-control custom-checkbox custom-checkbox-success mr-2">
                <CheckBox name="test"/>
            </div>
            <div>
                <SvgIconFeather icon="star"/>
            </div>
            <div className="flex-grow-1 min-width-0">
                <div className="mb-1 d-flex align-items-center justify-content-between">
                    <div className="app-list-title text-truncate">title</div>
                    <div className="pl-3 d-flex align-items-center">
                        <div className="mr-3 d-sm-inline d-none">
                            <div className="badge badge-danger">Category</div>
                        </div>
                        <div className="mr-3 d-sm-inline d-none">
                            <div className="avatar-group">
                                <Avatar name="Test 1"/>
                                <Avatar name="Test 2"/>
                                <Avatar name="Test 3"/>
                            </div>
                        </div>
                        <SvgIconFeather icon="trash-2"/>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(PostItemPanel);