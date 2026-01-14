#!/bin/bash
cd /home/kavia/workspace/code-generation/roadrescue-assistance-platform-42327/user_website
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

