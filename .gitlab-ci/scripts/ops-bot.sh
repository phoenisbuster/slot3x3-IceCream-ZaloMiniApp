#!/bin/bash
>&2 docker --version; rc=$?
if [ $rc -ne 0 ]; then
  # Somehow, this is important even though we already have `setup_remote_docker`.
  VER="18.06.1-ce"
  >&2 curl -L -o /tmp/docker-$VER.tgz https://download.docker.com/linux/static/stable/x86_64/docker-$VER.tgz
  >&2 tar -xz -C /tmp -f /tmp/docker-$VER.tgz
  >&2 mv /tmp/docker/* /usr/bin
  >&2 docker --version
  >&2 docker login $CI_REGISTRY -u $BOT_USER -p $BOT_PRIVATE_TOKEN
fi

# Remove newline before pass env file to docker. 
# docker cannot support newline in variable file
# https://github.com/moby/moby/issues/12997
>runner.env
for var in $(compgen -v | grep -Ev '^(BASH)'); do
    var_fixed=$(printf "%s" "${!var}" | tr -s '\n' '\t' )
    echo "$var=${var_fixed}" >>runner.env
done

hostDir=${HOST_BUILDS_DIR:-""}
>&2 echo "Host dir ${hostDir}$CI_PROJECT_DIR"
opsbotVersion=${OPS_BOT_VERSION:-latest}
# Ops-bot repo: https://gitlab.com/inspirelab/greyhole/ops-bot
docker run --rm -v ${hostDir}$CI_PROJECT_DIR:$CI_PROJECT_DIR -e CI_COMMIT_DESCRIPTION="$CI_COMMIT_DESCRIPTION"  -e CI_COMMIT_MESSAGE="$CI_COMMIT_MESSAGE" --env-file=runner.env  registry.gitlab.com/inspirelab/greyhole/ops-bot/cli:${opsbotVersion} ops-bot $@