import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Modal, ModalFooter, ModalHeader} from "reactstrap";
import styled from "styled-components";
import {createChatMessage, setSelectedChannel} from "../../redux/actions/chatActions";
import {clearModal} from "../../redux/actions/globalActions";
import {SvgIconFeather} from "../common";
import SearchForm from "../forms/SearchForm";
import ChannelIcon from "../list/chat/ChannelIcon";

const IconButton = styled(SvgIconFeather)`
    cursor: pointer;
    cursor: hand;
    border: 1px solid #afb8bd;
    height: 38px;
    margin: -1px 5px;
    width: 40px;
    padding: 10px;
    border-radius: 8px;
    
    // &.feather-send {
    //     border: 1px solid #7a1b8b;
    //     background-color: #7a1b8b;
    //     color: #fff;
    // }
`;

const PopUpBody = styled.div`
    padding: 10px;
`;

const ChannelsContainer = styled.div`
    label {
        margin-top: .5rem;
        font-weight: 600;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 300px;
        max-height: 300px;
        overflow: auto;
    }
`;

const StlyedList = styled.li`
    padding: 5px 0;
    color: ${props => props.chosen ? "#972c86" : "#676767"};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    width: 100%;
    font-weight: ${props => props.chosen ? "600" : "500"};
    :hover {
        color: #972c86;
        font-weight: 600;
        .channel-icon {
            border: ${props => props.chosen ? "2px solid #972c86" : "1px solid #972c86"};
        }
    }
    .channel-icon {
        border: ${props => props.chosen ? "2px solid #972c86" : "1px solid #ddd"};
    }
`;

const StyledChannelIcon = styled(ChannelIcon)`
    // width: 30px;
    // height: 30px;
    // min-width: 30px;
`;

const StyledModalFooter = styled(ModalFooter)`
    justify-content: space-between;
    .chosen-channel-title {
        color: #7a1b8b;
        font-weight: 600;
    }
`;

const Search = styled(SearchForm)`
    margin: 0 0 1.5rem !important;
`;

const ChatForwardModal = props => {

    const {type, message} = props.data;

    const dispatch = useDispatch();
    const channels = useSelector(state => state.chat.channels);
    const [inputValue, setInputValue] = useState("");
    const [chosenChannel, setChosenChannel] = useState(null);

    const [modal, setModal] = useState(true);
    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleChosenChannel = (channel) => {
        setChosenChannel(channel);
    };

    const handleForwardMessage = () => {
        let payload = {
            channel_id: chosenChannel.id,
            body: message.body,
            mention_ids: [],
            file_ids: [],
            reference_id: require("shortid").generate(),
            reference_title: chosenChannel.title,
            is_transferred: 1,
        };

        chosenChannel.selected = true;
        dispatch(
            createChatMessage(payload, () => {
                chosenChannel.selected = true;
                dispatch(
                    setSelectedChannel(chosenChannel),
                );
            }),
        );
        toggle();
    };

    const handleSearch = () => {

    };

    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    const filteredChannels = Object.values(channels).filter(c => {
        if (c.is_archived === 0) {
            if (inputValue.trim() !== "") {
                if (c.title.toLowerCase().includes(inputValue.toLowerCase())) return true;
                else return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    });

    return (
        <Modal isOpen={modal} toggle={toggle} centered className='chat-forward-modal'>
            <ModalHeader toggle={toggle} className='bg-primary'>
                Transfer the message to
            </ModalHeader>
            <PopUpBody>
                <Search onChange={handleInputChange} onClick={handleSearch} placeholder="Channel search"/>
                <ChannelsContainer>
                    <label>Recent channels</label>
                    {
                        Object.keys(channels).length > 0 &&
                        <ul>
                            {
                                filteredChannels.map(channel => {
                                    return (
                                        <StlyedList key={channel.id}
                                                    onClick={() => handleChosenChannel(channel)}
                                                    chosen={chosenChannel && chosenChannel.id === channel.id}
                                        >
                                            <StyledChannelIcon
                                                className={"message-forward-popup"}
                                                channel={channel}
                                            />
                                            {channel.title}
                                        </StlyedList>
                                    );
                                })
                            }
                        </ul>
                    }
                </ChannelsContainer>
            </PopUpBody>
            {
                chosenChannel &&
                <StyledModalFooter>
                    <span className='chosen-channel-title'>{chosenChannel ? chosenChannel.title : null}</span>
                    <IconButton onClick={handleForwardMessage} icon="send" className={"bg-primary"}/>
                </StyledModalFooter>
            }
        </Modal>
    );
};

export default React.memo(ChatForwardModal);