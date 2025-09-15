#!/bin/bash
cd /tmp/kavia/workspace/code-generation/cooking-task-tracker-6311-6320/cooking_todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

