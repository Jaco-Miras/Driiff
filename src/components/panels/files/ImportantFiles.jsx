import React from "react";
import styled from "styled-components";
import {FileListItem} from "../../list/file/item";

const Wrapper = styled.div`
`;

const ImportantFiles = (props) => {

    const {className = "", wsFiles, actions} = props;

    return (
        <Wrapper className={`important-files ${className}`}>
            <h6 className="font-size-11 text-uppercase mb-4">Important</h6>
            <div className="row">
                {
                    wsFiles && wsFiles.favorite_files.length > 0 &&
                    wsFiles.favorite_files.map(id => {
                        return (
                            <FileListItem key={id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={wsFiles.files[id]} actions={actions}/>
                        );
                    })
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(ImportantFiles);