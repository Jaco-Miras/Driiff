import momentTZ from "moment-timezone";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import Select from "react-select";
import {CustomInput} from "reactstrap";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";
import Flag from "../../common/Flag";
import {useSettings, useTranslation} from "../../hooks";
import {getDriffName} from "../../hooks/useDriff";

const Wrapper = styled.div`
    .card {
        overflow: visible;
    }
    
    .custom-switch {
        padding: 0;
        min-height: 34px;
        justify-content: left;
        align-items: center;
        display: flex;

        
        .custom-control-label::after{
            right: 4px;
            left: auto;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 100%;            
            top: 2px;            
        }
        
        input[type="checkbox"]:checked + .custom-control-label::after {
            right: -22px;
        }

        .custom-control-label::before {
            right: -2.35rem;
            left: auto;
            width: 4rem;
            height: 1.5rem;
            border-radius: 25px;
            top: 0;
        }
        
        input {
            cursor: pointer;
        }
        label {
            cursor: pointer;
            width: calc(100% - 40px);
            min-height: 25px;
            display: flex;
            align-item: center;
            
            span {
                display: block;
                width: calc(100% - 35px);
                line-height: 1;
            }
        }
    }
`;

const ProfileSettings = (props) => {

    const {className = ""} = props;

    const {user: loggedUser} = useSelector(state => state.session);

    const {
        generalSettings: {language, timezone},
        chatSettings: {order_channel, sound_enabled},
        userSettings: isLoaded,
        setChatSetting,
        setGeneralSetting,
    } = useSettings();
    const {_t, setLocale} = useTranslation();

    const channelSortOptions = [
        {
            value: "channel_date_updated",
            label: _t("GENERAL.RECENT", "Recent activity"),
        },
        {
            value: "channel_name",
            label: _t("GENERAL.CHANNEL_NAME", "Channel name"),
        },
    ];

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

    const handleLanguageChange = (e) => {
        setLocale(e.value);
    };

    const handleChatSwitchToggle = useCallback((e) => {
        e.persist();
        const {name, checked} = e.target;
        setChatSetting({
            [name]: checked,
        });
    }, [setChatSetting]);

    const handleSortChannelChange = (e) => {
        setChatSetting({
            order_channel: {
                order_by: e.value,
                sort_by: e.value === "channel_date_updated" ? "DESC" : "ASC",
            },
        });
    };

    const handleTimezoneChange = useCallback((e) => {
        setGeneralSetting({timezone: e.value});
    }, []);

    const handleSystemSettingsClick = () => {
        window.open(`https://${getDriffName()}.driff.io/admin`, "Admin");
    };

    if (!isLoaded)
        return <></>;

    return (
        <Wrapper className={`profile-settings ${className}`}>
            {
                loggedUser.role.name === "owner" &&
                <div className="card">
                    <div className="card-body">
                        <h6 className="card-title d-flex justify-content-between align-items-center mb-0">System
                            Settings <SvgIconFeather
                                className="cursor-pointer" icon="settings"
                                onClick={handleSystemSettingsClick}/></h6>
                    </div>
                </div>
            }
            <div className="card">
                <div className="card-body">
                    <h6 className="card-title d-flex justify-content-between align-items-center">Chat Settings</h6>
                    <div className="row mb-2">
                        <div className="col-12">
                            <CustomInput
                                className="cursor-pointer text-muted"
                                checked={sound_enabled}
                                type="switch"
                                id="chat_sound_enabled"
                                name="sound_enabled"
                                onChange={handleChatSwitchToggle}
                                label={<span>Play a sound when receiving a new chat message</span>}
                            />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-6 text-muted">Sort channel by</div>
                        <div className="col-6">
                            <Select value={channelSortOptions.find(o => o.value === order_channel.order_by)}
                                    onChange={handleSortChannelChange} options={channelSortOptions}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h6 className="card-title d-flex justify-content-between align-items-center">Localization</h6>

                    <div className="row mb-2">
                        <div className="col-6 text-muted">Language</div>
                        <div className="col-6">
                            <Select
                                value={languageOptions.find(o => o.value === language)}
                                onChange={handleLanguageChange}
                                options={languageOptions}/>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-6 text-muted">Timezone</div>
                        <div className="col-6">
                            <Select
                                value={TimezoneOptions.find(o => o.value === timezone)}
                                onChange={handleTimezoneChange}
                                options={TimezoneOptions}/>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>);
};

export default React.memo(ProfileSettings);