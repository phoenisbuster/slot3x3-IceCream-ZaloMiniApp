#!/usr/bin/env bash

MAX_DEPTH=3
depth=0
find_config_file(){
    depth=$((depth+1))
    dir=$1
    >&2 echo "Try find ci.json in $dir, depth=${depth}"
    if [[ "${dir}" = "/" || "${dir}" = "." || $depth > $MAX_DEPTH ]]; then
        >&2 echo "Cannot find ci.json file"
        exit 1
    fi
    sleep 1
    if [[ -f "${dir}/ci.json" ]]; then
        echo "${dir}/ci.json"
    else
        find_config_file $(dirname "${dir}")
    fi
}

find_config_file $1