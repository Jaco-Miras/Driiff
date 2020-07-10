import React from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";
import {ButtonDropdown} from "../../common";
// import {useCountRenders} from "../../hooks";
import {PostSearch} from "./index";

const Wrapper = styled.div`
    overflow: unset!important;
    
    .action-left {
        ul.list-inline {            
            margin-bottom: 0;
        }
    }
`;

const PostFilterSearchPanel = props => {

    const {className = "", activeSort = null, workspace, search} = props;

    const dispatch = useDispatch();

    const handleClickSort = e => {

        dispatch(
            updateWorkspacePostFilterSort({
                topic_id: workspace.id,
                sort: e.target.dataset.value,
            }),
        );
    };

    const sortDropdown = {
        label: "Sort by",
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
                    <li className="list-inline-item mb-0">
                        <ButtonDropdown value={activeSort} dropdown={sortDropdown}/>
                    </li>
                </ul>
            </div>
            <div className="action-right">
                <PostSearch search={search}/>
            </div>
        </Wrapper>
    );
};

export default React.memo(PostFilterSearchPanel);