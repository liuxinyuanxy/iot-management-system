#!/bin/bash
# until mysql on mysql:3306 is alive
sleep 20
npx prisma generate
npx prisma db push
node mqtt.js &
node server.js