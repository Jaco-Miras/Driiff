import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {replaceChar} from "../../../../helpers/stringFormatter";
import {useRouteMatch} from "react-router-dom";
import {FilesBreadcrumbDropdown} from "../../dropdown";
import {SvgIconFeather} from "../../../common";

const Wrapper = styled.div`
    letter-spacing: 0.5px;
    font-weight: 500;
    line-height: 1;
    height: 37px;
    align-items: center;
    ul {
        list-style-type: none;
        padding: 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        li {
            height: 100%;
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        > svg {
            margin: 0 6px;
        }
    }
`;

const CompanyFilesBody = (props) => {
    const {className = "", folder, history, dictionary, folders, workspaceID} = props;
    const {url} = useRouteMatch();

    const [parentBreadcrumb, setParentBreadcrumb] = useState(false);

    const backToAllFiles = () => {
        let pathname = history.location.pathname.split("/folder/")[0];
        history.push(pathname);
    };

    const backToFolder = (folder) => {
        let pathname = url.split("/folder/")[0];
        history.push(pathname + `/folder/${folder.id}/${replaceChar(folder.name)}`);
    };

    useEffect(() => {
        if (folder.parent_folder) {
            Object.values(folders).forEach((val) => {
                if (val.id === folder.parent_folder.id) {
                    if (val.parent_folder) {
                        setParentBreadcrumb(true);
                    } else {
                        setParentBreadcrumb(false);
                    }
                }
            });
        }
        if (!folder.parent_folder) {
            setParentBreadcrumb(false);
        }
    }, [folder]);

    return (
      <Wrapper className={`files-breadcrumb d-flex ${className}`}>
          <ul className="font-size-11 text-uppercase mb-4">
              <li onClick={backToAllFiles}>{dictionary.allFiles}</li>
              <SvgIconFeather width={12} icon="chevron-right"/>

              {parentBreadcrumb && (
                <>
                    <li><FilesBreadcrumbDropdown parentFolder={folder.parent_folder} workspaceID={workspaceID}
                                                 history={history}/></li>
                    <SvgIconFeather width={12} icon="chevron-right"/>
                </>
              )}

              {folder.parent_folder && (
                <>
                    <li onClick={() => backToFolder(folder.parent_folder)}>{folder.parent_folder.name}</li>
                    <SvgIconFeather width={12} icon="chevron-right"/>
                </>
              )}
              <div>{folder.search}</div>
          </ul>
      </Wrapper>
    );
};

export default React.memo(CompanyFilesBody);
