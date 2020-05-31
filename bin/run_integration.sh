#!/bin/bash
# This script is used to run the acceptance tests against the serverless local stack
echo "Starting Serverless Application"
yarn serve > /dev/null 2>&1 &

# Wait for service to start on port 3000
wait-on tcp:3000 

echo "Sarting Integration Tests"
yarn cucumber

# Capture the PID of the serverless process
read pid <<< $(ps | grep ".bin/sls offline" | grep -v grep | awk '{print $1}')

# Kill the serverless process
echo "Tearing down Serverless Application [" $pid "]"
kill $pid
exit 0
