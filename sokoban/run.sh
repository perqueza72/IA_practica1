#!/bin/bash
./"main"
while IFS= read -r LINE || [[ -n "$LINE" ]]; do
    echo "${LINE}"
done
