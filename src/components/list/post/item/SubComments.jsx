import React from "react";
import styled from "styled-components";
import {Comment} from "./index";

const SubComments = props => {

    const {comments, post, commentActions, parentId, user, onShowFileDialog, dropAction} = props;
    
    return (
        comments &&
        <ul>
            {
                Object.values(comments).map(c => {
                    return <Comment key={c.id} comment={c} type="sub" post={post} user={user} 
                    commentActions={commentActions} parentId={parentId}
                    onShowFileDialog={onShowFileDialog} dropAction={dropAction}
                />
                })
            }
        </ul>
    )
};

export default React.memo(SubComments);