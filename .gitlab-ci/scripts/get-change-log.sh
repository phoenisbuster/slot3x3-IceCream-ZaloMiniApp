#!/bin/bash
set -e
service=$1
env=$2
currTag=$CI_COMMIT_TAG
previousTag=$3
filterPath="${@:4:100}"
rc=$?
RANGE="$currTag"
if [ -z $previousTag ]; then
    >&2 echo "Previous deloy tag is empty"
    RANGE="$currTag"
else
    >&2 echo "Previous deloy tag $previousTag"
    RANGE="$previousTag..$currTag"
fi
#format hash|message|author name|author email|time
git log $RANGE --pretty=tformat:"%h|%s|%an|%ae|%ad" --date=short --no-merges -- $filterPath