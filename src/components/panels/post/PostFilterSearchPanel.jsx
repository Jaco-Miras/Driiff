import React from "react";
import styled from "styled-components";
import {useSelector, useDispatch} from "react-redux";
import {ButtonDropdown} from "../../common";
import {updateWorkspacePostFilterSort} from "../../../redux/actions/workspaceActions";

const PostFilterSearchPanel = props => {

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
        label: "Sort",
        items: [
            {
                value: "asc",
                label: "Ascending",
                onClick: handleClickSort
            },
            {   
                value: "desc",
                label: "Descending",
                onClick: handleClickSort
            }
        ]
    }

    return (
        <div className="app-action" style={{overflow: "unset"}}>
            <div className="action-left">
                <ul className="list-inline">
                    <li className="list-inline-item mb-0" style={{position: "relative"}}>
                        <ButtonDropdown dropdown={filterDropdown}/>
                    </li>
                    <li className="list-inline-item mb-0" style={{position: "relative"}}>
                        <ButtonDropdown dropdown={sortDropdown}/>
                    </li>
                </ul>
            </div>
            <div className="action-right">
                <form className="d-flex mr-3">
                    <a href="/" className="app-sidebar-menu-button btn btn-outline-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-menu width-15 height-15">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </a>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Post search"
                                aria-describedby="button-addon1"/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-light" type="button"
                                    id="button-addon1">
                                <i className="ti-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
                <div className="app-pager d-flex align-items-center">
                    <div className="mr-3">1-50 of 253</div>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="/" aria-label="Previous">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                            className="feather feather-chevron-left width-15 height-15">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="/" aria-label="Next">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                            className="feather feather-chevron-right width-15 height-15">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
};

export default PostFilterSearchPanel;