# Subgraph for BNFT Protocol

## Development

```bash
# copy env and adjust its content
# you can get an access token from https://thegraph.com/explorer/dashboard
cp .env.test .env

# install project dependencies
npm i

# fetch current contracts as submodule
npm run prepare:all

# run codegen
npm run subgraph:codegen

# now you're able to deploy to thegraph via
npm run deploy:hosted:mainnet

```

## Deployment

To be able to deploy the subgraph in any environment for any network first we will need to prepare the local env.

### Self-hosted

- The first time you will deploy the subgraph you need to first create it in the TheGraph node:

```
// For Rinkeby:
npm run subgraph:create:self-hosted:rinkeby

// for Mainnet
npm run subgraph:create:self-hosted:mainnet
```

- Before any deployment you need to generate the types and schemas:

```
npm run subgraph:codegen
```

- When / If the subgraph is created you can then deploy

```
// For Rinkeby:
  npm run deploy:self-hosted:rinkeby

// For Mainnet:
  npm run deploy:self-hosted:mainnet
```

### Hosted

To be able to deploy to the hosted solution you will need to create a .env file and add `ACCESS_TOKEN` environment variable. You can find this in the dashboard of the TheGraph

```shell
# For Rinkeby:
npm run deploy:hosted:rinkeby

# For Mainnet:
npm run deploy:hosted:mainnet
```

### Local

Remember that before runing `docker-compose up` you need to run `docker-compose down` if it is not the first time.
That is because the postgres database and ipfs data needs to not be persistant, so we need to delete the docker volumes.

```shell
docker-compose down

docker container prune -f

docker volume prune -f

# or using ls and rm
# docker volume ls
# docker volume rm bend-protocol-subgraph_xxx

1. Start docker environment for TheGraph infrastructure:

```shell
# development using localhost hardhat node
docker-compose up

# or development using rinkeby
export GRAPH_ETHEREUM="rinkeby:https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}"
docker-compose up

# or development using mainnet
export GRAPH_ETHEREUM="mainnet:https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}"
docker-compose up

```

Remember that before runing `docker-compose up` you need to run `docker-compose down` if it is not the first time. That is because the postgres database needs to not be persistant, so we need to delete the docker volumes.

2. Deploy local subgraph:

```shell
# create subgraph
npm run subgraph:create:local

# development using dev config
npm run deploy-stack:local

# or development using rinkeby config
npm run deploy-stack:local:rinkeby

# or development using mainnet config
npm run deploy-stack:local:mainnet

```

3. To check or query the subgraph use:

```
Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/bend/bnft-protocol
Subscriptions (WS): http://localhost:8001/subgraphs/name/bend/bnft-protocol

INFO Starting JSON-RPC admin server at: http://localhost:8020, component: JsonRpcServer
INFO Starting GraphQL HTTP server at: http://localhost:8000, component: GraphQLServer
INFO Starting index node server at: http://localhost:8030, component: IndexNodeServer
INFO Starting GraphQL WebSocket server at: ws://localhost:8001, component: SubscriptionServer
INFO Starting metrics server at: http://localhost:8040, component: MetricsServer

```
