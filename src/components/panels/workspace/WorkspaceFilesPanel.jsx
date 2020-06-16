import React, {useCallback, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {useFiles, useTranslation} from "../../hooks";
import {FilesBody, FilesHeader, FilesSidebar} from "../files";
import {addToModals} from "../../../redux/actions/globalActions";


const Wrapper = styled.div`
    .app-sidebar-menu {
        overflow: hidden;
        outline: currentcolor none medium;
    }    
`;

const WorkspaceFilesPanel = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();
    const {_t} = useTranslation();
    const {wsFiles, actions, topic} = useFiles();

    console.log(wsFiles)

    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");

    const refs = {
        dropZone: useRef(null),
    };

    const handleFilterFile = useCallback((e) => {
        setFilter(e.target.dataset.filter);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, [setSearch]);

    const dictionary = {
        createFolder: _t("CREATE_FOLDER", "Create folder"),
        create: _t("CREATE", "Create"),
        updateFolder: _t("UPDATE_FOLDER", "Update folder"),
        update: _t("UPDATE", "Update"),
    };

    const folderName = useRef("");

    const handleCreateFolder = () => {
        if (topic) {
            actions.createFolder({
                topic_id: topic.id,
                name: folderName.current
            })
        }
    };

    const handleUpdateFolder = () => {
        if (topic) {
            // actions.createFolder({
            //     topic_id: topic.id,
            //     name: folderName.current
            // })
        }
    };

    const handleFolderClose = () => {
        folderName.current = "";
    };

    const handleFolderNameChange = (e) => {
        folderName.current = e.target.value.trim();
    };

    const handleAddEditFolder = (mode = "add", name = "") => {
        let payload = {
            type: "single_input",
            defaultValue: "",
            onChange: handleFolderNameChange,
            onClose: handleFolderClose,
        };
        if (mode === "add") {
            payload = {
                ...payload,
                title: dictionary.createFolder,
                labelPrimaryAction: dictionary.create,
                onPrimaryAction: handleCreateFolder,
            };
        } else {
            folderName.current = name;
            payload = {
                ...payload,
                defaultValue: name,
                title: dictionary.updateFolder,
                labelPrimaryAction: dictionary.update,
                onPrimaryAction: handleUpdateFolder,
            };
        }
        
        dispatch(
            addToModals(payload),
        );
    }

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row app-block">
                <FilesSidebar dropZoneRef={refs.dropZone} className="col-md-3" filterFile={handleFilterFile}
                              filter={filter} wsFiles={wsFiles}/>
                <div className="col-md-9 app-content">
                    <div className="app-content-overlay"/>
                    <FilesHeader dropZoneRef={refs.dropZone} onSearchChange={handleSearchChange} 
                        wsFiles={wsFiles} handleAddEditFolder={handleAddEditFolder}/>
                    <FilesBody dropZoneRef={refs.dropZone} filter={filter} search={search} wsFiles={wsFiles} handleAddEditFolder={handleAddEditFolder}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceFilesPanel);