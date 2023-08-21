#!/usr/bin/env bash
#parsed env: SERVICE, VERSION

CI_JOB_STATUS=started SERVICE=$SERVICE  $SCRIPT_DIR/push-notify.sh $CI_PROJECT_DIR/cocos

STATUS=failed
$SCRIPT_DIR/build-cocos.sh
if [ $? -eq 0 ]; then
    STATUS=success
fi

CI_JOB_STATUS=$STATUS SERVICE=$SERVICE  $SCRIPT_DIR/push-notify.sh $CI_PROJECT_DIR/cocos $CI_PROJECT_DIR/CHANGE_LOG

if [ "$STATUS" = "failed" ]; then
    # Make job fail
    exit 1
fi