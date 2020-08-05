import React from "react";
import { FileSearchItem } from "./index";

const FilesTabResults = (props) => {

    const { files, page, redirect } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(files).slice(page > 1 ? (page*10)-10 : 0, page*10).map((f) => {
                    return <FileSearchItem key={f.data.id} file={f.data} redirect={redirect}/>
                })
            }
        </ul>
    );
};

export default FilesTabResults;