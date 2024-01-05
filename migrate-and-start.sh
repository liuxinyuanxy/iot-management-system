#!/bin/bash
npx prisma generate
npx prisma db push
node mqtt.js &
node server.js