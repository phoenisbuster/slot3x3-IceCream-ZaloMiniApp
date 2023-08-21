#!/bin/sh
set -e
if [ "${CI_COMMIT_BEFORE_SHA}" = "0000000000000000000000000000000000000000" ];
  then
    COMMIT_RANGE="${CI_MERGE_REQUEST_DIFF_BASE_SHA}..."
  else
    COMMIT_RANGE="${CI_COMMIT_BEFORE_SHA}..${CI_COMMIT_SHA}"
fi
>&2 echo "Commit range: $COMMIT_RANGE"
git diff --name-only $COMMIT_RANGE -- $@ > $CI_PROJECT_DIR/CHANGES
cat $CI_PROJECT_DIR/CHANGES