import React from "react";

const SearchTabs = (props) => {

    return (
        <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#clasic" role="tab" aria-controls="clasic" aria-selected="true">
                Chat
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#articles" role="tab" aria-controls="articles" aria-selected="false">
                Files
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#photos" role="tab" aria-controls="photos" aria-selected="false">
                Posts
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#users" role="tab" aria-controls="users" aria-selected="false">
                People
                </a>
            </li>
        </ul>
    );
};

export default SearchTabs;