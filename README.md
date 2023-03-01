# Serverless Auction Frontend


Below are the Steps for Deploying Web app:

1. Make .env file
    ```
    AUTH0_APP_REFRESH_RATE=5000
    AUTH0_APP_AUCTIONS_ENDPOINT=https://your-backend-service-link/dev
    AUTH0_APP_DOMAIN=<your auth0 app domain Name>
    AUTH0_APP_CLIENT_ID=<auth0-client-id>
    AUTH0_APP_CLIENT_SECRET=<auth0-client-secret>
    AUTH0_APP_CALLBACK_URL=<callback-url-as-specifed-in-auth0-app>
    AUTH0_APP_LOGOUT_CALLBACK_URL=<logout-url-as-specifed-in-auth0-app>
    AUTH0_APP_SESSION_SECRET=<create-a-secret-string-for-this-app>
    ```
    You need to create App on Auth0 Service to fill the .env file
2. npm install
3. npm start
4. access web app at port 3000