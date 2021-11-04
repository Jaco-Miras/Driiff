import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
import { useSelector, useDispatch } from "react-redux";
import { postChatMessage, generateZoomSignature } from "../../redux/actions/chatActions";

const useZoomActions = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const apiKeys = {
    apiKey: "YUeAn0WiQcadAL9hcWzA2g",
    apiSecret: "VBrvh9uh41NLdZjkvpr5a4AgyI23DAPM1dyv",
  };

  const client = ZoomMtgEmbedded.createClient();
  let meetingSDKElement = document.getElementById("meetingSDKElement");
  client.init({
    debug: true,
    zoomAppRoot: meetingSDKElement,
    language: "en-US",
    // customize: {
    //   meetingInfo: ["topic", "host", "mn", "pwd", "telPwd", "invite", "participant", "dc", "enctype"],
    //   toolbar: {
    //     buttons: [
    //       {
    //         text: "Custom Button",
    //         className: "CustomButton",
    //         onClick: () => {
    //           console.log("custom button");
    //         },
    //       },
    //     ],
    //   },
    // },
  });

  const getSlug = () => {
    let driff = localStorage.getItem("slug");
    if (driff) {
      return driff;
    } else {
      const host = window.location.host.split(".");
      if (host.length === 3) {
        localStorage.setItem("slug", host[0]);
        return host[0];
      } else {
        return null;
      }
    }
  };

  const startMeeting = (signature, zoomCreateConfig) => {
    const config = {
      apiKey: apiKeys.apiKey,
      userName: user.name,
      userEmail: `${getSlug()}-${user.id}@${process.env.REACT_APP_apiDNSName}`,
      passWord: zoomCreateConfig.password,
      meetingNumber: zoomCreateConfig.meetingNumber,
      role: zoomCreateConfig.role,
      host: true,
    };

    client.join({
      apiKey: apiKeys.apiKey,
      signature: signature,
      meetingNumber: config.meetingNumber,
      password: config.passWord,
      userName: config.userName,
      userEmail: config.userEmail,
      success: () => {
        console.log("success");
      },
      error: () => {
        console.log("error");
      },
    });
  };

  const generateSignature = (config) => {
    dispatch(
      generateZoomSignature(config, (e, r) => {
        if (e) return;
        if (r) {
          startMeeting(r.data.signature, config);
        }
      })
    );
  };

  const createMessage = (id, config) => {
    //let messageBody = `<div>I started a ZOOM meeting: <a href="https://demo24.drevv.com/zoom/meeting${userAuth.user_auth.name}" rel="noopener noreferrer" target="_blank"><strong>Click here to join</strong></a></div>`;
    let messageBody = `ZOOM_MESSAGE::${JSON.stringify({
      // eslint-disable-next-line quotes
      message: `<div>I started a ZOOM meeting: <strong>Click here to join</strong></div>`,
      data: {
        passWord: config.password,
        meetingNumber: config.meetingNumber,
        role: 0,
        host: false,
      },
    })}`;
    let payload = {
      channel_id: id,
      body: messageBody,
      mention_ids: [],
      file_ids: [],
      reference_id: require("shortid").generate(),
      reference_title: `${user.name} started a ZOOM meeting`,
      quote: null,
    };

    dispatch(postChatMessage(payload));
  };

  return {
    startMeeting,
    generateSignature,
    createMessage,
  };
};

export default useZoomActions;
