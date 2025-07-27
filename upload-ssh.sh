#!/bin/bash
# production
IP_1=""
IP_2=""

# development
IP_3=""

BASE_DIR="deployments"
REPO="authentications"

scp .env.production ubuntu@$IP_1:~/$BASE_DIR/$REPO/.env
scp .env.production ubuntu@$IP_2:~/$BASE_DIR/$REPO/.env
scp .env.staging ubuntu@$IP_3:~/$BASE_DIR/$REPO/.env