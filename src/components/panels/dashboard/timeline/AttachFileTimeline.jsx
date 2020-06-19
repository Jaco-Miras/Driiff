import React from "react";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../../helpers/momentFormatJS";
import {Avatar} from "../../../common";
import useFileActions from "../../../hooks/useFileActions";

const Wrapper = styled.div`
    .timeline-file-icon  {
        color: #505050;
        display: flex;
        align-items: center;
        i {
            margin-right: 8px;
            display: inline-block;
            filter: brightness(0) saturate(100%);
        }
    }
    .file-text

`;

const AttachFileTimeline = (props) => {

    const {className = "", data} = props;
    const fileHandler = useFileActions();

    return (
        <Wrapper className={`attach-file-timeline timeline-item ${className}`}>
            <div>
                <Avatar className="mr-3" name={data.user.name} imageLink={data.user.profile_image_link}/>
            </div>
            {
                <div>
                    <h6 className="d-flex justify-content-between font-weight-bold mb-4">
                        <span>
                            <a href="#" className="font-weight-normal">{data.user.name}</a> <span class="file-summary"></span>attached a file
                        </span>
                        <span
                            className="text-muted font-weight-normal">{localizeChatTimestamp(data.created_at.timestamp)}</span>
                    </h6>
                    <div className="mb-3 border p-3 border-radius-1">
                        <a href={data.view_link} target="_blank" className="timeline-file-icon">
                            {fileHandler.getFileIcon(data.mime_type)} <span>{data.name}</span>
                        </a>
                    </div>
                </div>
            }
            {
                // data.files.length > 1 &&
                // <div>
                //     <h6 className="d-flex justify-content-between mb-4">
                //         <span>
                //             <a href="#">{data.user.name}</a> shared files
                //         </span>
                //         <span
                //             className="text-muted font-weight-normal">{localizeChatTimestamp(data.created_at.timestamp)}</span>
                //     </h6>
                //     <div className="row row-xs">
                //         {
                //             data.files.map(f => {
                //                 return (
                //                     <div key={f.id} className="col-xl-2 col-lg-3 col-md-4 col-sx-6">
                //                         <figure>
                //                             <img src={f.src}
                //                                  className="w-100 border-radius-1"
                //                                  alt={f.name}/>
                //                         </figure>
                //                     </div>
                //                 );
                //             })
                //         }
                //     </div>
                // </div>
            }
        </Wrapper>
    );
};

export default React.memo(AttachFileTimeline);