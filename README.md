ENVIRONMENT SETUP

Use Node version >18 or 20

DB SETUP

1. if using docker composer for db: run "docker compose up -d"

2. if not using docker compose for db: edit app/.env to match mysql db credentials

APP SETUP

1. run "cd app"

2. run "npm install"

3. run "npx sequelize-cli db:migrate"

4. run "npx sequelize-cli db:seed:all"

5. run "npm start"

API

1. /api/auth/login

type: POST

body: JSON

JSON:
    - username
    - password

return:
    - accessToken
    - refreshToken

2. /api/auth/logout

type: POST

headers:
    - authorization: "bearer accessToken"

body: JSON

JSON:
    - refreshToken

3. /api/auth/newAccessToken

type: POST

headers:
    - authorization: "bearer accessToken"

body: JSON

JSON:
    - refreshToken

4. /api/users (create)

type: POST

body: JSON

JSON:
    - username
    - password
    - firstName
    - lastName
    - level
    - department

5. /api/users/:userId (read)

type: GET

body: None

6. /api/users/:userId (update)

type: PUT

auth:
    - params userId and accessToken userId must be the same

headers:
    - authorization: "bearer accessToken" 

body: JSON

JSON:
    - firstName
    - lastName
    - password
    - level (integer)
    - department (name, string)

7. /api/users/:userId (delete)

type: DELETE

auth:
    - params userId and accessToken userId must be the same

headers:
    - authorization: "bearer accessToken"
