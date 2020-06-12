import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";
import {ButtonDropdown} from "../../common";
import {PostSearch} from "./index";

const Wrapper = styled.div`
    overflow: unset!important;
    .list-inline {
        margin-bottom: 0
    }
`;

const PostFilterSearchPanel = props => {

    const {className = ""} = props;
    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleClickSort = e => {
        if (topic) {
            dispatch(
                updateWorkspacePostFilterSort({
                    topic_id: topic.id,
                    sort: e.target.dataset.value
                })
            )
        }   
    }

    const handleClickFilter = e => {
        if (topic) {
            dispatch(
                updateWorkspacePostFilterSort({
                    topic_id: topic.id,
                    filter: e.target.dataset.value
                })
            )
        }
    }

    const filterDropdown = {
        label: "Filter",
        items: [
            {   
                value: "fav",
                label: "Favourites",
                onClick: handleClickFilter
            },
            {
                value: "done",
                label: "Done",
                onClick: handleClickFilter
            },
            {
                value: "deleted",
                label: "Deleted",
                onClick: handleClickFilter
            },
        ]
    }

    const sortDropdown = {
        label: "Order by",
        items: [
            {
                value: "favorite",
                label: "Starred / Favorite",
                onClick: handleClickSort,
            },
            {
                value: "recent",
                label: "Recent",
                onClick: handleClickSort,
            },
            {
                value: "unread",
                label: "Unread",
                onClick: handleClickSort,
            },
        ]
    };

    return (
        <Wrapper className={`post-filter-search-panel app-action ${className}`}>
            <div className="action-left">
                <ul className="list-inline">
                    {/* <li className="list-inline-item mb-0" style={{position: "relative"}}>
                     <ButtonDropdown dropdown={filterDropdown}/>
                     </li> */}
                    <li className="list-inline-item mb-0" style={{position: "relative"}}>
                        <ButtonDropdown dropdown={sortDropdown}/>
                    </li>
                </ul>
            </div>
            <div className="action-right">
                <PostSearch/>
            </div>
        </Wrapper>
    )
};

export default PostFilterSearchPanel;