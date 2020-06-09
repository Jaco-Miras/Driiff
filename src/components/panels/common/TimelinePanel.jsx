import React from "react";
import styled from "styled-components";
import {AttachFileTimeline, MemberTimeline, PostTimeline} from "../dashboard/timeline";

const Wrapper = styled.div`
`;

const TimelinePanel = (props) => {

    const {className = ""} = props;

    const timeline = [
        {
            type: "post",
            item: {
                created_at: {
                    timestamp: 1591630300,
                },
                user: {
                    name: "Sample name",
                    profile_image_link: "https://admin.drevv.com/user-profile/2?timestamp=1589737866",
                },
                body: <>
                    Sample post that has file attachments.
                </>,
                files: [
                    {
                        "rawFile": {},
                        "type": "IMAGE",
                        "id": "ggWzh1hws",
                        "status": false,
                        "src": "https://miro.medium.com/max/3000/1*MI686k5sDQrISBM6L8pf5A.jpeg",
                        "name": "empty-sea-beach-background_74190-313.jpg",
                    },
                    {
                        "rawFile": {},
                        "type": "IMAGE",
                        "id": "68ylv-PNrN",
                        "status": false,
                        "src": "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg",
                        "name": "2020-04-06_1843.png",
                    },
                    {
                        "rawFile": {},
                        "type": "IMAGE",
                        "id": "9fj7PXIfN2",
                        "status": false,
                        "src": "https://mht.wtf/post/content-aware-resize/sample-image.jpeg",
                        "name": "petition.png",
                    },
                ],
            },
        },
        {
            type: "post",
            item: {
                created_at: {
                    timestamp: 1591630300,
                },
                user: {
                    name: "Sample name",
                    profile_image_link: "https://admin.drevv.com/user-profile/2?timestamp=1589737866",
                },
                body: <>
                    Sample post with no file attachment.
                </>,
                files: [],
            },
        },
        {
            type: "post",
            item: {
                created_at: {
                    timestamp: 1591630300,
                },
                user: {
                    name: "Sample name",
                    profile_image_link: "https://admin.drevv.com/user-profile/2?timestamp=1589737866",
                },
                body: <>
                    <p>Long text</p>
                    Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero Oliver
                    Paul Quincy Randolph Sherman Thomas Uncas Victor William Xerxes Yancy Zeus
                    Wolfeschlegel­steinhausen­bergerdorff­welche­vor­altern­waren­gewissenhaft­schafers­wessen­schafe­waren­wohl­gepflege­und­sorgfaltigkeit­beschutzen­vor­angreifen­durch­ihr­raubgierig­feinde­welche­vor­altern­zwolfhundert­tausend­jahres­voran­die­erscheinen­von­der­erste­erdemensch­der­raumschiff­genacht­mit­tungstein­und­sieben­iridium­elektrisch­motors­gebrauch­licht­als­sein­ursprung­von­kraft­gestart­sein­lange­fahrt­hinzwischen­sternartig­raum­auf­der­suchen­nachbarschaft­der­stern­welche­gehabt­bewohnbar­planeten­kreise­drehen­sich­und­wohin­der­neue­rasse­von­verstandig­menschlichkeit­konnte­fortpflanzen­und­sich­erfreuen­an­lebenslanglich­freude­und­ruhe­mit­nicht­ein­furcht­vor­angreifen­vor­anderer­intelligent­geschopfs­von­hinzwischen­sternartig­raum
                    Sr.
                </>,
                files: [],
            },
        },
        {
            type: "member",
            item: {
                action: "leave",
                created_at: {
                    timestamp: 1591630300,
                },
                user: {
                    name: "Sample name",
                    profile_image_link: "https://admin.drevv.com/user-profile/2?timestamp=1589737866",
                },
            },
        },
        {
            type: "member",
            item: {
                action: "join",
                created_at: {
                    timestamp: 1591630300,
                },
                user: {
                    name: "Sample name",
                    profile_image_link: "https://admin.drevv.com/user-profile/2?timestamp=1589737866",
                },
            },
        },
        {
            type: "file",
            item: {
                created_at: {
                    timestamp: 1591630300,
                },
                user: {
                    name: "Sample name",
                    profile_image_link: "https://admin.drevv.com/user-profile/2?timestamp=1589737866",
                },
                files: [
                    {
                        "rawFile": {},
                        "type": "IMAGE",
                        "id": "ggWzh1hws",
                        "status": false,
                        "src": "https://miro.medium.com/max/3000/1*MI686k5sDQrISBM6L8pf5A.jpeg",
                        "name": "empty-sea-beach-background_74190-313.jpg",
                    },
                    {
                        "rawFile": {},
                        "type": "IMAGE",
                        "id": "68ylv-PNrN",
                        "status": false,
                        "src": "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg",
                        "name": "2020-04-06_1843.png",
                    },
                    {
                        "rawFile": {},
                        "type": "IMAGE",
                        "id": "9fj7PXIfN2",
                        "status": false,
                        "src": "https://mht.wtf/post/content-aware-resize/sample-image.jpeg",
                        "name": "petition.png",
                    },
                ],
            },
        },
        {
            type: "file",
            item: {
                created_at: {
                    timestamp: 1591630300,
                },
                user: {
                    name: "Sample name",
                    profile_image_link: "https://admin.drevv.com/user-profile/2?timestamp=1589737866",
                },
                files: [
                    {
                        "rawFile": {},
                        "type": "IMAGE",
                        "id": "ggWzh1hws",
                        "status": false,
                        "src": "https://miro.medium.com/max/3000/1*MI686k5sDQrISBM6L8pf5A.jpeg",
                        "name": "empty-sea-beach-background_74190-313.jpg",
                    },
                ],
            },
        },
    ];

    return (
        <Wrapper className={`timeline-panel card ${className}`}>
            <div className="card-body">
                <h5 className="card-title">Timeline</h5>
                <p>The timeline of a dashboard shows a certain activity with a timestamp. This timeline is the same for
                    everyone.</p>
                <p>The sorting is; the latest activity on top.</p>
                Activities in the timeline:
                <ul>
                    <li>Created post</li>
                    <li>Create file</li>
                    <li>Create workspace</li>
                    <li>Member Join</li>
                    <li>Member Leave</li>
                </ul>

                <div className="timeline">
                    {
                        timeline.map(t => {
                            switch (t.type) {
                                case "member":
                                    return <MemberTimeline member={t.item}/>;
                                case "post":
                                    return <PostTimeline post={t.item}/>;
                                case "file":
                                    return <AttachFileTimeline data={t.item}/>;
                            }
                        })
                    }
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(TimelinePanel);
