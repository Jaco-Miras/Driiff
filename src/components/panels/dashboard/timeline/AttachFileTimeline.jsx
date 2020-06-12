import React from "react";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";
import {Avatar} from "../../../common";

const Wrapper = styled.div`
`;

const AttachFileTimeline = (props) => {

    const {className = "", data} = props;

    return (
        <Wrapper className={`timeline-item ${className}`}>
            <div>
                <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link}/>
            </div>
            {
                data.files.length === 1 &&
                <div>
                    <h6 className="d-flex justify-content-between mb-4">
                        <span>
                            <a href="#">{data.user.name}</a> attached a file
                        </span>
                        <span
                            className="text-muted font-weight-normal">{localizeChatTimestamp(data.created_at.timestamp)}</span>
                    </h6>
                    <a href="#">
                        <div className="mb-3 border p-3 border-radius-1">
                            <i className="fa fa-file-pdf-o mr-2"/> {data.files[0].name}
                        </div>
                    </a>
                </div>
            }
            {
                data.files.length > 1 &&
                <div>
                    <h6 className="d-flex justify-content-between mb-4">
                        <span>
                            <a href="#">{data.user.name}</a> shared files
                        </span>
                        <span
                            className="text-muted font-weight-normal">{localizeChatTimestamp(data.created_at.timestamp)}</span>
                    </h6>
                    <div className="row row-xs">
                        {
                            data.files.map(f => {
                                return (
                                    <div key={f.id} className="col-xl-2 col-lg-3 col-md-4 col-sx-6">
                                        <figure>
                                            <img src={f.src}
                                                 className="w-100 border-radius-1"
                                                 alt={f.name}/>
                                        </figure>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            }
        </Wrapper>
    );
};

export default React.memo(AttachFileTimeline);