
#!/bin/bash
set -e
services="cocos-web cocos-android cocos-ios"
for service in $services; do
    echo "$SCRIPT_DIR/ops-bot.sh git get-next-version --project-id $CI_PROJECT_ID --service $service --default-version 1.0.0 --token $BOT_PRIVATE_TOKEN"
    nextVersion=$($SCRIPT_DIR/ops-bot.sh git get-next-version --project-id $CI_PROJECT_ID --service $service --default-version 1.0.0 --token $BOT_PRIVATE_TOKEN)
    >&2 echo "Release $service, nextVersion $nextVersion"
    echo "$SCRIPT_DIR/ops-bot.sh git create-release --project-id $CI_PROJECT_ID --service $service --version $nextVersion --commit $CI_COMMIT_SHORT_SHA --token $BOT_PRIVATE_TOKEN"
    $SCRIPT_DIR/ops-bot.sh git create-release --project-id $CI_PROJECT_ID --service $service --version $nextVersion --commit $CI_COMMIT_SHORT_SHA --token $BOT_PRIVATE_TOKEN 
done
