import React from "react";
import styled from "styled-components";
import {FileListItem} from "../../list/file/item";

const Wrapper = styled.div`
`;

const RemoveFiles = (props) => {

    const {className = "", actions, wsFiles, isMember} = props;

    // const files = [{
    //     id: 1,
    //     name: "deleted file 1",
    //     size: "2Mb",
    //     mimeType: "image",
    // }, {
    //     id: 2,
    //     name: "deleted file 2",
    //     size: "1Mb",
    //     mimeType: "video",
    // }];

    return (
        <Wrapper className={`remove-files ${className}`}>
            <h6 className="font-size-11 text-uppercase mb-4">Removed</h6>
            <div className="row">
                {
                    wsFiles && Object.values(wsFiles.trash_files).length > 0 &&
                    Object.values(wsFiles.trash_files).map(f => {
                        return (
                            <FileListItem key={f.id} isMember={isMember}
                                        forceDelete={true}
                                        className="col-xl-3 col-lg-4 col-md-6 col-sm-12" 
                                        file={f} actions={actions}/>
                        );
                    })
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(RemoveFiles);