const apis = {
    //authRouter
    SIGN_UP: "/signup",
    LOGIN: "/login",
    LOGOUT: "/logout",

    // profileRouter
    PROFILE_VIEW: "/profile/view",
    PROFILE_EDIT: "/profile/edit",
    PROFILE_PASSWORD_EDIT: "/profile/password/edit",

    // usersRouter
    SEND_CONNECTION_REQUEST: "/request/send/:status/:toUserId",
    REVIEW_CONNECTION_REQUEST: "/request/review/:status/:requestId",
};

module.exports = apis;
