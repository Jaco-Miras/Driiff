import React, {useEffect, useState} from "react";
import styled from "styled-components";

const ClosePreview = styled.span`
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
    i{
        color: #ddd;
    }
    :hover i{
        color: #676767;
        cursor: pointer;
    }
`;

const UnfurlPrio = props => {
    const {prio} = props;
    const [priority, setPriority] = useState("Medium");

    useEffect(() => {
        if (prio === 4) {
            setPriority("Critical");
        } else if (prio === 3) {
            setPriority("High");
        } else if (prio === 2) {
            setPriority("Medium");
        } else {
            setPriority("Low");
        }
    }, [prio]);
    return <span className='unfurl-priority'><strong>Priority</strong> -- {priority}</span>;
};

const Unfurl = props => {
    const {unfurlData, channelId = null, boardId = null, taskId = null, messageId, isAuthor, deleteUnfurlAction, removeUnfurl, type = "chat"} = props;
    const [fromDriff, setFromDriff] = useState(false);
    const handleRemoveUnfurlData = id => {
        deleteUnfurlAction({unfurl_id: id, type: type});
        if (type === "task") {
            removeUnfurl({unfurl_id: id, board_id: boardId, task_id: taskId, message_id: messageId});
        } else {
            removeUnfurl({unfurl_id: id, channel_id: channelId, message_id: messageId});
        }
    };

    useEffect(() => {
        let data = unfurlData.filter(link => {
            if (link.data.is_deleted === undefined) {
                return true;
            } else {
                return false;
            }
        });
        if (data.length) {
            const {REACT_APP_localDNSName} = process.env;
            if (data[0].data.url && data[0].data.url.includes(REACT_APP_localDNSName)) {
                setFromDriff(true);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return unfurlData.filter(link => {
        if (link.data.is_deleted === undefined) {
            return true;
        } else {
            return false;
        }
    }).slice(0, 1).map((item, key) => {
        //let item_description = (item.data.code) ? item.data.code : item.data.description;
        if (item.data.title === "PRIVATE CONTENT" || item.data.title === "NOT AUTHORIZED") return null;
        else return (
            <blockquote className={`blockquote component-un-furl`} key={key}>
                <div className={`media media-${item.data.type}`}>
                    {
                        // (item.data.image && !item.data.code) && !fromDriff ?
                        //     <img className={`item-image`} src={item.data.image}
                        //          title={item.data.title} alt={item.data.title}/> : ''
                    }
                    <div className={`media-wrapper`}>
                        <div className={`media-header`}>
                            {
                                !fromDriff &&
                                <p>
                                    <img alt='provider' className={`provider-icon`} src={item.data.provider_icon}/>
                                    <a className={`provider-name`} href={item.data.provider_url}
                                       title={item.data.provider_name}
                                       target="_blank" rel="noopener noreferrer">{item.data.provider_name}</a>
                                    {
                                        (item.data.author_name) ? <span
                                            className="item-author-name"> | {item.data.author_name}</span> : ""
                                    }
                                </p>
                            }
                        </div>
                        <div className="media-body">
                            <h6 className={`item-title`}>
                                <a href={item.data.url}
                                   title={item.data.title}
                                   target="_blank"
                                   rel="noopener noreferrer">{item.data.title}
                                </a>
                            </h6>
                            <div className={`description`}
                                 dangerouslySetInnerHTML={{__html: item.data.description}}/>
                        </div>
                        {
                            item.data.task_status &&
                            <div className='unfurl-task-data'>
                                <span
                                    className='unfurl-status'><strong>Status</strong> -- {item.data.task_status} </span>
                                <UnfurlPrio prio={item.data.task_priority}/>
                                <br/>
                                {
                                    item.data.task_participants && item.data.task_participants.length ?
                                        <span
                                            className='unfurl-assignees'><strong>Assignees</strong> -- {item.data.task_participants.map(p => p.name).join(", ")}</span>
                                        : null
                                }

                            </div>
                        }
                    </div>
                </div>
                {
                    isAuthor && <ClosePreview
                        onClick={e => handleRemoveUnfurlData(item.id)}>
                        <i className="fas fa-times"></i>
                    </ClosePreview>
                }
            </blockquote>
        );
    });
};

export default React.memo(Unfurl);