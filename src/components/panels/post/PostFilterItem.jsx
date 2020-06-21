import React from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    
    > span {
        cursor: pointer;
        cursor: hand;
        
        &.active {
            border-color: #ebebeb !important;
        }
        
        svg {
            width: 16px;
        }
    }
`;

const PostFilterItem = props => {

    const {className = "", workspace, filter = "all", onGoBack} = props;

    const dispatch = useDispatch();

    const handleClickFilter = e => {
        dispatch(
            updateWorkspacePostFilterSort({
                topic_id: workspace.id,
                filter: e.target.dataset.value,
            }),
        );
        onGoBack();
    };

    return (
        <Wrapper className={`post-filter-item list-group list-group-flush ${className}`}>
            <span
                className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`}
                data-value="all" onClick={handleClickFilter}>
                <SvgIconFeather className="mr-2" icon="book-open"/>
                All
            </span>
            <span
                className={`list-group-item d-flex align-items-center ${filter && filter === "my_posts" ? "active" : ""}`}
                data-value="my_posts"
                onClick={handleClickFilter}>
                <SvgIconFeather className="mr-2" icon="send"/>
                My posts
            </span>
            <span className={`list-group-item d-flex align-items-center ${filter && filter === "star" ? "active" : ""}`}
                  data-value="star"
                  onClick={handleClickFilter}>
                <SvgIconFeather className="mr-2" icon="star"/>
                Starred
            </span>
            <span className={`list-group-item d-flex align-items-center ${filter && filter === "archive" ? "active" : ""}`}
                  data-value="archive"
                  onClick={handleClickFilter}>
                <SvgIconFeather className="mr-2" icon="archive"/>
                Archived
            </span>
            <span
                className={`list-group-item d-flex align-items-center ${filter && filter === "draft" ? "active" : ""}`}
                data-value="draft"
                onClick={handleClickFilter}>
                <SvgIconFeather className="mr-2" icon="edit-3"/>
                Drafts
            </span>
        </Wrapper>
    );
};

export default React.memo(PostFilterItem);