import momentTZ from "moment-timezone";
import React, {useCallback} from "react";
import Select from "react-select";
import {CustomInput, FormGroup} from "reactstrap";
import styled from "styled-components";
import Flag from "../../common/Flag";
import {useTranslation} from "../../hooks";

const Wrapper = styled.div`
    
    .card {
        overflow: visible;
    }
`;

const ProfileSettings = (props) => {

    const {className = ""} = props;

    const {_t, setLocale} = useTranslation();

    const languageOptions = [
        {
            value: "en",
            label: <><Flag countryAbbr="en" className="mr-2" width="18"/>{_t("LANGUAGE.ENGLISH", "English")}</>,
        },
        {value: "nl", label: <><Flag countryAbbr="nl" className="mr-2" width="18"/>{_t("LANGUAGE.DUTCH", "Dutch")}</>},
        {
            value: "de",
            label: <><Flag countryAbbr="de" className="mr-2" width="18"/>{_t("LANGUAGE.GERMAN", "German")}</>,
        },
    ];

    const TimezoneOptions = momentTZ.tz.names().map(tz => {
        return {
            value: tz,
            label: tz,
        };
    });

    const handleSwitchToggle = useCallback((e) => {
        e.persist();
        const {name, checked} = e.target;
        console.log(name);
        console.log(checked);
    }, []);

    const handleTimezoneChange = useCallback((e) => {
        console.log(e);
    }, []);

    const handleInputChange = useCallback((e) => {
        console.log(e);
    }, []);

    return (
        <Wrapper className={`profile-settings ${className}`}>
            <div className="card">
                <div className="card-body">
                    <h6>Chat Settings</h6>
                    <FormGroup>
                        <CustomInput
                            type="switch"
                            id="sound"
                            name="sound"
                            onChange={handleSwitchToggle}
                            label="Play a sound when receiving a new chat message"
                        />
                    </FormGroup>
                    <FormGroup>
                        <CustomInput
                            type="switch"
                            id="channel_sort"
                            name="channel_sort"
                            onChange={handleSwitchToggle}
                            label="Sort channel by latest/channel name"
                        />
                    </FormGroup>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h6>Localization</h6>

                    <div className="row mb-2">
                        <div className="col-6 text-muted">Language</div>
                        <div className="col-6">
                            <Select onChange={handleInputChange} options={languageOptions}/>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-6 text-muted">Timezone</div>
                        <div className="col-6">
                            <Select options={TimezoneOptions}/>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>);
};

export default React.memo(ProfileSettings);