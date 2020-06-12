import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    a {
        cursor: pointer;
    }
`;

const PostFilterItem = props => {

    const {filter} = props;
    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleClickFilter = e => {
        if (topic) {
            dispatch(
                updateWorkspacePostFilterSort({
                    topic_id: topic.id,
                    filter: e.target.dataset.value
                })
            )
        }
    };

    return (
        <Wrapper className="list-group list-group-flush">
            <a className={`list-group-item d-flex align-items-center ${filter && filter === "all" ? "active" : ""}`}
               data-value="all" onClick={handleClickFilter}>
                <SvgIconFeather icon="mail"/>
                All
            </a>
            <a className={`list-group-item ${filter && filter === "my_posts" ? "active" : ""}`} data-value="my_posts"
               onClick={handleClickFilter}>
                <SvgIconFeather icon="send"/>
                My posts
            </a>
            <a className={`list-group-item ${filter && filter === "star" ? "active" : ""}`} data-value="star"
               onClick={handleClickFilter}>
                <SvgIconFeather icon="send"/>
                Starred
            </a>
            <a className={`list-group-item ${filter && filter === "draft" ? "active" : ""}`} data-value="draft"
               onClick={handleClickFilter}>
                <SvgIconFeather icon="send"/>
                Drafts
            </a>
        </Wrapper>
    );
};

export default PostFilterItem;