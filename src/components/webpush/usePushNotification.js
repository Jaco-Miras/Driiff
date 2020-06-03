import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {getPushNotification, subscribePushNotifications} from "../../redux/actions/globalActions";
import {
    askUserPermission,
    createNotificationSubscription,
    getUserSubscription,
    isPushNotificationSupported,
    registerServiceWorker,
} from "./pushFunctions";
//import all the function created to manage the push notifications

const pushNotificationSupported = isPushNotificationSupported();
//first thing to do: check if the push notifications are supported by the browser

export default function usePushNotifications() {
    const [userConsent, setSuserConsent] = useState(Notification.permission);
    //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
    //We initialize the userConsent with that value
    const [userSubscription, setUserSubscription] = useState(null);
    //to manage the use push notification subscription
    const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
    //to manage the push server subscription
    const [error, setError] = useState(null);
    //to manage errors
    const [loading, setLoading] = useState(true);
    //to manage async actions
    const [subscribing, setSubsubscribing] = useState(null);
    const [fetchingSubscription, setFetchingSubscription] = useState(null);

    const dispatch = useDispatch();

    /**
     * define a click handler that asks the user permission,
     * it uses the setSuserConsent state, to set the consent of the user
     * If the user denies the consent, an error is created with the setError hook
     */
    const onClickAskUserPermission = () => {
        setLoading(true);
        setError(false);
        askUserPermission().then(consent => {
            setSuserConsent(consent);
            if (consent !== "granted") {
                setError({
                    name: "Consent denied",
                    message: "You denied the consent to receive notifications",
                    code: 0,
                });
            }
            setLoading(false);
        });
    };
    //
    console.log(userConsent)
    /**
     * define a click handler that creates a push notification subscription.
     * Once the subscription is created, it uses the setUserSubscription hook
     */
    const onClickSusbribeToPushNotification = () => {
        setLoading(true);
        setError(false);
        setSubsubscribing(true);
        createNotificationSubscription()
            .then(function (subscription) {
                console.log(subscription);
                setUserSubscription(subscription);
                dispatch(subscribePushNotifications(subscription, (err, res) => {
                    if (err) {
                        setSubsubscribing(false);
                        setLoading(false);
                        setError(err);
                        return;
                    }
                    setSubsubscribing(false);

                    console.log(res, "subscribe response");
                    setPushServerSubscriptionId(res.data.id);
                }));
                setLoading(false);
            })
            .catch(err => {
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
        dispatch(subscribePushNotifications(userSubscription, (err, res) => {
            if (err) {
                setLoading(false);
                setError(err);
                return;
            }
            console.log(res, "subscribe response");
            setPushServerSubscriptionId(res.data.id);
        }));
    };

    /**
     * define a click handler that requests the push server to send a notification, passing the id of the saved subscription
     */
    const onClickSendNotification = () => {
        setLoading(true);
        setError(false);
        dispatch(getPushNotification({sub_id: pushServerSubscriptionId}, (err, res) => {
            console.log(res, "get notification");
            setLoading(false);
            if (err) setError(err);
        }));
    };

    useEffect(() => {
        if (pushNotificationSupported) {
            console.log("register worker");
            setLoading(true);
            setError(false);
            registerServiceWorker().then(() => {
                if (userConsent === 'default') {
                  askUserPermission().then(consent => {
                    setSuserConsent(consent);
                    if (consent !== "granted") {
                      setError({
                        name: "Consent denied",
                        message: "You denied the consent to receive notifications",
                        code: 0
                      });
                    }
                    setLoading(false);
                  });
                }
                //setLoading(false);
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //if the push notifications are supported, registers the service worker
    //this effect runs only the first render

    useEffect(() => {
        setLoading(true);
        setError(false);
        setFetchingSubscription(true);
        const getExixtingSubscription = async () => {
            const existingSubscription = await getUserSubscription();
            console.log(existingSubscription, "existing subscription");
            setUserSubscription(existingSubscription);
            setFetchingSubscription(false);
            setLoading(false);
        };
        getExixtingSubscription();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //Retrieve if there is any push notification subscription for the registered service worker
    // this use effect runs only in the first render

    useEffect(() => {
        //console.log(subscribing, fetchingSubscription);

        /**
         * define a click handler that creates a push notification subscription.
         * Once the subscription is created, it uses the setUserSubscription hook
         */
        const onClickSusbribeToPushNotification = () => {
            setLoading(true);
            setError(false);
            setSubsubscribing(true);
            createNotificationSubscription()
                .then(function (subscription) {
                    console.log(subscription);
                    setUserSubscription(subscription);
                    dispatch(subscribePushNotifications(subscription, (err, res) => {
                        if (err) {
                            setSubsubscribing(false);
                            setLoading(false);
                            setError(err);
                            return;
                        }
                        setSubsubscribing(false);
                        console.log(res, "subscribe response");
                        setPushServerSubscriptionId(res.data.id);
                    }));
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Couldn't create the notification subscription", "name:", err.name, "message:", err.message, "code:", err.code);
                    setError(err);
                    setLoading(false);
                });
        };

        if (userSubscription === null && subscribing === null && fetchingSubscription === false) {
            onClickSusbribeToPushNotification();
        }
    }, [userSubscription, subscribing, fetchingSubscription, dispatch]);

    /**
     * returns all the stuff needed by a Component
     */
    return {
        onClickAskUserPermission,
        onClickSusbribeToPushNotification,
        onClickSendSubscriptionToPushServer,
        pushServerSubscriptionId,
        onClickSendNotification,
        userConsent,
        pushNotificationSupported,
        userSubscription,
        error,
        loading,
    };
}