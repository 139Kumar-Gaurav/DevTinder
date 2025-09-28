const apis = {
    //authRouter
    SIGN_UP: "/signup",
    LOGIN: "/login",
    LOGOUT: "/logout",

    // profileRouter
    PROFILE_VIEW: "/profile/view",
    PROFILE_EDIT: "/profile/edit",
    PROFILE_PASSWORD_EDIT: "/profile/password/edit",

    // requestRouter
    SEND_CONNECTION_REQUEST: "/request/send/:status/:toUserId",
    REVIEW_CONNECTION_REQUEST: "/request/review/:status/:requestId",

    // userRouter
    USER_REQUESTS_RECEIVED: "/user/requests/received",
    USER_CONNECTIONS: "/user/connections",
    USER_FEED: "/user/feed",
};

module.exports = apis;
