#!/bin/sh
tag=$1
echo $tag | sed -re "s/^v[0-9]+.[0-9]+.[0-9]+-([a-zA-Z0-9-]+)-[a-fA-F0-9]+/\1/"
