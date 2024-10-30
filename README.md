# Open Data UI

[![CI Status](https://github.com/Som-Energia/somenergia-tomatic/actions/workflows/main.yml/badge.svg)](https://github.com/Som-Energia/opendata-ui/actions/workflows/main.yml)
[![Coverage Status](https://coveralls.io/repos/github/Som-Energia/opendata-ui/badge.svg?branch=main)](https://coveralls.io/github/Som-Energia/opendata-ui?branch=main)


Web UI to Som Energia Open Data API.

<https://opendata.somenergia.coop>

The API retrieves public information about the cooperative:
Number of members, contracts, production, energy usage...
This UI enables non programmers to make use of it
besides letting programmers understand how to use it.

```bash
npm install  # install dependencies
npm run start  # start development server
npm run test  # pass unit tests
npm run build  # production build
```

### Deployment

If you are Som Energia staff you can clone
`deployment-configurations` repository side by side,
so that the links `scripts/deploy-*.conf` are not broken,
and then:

```bash
scripts/deploy.sh production
```

If you are not SomEnergia staff you can create a deployment configuration
```bash
cat scripts/deploy-myserver.conf <<EOF
DEPLOYMENT_BUILD=whatever  # will use .env.whatever as configuration
DEPLOYMENT_HOST=myserver.com # ssh server
DEPLOYMENT_PORT=22 # ssh port
DEPLOYMENT_USER=myuser # ssh user
DEPLOYMENT_PATH=/my/installation/path
DEPLOYMENT_URL=https://myserver.com/path/to/the/page
EOF

scripts/deploy.sh myserver
```



