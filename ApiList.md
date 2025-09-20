# DevTinder API's

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profile of other users on the platform

Status: ignored, inetrested, accepted, rejected