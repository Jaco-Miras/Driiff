import moment from "moment";
import React, {useState} from "react";
import DateTimePicker from "react-datetime-picker";
import {useDispatch} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
//import toaster from "toasted-notes";
import {postSnooze, removePost} from "../../redux/actions/postActions";
import {clearModal} from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import {ModalHeaderSection} from "./index";
import {useToaster} from "../hooks";


const InputContainer = styled.div`
    display: flex;
    width: 100%;
    flex-flow: column;
    > div {
        margin-bottom: 10px;
    }
`;

const PostSnoozeModal = props => {

    const {type, post, topic_id} = props.data;

    const dispatch = useDispatch();
    //const user = useSelector(state => state.session.user);
    const toaster = useToaster();

    const minD = new Date();
    const m = minD.getMinutes();
    minD.setMinutes(m+1);

    const [setTimeValue, setSetTimeValue] = useState(`20m`);
    const [customTimeValue, setCustomTimeValue] = useState(minD);
    const [showDateTimePicker, setShowDateTimePicker] = useState(null);
    const [validDate, setValidDate] = useState(true);

    const [modal, setModal] = useState(true);
    const toggle = () => {
        setModal(!modal);
        dispatch(
            clearModal({type: type}),
        );
    };

    const handleSetSnoozeTime = (e, setTime) => {
        setShowDateTimePicker(false);
        setSetTimeValue(setTime);
        setValidDate(true);
    };

    const handlePickDateTime = (e) => {
        const minDate = new Date();
        if (e > minDate) {
            setCustomTimeValue(e);
            setValidDate(true);
        } else {
            setValidDate(false);
        }
        //setSetTimeValue(formatDateISO8601(e));
    };

    const handleSelectPickDateTime = (e) => {
        setSetTimeValue("pick_data");
        setShowDateTimePicker(true);
        setValidDate(true);
    };

    const handleSnooze = (e) => {
        
        let payload = {
            post_id: post.id,
            set_time: setTimeValue === "pick_data" ? moment.utc(new Date(customTimeValue)).format("YYYY-MM-DD HH:mm:ss") : setTimeValue,
        };

        dispatch(
            postSnooze(payload, (err, res) => {
                toggle();
                if (err) return;
                dispatch(
                    removePost({
                        post_id: post.id,
                        topic_id: topic_id
                    })
                )
                let messageTime = "";
                let today = new Date();
                switch (setTimeValue) {
                    case "2m":
                        today.setMinutes(today.getMinutes() + 2);
                        messageTime = `for 2 minutes.`;
                        break;
                    case "20m":
                        today.setMinutes(today.getMinutes() + 20);
                        messageTime = `for 20 minutes.`;
                        break;
                    case "1h":
                        today.setHours(today.getHours() + 1);
                        messageTime = `for an hour.`;
                        break;
                    case "3h":
                        today.setHours(today.getHours() + 3);
                        messageTime = `for 3 hours`;
                        break;
                    case "tomorrow":
                        today.setDate(today.getDate() + 1);
                        messageTime = `for a day`;
                        break;
                    case "next_week":
                        today.setDate(today.getDate() + 7);
                        messageTime = `for a a week`;
                        break;
                    case "pick_data":
                        messageTime = `until ${moment(new Date(customTimeValue)).format("YYYY-MM-DD HH:mm")}`;
                        break;
                    default:
                        messageTime = setTimeValue + "";
                        break;
                }

                toaster.success(`You snoozed this ${post.title} ${messageTime}`,
                    {position: "bottom-left"});
            }),
        );
    };

    return (
        <Modal isOpen={modal} toggle={toggle} centered className='chat-forward-modal'>
            <ModalHeaderSection toggle={toggle}>
                Snooze post
            </ModalHeaderSection>
            <ModalBody>
                <InputContainer>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetSnoozeTime(e, `2m`);
                        }}
                        checked={setTimeValue === `2m`}
                        value={`2m`}
                        name={`role`}>
                        2 minutes
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetSnoozeTime(e, `20m`);
                        }}
                        checked={setTimeValue === `20m`}
                        value={`20m`}
                        name={`role`}>
                        20 minutes
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetSnoozeTime(e, `1h`);
                        }}
                        checked={setTimeValue === `1h`}
                        value={`1h`}
                        name={`role`}>
                        1 hour
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetSnoozeTime(e, `3h`);
                        }}
                        checked={setTimeValue === `3h`}
                        value={`3h`}
                        name={`role`}>
                        3 hours
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetSnoozeTime(e, `tomorrow`);
                        }}
                        checked={setTimeValue === `tomorrow`}
                        value={`tomorrow`}
                        name={`role`}>
                        Tomorrow
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={e => {
                            handleSetSnoozeTime(e, `next_week`);
                        }}
                        checked={setTimeValue === `next_week`}
                        value={`next_week`}
                        name={`role`}>
                        Next Week
                    </RadioInput>
                    <RadioInput
                        readOnly
                        onClick={handleSelectPickDateTime}
                        checked={setTimeValue === `pick_data`}
                        value={`pick_data`}
                        name={`role`}>
                        Pick date and time
                    </RadioInput>
                    {
                        showDateTimePicker &&
                        <DateTimePicker
                            minDate={minD}
                            onChange={handlePickDateTime}
                            value={customTimeValue}
                            disableClock={true}
                        />
                    }
                </InputContainer>
                {
                    validDate === false &&
                    <div>
                        Date time is invalid. Please select new date time.
                    </div>
                }
            </ModalBody>
            <ModalFooter>
                <Button disabled={!validDate} color="primary" onClick={handleSnooze}>Snooze</Button>{" "}
                <Button outline color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default React.memo(PostSnoozeModal);