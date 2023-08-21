#!/usr/bin/env bash
dir=$1
changeLogFile=$2
# use to custom message section, slack block json format 
# https://app.slack.com/block-kit-builder
customMessageFile=$3


configFile=$($SCRIPT_DIR/find-ci-config-file.sh $dir)

$SCRIPT_DIR/ops-bot.sh notify push --config-file="${configFile}" --change-log-file="${changeLogFile}" --custom-message-file="$customMessageFile"
