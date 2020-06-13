import React, {useState} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";
import {ButtonDropdown} from "../../common";
import {useCountRenders} from "../../hooks";
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

    const {className = "", activeSort = null, workspace} = props;

    const dispatch = useDispatch();

    const [sort, setSort] = useState(activeSort);

    const handleClickSort = e => {
        if (sort === e.target.dataset.value)
            setSort(null);
        else
            setSort(e.target.dataset.value);

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
                        <ButtonDropdown value={sort} dropdown={sortDropdown}/>
                    </li>
                </ul>
            </div>
            <div className="action-right">
                <PostSearch/>
            </div>
        </Wrapper>
    )
};

export default React.memo(PostFilterSearchPanel);