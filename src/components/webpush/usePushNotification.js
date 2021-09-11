import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPushNotification, subscribePushNotifications } from "../../redux/actions/globalActions";
import { askUserPermission, createNotificationSubscription, getUserSubscription, isPushNotificationSupported, registerServiceWorker } from "./pushFunctions";
import { setPushNotification } from "../../redux/actions/notificationActions";
//import all the function created to manage the push notifications

const pushNotificationSupported = isPushNotificationSupported();
//first thing to do: check if the push notifications are supported by the browser

export default function usePushNotification() {
  const [userConsent, setSuserConsent] = useState(typeof Notification !== "undefined" ? Notification.permission : false);
  //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
  //We initialize the userConsent with that value
  const [userSubscription, setUserSubscription] = useState(null);
  //to manage the use push notification subscription
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState(null);
  //to manage the push server subscription
  const [error, setError] = useState(null);
  //to manage errors
  const [loading, setLoading] = useState(true);
  //to manage async actions
  const [subscribing, setSubsubscribing] = useState(null);
  const [fetchingSubscription, setFetchingSubscription] = useState(null);
  //reminder time
  const [reminderTime, setReminderTime] = useState(localStorage.getItem("remindNotification"));
  const [didMount, setDidMount] = useState(false);

  const dispatch = useDispatch();

  const hasSubscribed = useSelector((state) => state.notifications.hasSubscribed);
  /**
   * define a click handler that asks the user permission,
   * it uses the setSuserConsent state, to set the consent of the user
   * If the user denies the consent, an error is created with the setError hook
   */
  const onClickAskUserPermission = () => {
    setLoading(true);
    setError(false);
    askUserPermission().then((consent) => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0,
        });
        setUserSubscription(false);
      } else {
        onClickSubscribeToPushNotification();
      }
      setLoading(false);
    });
  };
  /**
   * define a click handler that creates a push notification subscription.
   * Once the subscription is created, it uses the setUserSubscription hook
   */
  const onClickSubscribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    setSubsubscribing(true);
    createNotificationSubscription()
      .then(function (subscription) {
        setUserSubscription(subscription);
        dispatch(
          subscribePushNotifications(subscription, (err, res) => {
            if (err) {
              setSubsubscribing(false);
              setLoading(false);
              setError(err);
              return;
            }
            setSubsubscribing(false);
            setPushServerSubscriptionId(res.data.id);
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Couldn't create the notification subscription", "name:", err.name, "message:", err.message, "code:", err.code);
        setError(err);
        setLoading(false);
      });
  };

  /**
   * define a click handler that sends the push susbcribtion to the push server.
   * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
   */
  const onClickSendSubscriptionToPushServer = () => {
    setLoading(true);
    setError(false);
    dispatch(
      subscribePushNotifications(userSubscription, (err, res) => {
        if (err) {
          setLoading(false);
          setError(err);
          return;
        }
        setPushServerSubscriptionId(res.data.id);
      })
    );
  };

  /**
   * define a click handler that requests the push server to send a notification, passing the id of the saved subscription
   */
  const onClickSendNotification = () => {
    setLoading(true);
    setError(false);
    dispatch(
      getPushNotification({ sub_id: pushServerSubscriptionId }, (err, res) => {
        setLoading(false);
        if (err) setError(err);
      })
    );
  };

  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
    setDidMount(true);
  }, []);
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render

  useEffect(() => {
    setLoading(true);
    setError(false);
    setFetchingSubscription(true);
    const getExistingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      if (existingSubscription) {
        dispatch(
          getPushNotification({ endpoint: `${existingSubscription.endpoint}` }, (err, res) => {
            setFetchingSubscription(false);
            setLoading(false);
            if (err) setError(err);
            if (res.data.data) {
              setUserSubscription(existingSubscription);
              dispatch(setPushNotification(true));
            } else {
              dispatch(setPushNotification(false));
            }
          })
        );
      } else {
        dispatch(setPushNotification(false));
      }
    };
    getExistingSubscription();
  }, []);
  //Retrieve if there is any push notification subscription for the registered service worker
  // this use effect runs only in the first render

  /**
   * define a click handler that creates a push notification subscription.
   * Once the subscription is created, it uses the setUserSubscription hook
   */
  useEffect(() => {
    if (userSubscription === null && subscribing === null && fetchingSubscription === false) {
      onClickSubscribeToPushNotification();
    }
  }, [userSubscription, subscribing, fetchingSubscription, dispatch]);

  useEffect(() => {
    if (pushNotificationSupported && hasSubscribed === null) {
      registerServiceWorker().then(() => {
        if (userConsent === "granted") {
          dispatch(setPushNotification(true));
          onClickSubscribeToPushNotification();
        }
      });
    }
  }, [hasSubscribed, userConsent]);

  const onClickRemindLater = () => {
    // ask again tomorrow 86400 seconds = 1 day
    let time = Math.floor(Date.now() / 1000) + 86400;
    localStorage.setItem("remindNotification", time);
    setReminderTime(time);
  };
  /**
   * returns all the stuff needed by a Component
   */
  return {
    onClickRemindLater,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading,
    showNotificationBar: userConsent === "default" && userSubscription === null && (reminderTime === null || reminderTime < Math.floor(Date.now() / 1000)),
    mounted: didMount,
  };
}
