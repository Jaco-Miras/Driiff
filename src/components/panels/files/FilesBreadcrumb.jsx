import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { replaceChar } from "../../../helpers/stringFormatter";
import { useRouteMatch } from "react-router-dom";

const Wrapper = styled.div``;

const FilesBody = (props) => {
    const { className = "", folder, history, dictionary, folders} = props;
    const { url } = useRouteMatch();

    const [breadcrumb, setBreadcrumbAfterParent] = useState(false);

    const backToAllFiles = () => {
        let pathname = history.location.pathname.split("/folder/")[0];
        history.push(pathname);
    };

    const backToFolder = (folder) => {
        // console.log(folders)
        // Get parent from parent and loop trought this array. After certain then ... with on click dropdown containing the rest

        let pathname = url.split("/folder/")[0];
        history.push(pathname + `/folder/${folder.id}/${replaceChar(folder.name)}`);
    };

    let bami = '';

    const findFolderParentById = (ID) => {
        // console.log('das this worksss' + ID)

        // setBreadcrumbAfterParent(ID + 'wadupppsss?');

        // Object.values(folders).forEach((val) => {
        //     if(val.id === currentParentFolderId && val.parent_folder) {
        //         console.log(val.id, val.search, val.parent_folder); // the value of the current key.
        //         // if(val.parent)
        //     }
        // });
    };

    useEffect(() => {
        console.log('searching for:')
        // console.log(folder.parent_folder.id)
        console.log(folders)

        let newBreadcrumbDots = [];
        if(folder.parent_folder) {
            Object.values(folders).forEach((val) => {
                if(val.id === folder.parent_folder.id) {
                    if(val.parent_folder) {
                        console.log('got a parent of the parent');
                        console.log(folder.parent_folder, val.parent_folder)


                        // Put in: val.parent_folder in de array

                        // Repeat
                    }
                }
            });
        }



    }, [folder]);




  return (
    <Wrapper className={`files-breadcrumb d-flex ${className}`}>
        <h6 onClick={backToAllFiles} className="font-size-11 text-uppercase mb-4">
            {dictionary.allFiles} &gt;
        </h6>
        {folder.parent_folder && (
            <>

                { breadcrumb }


                <h6 onClick={() => backToFolder(folder.parent_folder)} className="font-size-11 text-uppercase mb-4">
                {folder.parent_folder.name} &gt;
                </h6>
            </>
        )}
        <h6 className="font-size-11 text-uppercase mb-4">{folder.search}</h6>

        <h6>{ bami }</h6>
    </Wrapper>
  );
};

export default React.memo(FilesBody);
