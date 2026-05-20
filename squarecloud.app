DISPLAY_NAME=COREGG
MAIN=server/index.js
VERSION=recommended

RUN=npm install && npm run build

MEMORY=512
PERSISTENT=true