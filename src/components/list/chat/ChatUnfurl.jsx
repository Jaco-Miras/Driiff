import React from "react";
import styled from "styled-components";

const ClosePreview = styled.span`
    position: absolute;
    right: 0;
    top: 0;
    i{
        color: #ddd;
    }
    :hover i{
        color: #676767;
        cursor: pointer;
    }
`;
const ChatUnfurl = props => {
    const {unfurlData, channelId, replyId, isAuthor, deleteChatUnfurlAction, removeChatUnfurlAction} = props;

    const handleRemoveUnfurlData = id => {
        deleteChatUnfurlAction({unfurl_id: id});
        removeChatUnfurlAction({unfurl_id: id, channel_id: channelId, reply_id: replyId});
    };
    return (
        unfurlData.filter(link => {
            if (link.data.is_deleted === undefined) {
                return true;
            } else {
                return false;
            }
        }).slice(0, 1).map((item, key) => {
            //let item_description = (item.data.code) ? item.data.code : item.data.description;

            return (
                <blockquote className={`blockquote component-un-furl`} key={key}>
                    <div className={`media media-${item.data.type}`}>
                        {
                            (item.data.image && !item.data.code) ?
                                <img className={`item-image`} src={item.data.image}
                                     title={item.data.title} alt={item.data.title}/> : ""
                        }
                        <div className={`media-wrapper`}>
                            <div className={`media-header`}>
                                <p><img alt='provider' className={`provider-icon`} src={item.data.provider_icon}/>
                                    <a className={`provider-name`} href={item.data.provider_url}
                                       title={item.data.provider_name}
                                       target="_blank" rel="noopener noreferrer">{item.data.provider_name}</a>
                                    {
                                        (item.data.author_name) ? <span
                                            className="item-author-name"> | {item.data.author_name}</span> : ""
                                    }</p>
                            </div>
                            <div className="media-body">
                                <h6 className={`item-title`}><a href={item.data.url}
                                                                title={item.data.title}
                                                                target="_blank"
                                                                rel="noopener noreferrer">{item.data.title}</a></h6>
                                <div className={`description`}
                                     dangerouslySetInnerHTML={{__html: item.data.description}}/>
                            </div>
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
        })
    );

};

export default React.memo(ChatUnfurl);