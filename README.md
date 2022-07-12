Prerequisite
- Metamask
- Node v14.18.3
- postgres

To Run the Project you first need to create a two .env file
* FE/
* BE/

FE .env
```bash
NEXT_PUBLIC_INFURA_ID=<NEXT_PUBLIC_INFURA_ID>
NEXT_PUBLIC_STAKING_TOKEN_ADDRESS=<NEXT_PUBLIC_STAKING_TOKEN_ADDRESS>
NEXT_PUBLIC_BACKEND_ENDPOINT=<NEXT_PUBLIC_BACKEND_ENDPOINT>
```
BE .env
```bash
DB_HOST=<DB_HOST>
DB_PORT=<DB_PORT>
DB_USERNAME=<DB_USERNAME>
DB_PASSWORD=<DB_PASSWORD>
DB_DATABASE_NAME=<DB_DATABASE_NAME>
```

Here is the script to run BE of project
```bash
npm run start:dev
```

Here is the script to run FE of project
```bash
npm run dev
```
