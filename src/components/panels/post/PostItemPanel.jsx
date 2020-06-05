import React from "react";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {AvatarGroup, SvgIconFeather} from "../../common";
import {CheckBox} from "../../forms";
import {favoritePost} from "../../../redux/actions/postActions";

const Wrapper = styled.li`
`;

const PostItemPanel = (props) => {

    const dispatch = useDispatch();
    const {className = "", post} = props;

    const handleFavoritePost = () => {
        dispatch(
            favoritePost({type: "post", type_id: post.id})
        )
    }

    return (
        <Wrapper className={`list-group-item post-item-list ${className}`}>
            <div className="custom-control custom-checkbox custom-checkbox-success mr-2">
                <CheckBox name="test"/>
            </div>
            <div>
                <SvgIconFeather icon="star" onClick={handleFavoritePost}/>
            </div>
            <div className="flex-grow-1 min-width-0">
                <div className="mb-1 d-flex align-items-center justify-content-between">
                    <div className="app-list-title text-truncate">{post.title}</div>
                    <div className="pl-3 d-flex align-items-center">
                        <div className="mr-3 d-sm-inline d-none">
                            <div className="badge badge-danger">Category</div>
                        </div>
                        {
                            post.users_responsible.length > 0 &&
                            <AvatarGroup users={post.users_responsible}/>
                        }
                        {/* <div className="mr-3 d-sm-inline d-none">
                            <div className="avatar-group">
                                {
                                    post.users_responsible.length > 0 &&
                                    post.users_responsible.map(u => {
                                        return <Avatar name={u.name} imageLink={u.profile_image_link} id={u.id}/>
                                    })
                                }
                            </div>
                        </div> */}
                        <SvgIconFeather icon="trash-2"/>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(PostItemPanel);