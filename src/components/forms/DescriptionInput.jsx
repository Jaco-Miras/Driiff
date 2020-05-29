import React, {useRef} from "react";
import styled from "styled-components";
import {InputGroup, Label} from "reactstrap";
import QuillEditor from "./QuillEditor";
import {useQuillModules} from "../hooks";

const WrapperDiv = styled(InputGroup)`
    display: flex;
    align-items: center;
    margin: 20px 0;
    label {
        white-space: nowrap;
        margin: 0 20px 0 0;
        min-width: 109px;
    }
    button {
        margin-left: auto;
    }
    .react-select-container {
        width: 100%;
    }
    .react-select__multi-value__label {
        align-self: center;
    }
`;

const StyledQuillEditor = styled(QuillEditor)`
    flex: 1 0 0;
    width: 1%;
    height: 80px;
    
    &.description-input {
        border: 1px solid #afb8bd;
        border-radius: 5px;
        max-height: 130px;
        overflow: auto;
        overflow-x: hidden;
        position: static;
        width: 100%;
    }
    .ql-toolbar {
        position: absolute;
        top: 100%;
        padding: 0;
        border: none;
        .ql-formats {
            margin-right: 10px;
        }
    }
    .ql-container {
        border: none;
    }
    .ql-editor {
        padding: 5px;
    }
`;

const DescriptionInput = props => {

    const {onChange} = props;
    
    const reactQuillRef = useRef();

    const [modules] = useQuillModules("description");

    return (
        <WrapperDiv>
            <Label for="firstMessage">Description</Label>
            <StyledQuillEditor
                className="description-input"
                modules={modules}
                ref={reactQuillRef}
                onChange={onChange}
            />
        </WrapperDiv>
    )
};

export default DescriptionInput;