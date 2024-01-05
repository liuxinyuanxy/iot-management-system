const mqttServer =  process.env.MQTT_SERVER || 'tcp://broker.hivemq.com:1883';
const mqtt = require("mqtt");
const client = mqtt.connect(mqttServer);
const PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()
console.log('try connect to ' + mqttServer)
client.on('connect', () => {
  client.subscribe('iotHydra', (err) => {
    if (err) {
      console.error(err);
    }
  });
});

console.log('MQTT client connected');

client.on('message', (topic, message) => {
  console.log('Received from topic: ' + topic + ' - ' + message.toString());
  const data = JSON.parse(message.toString());
  let { alert, clientId, info, lat, lng, timestamp, value } = data;
  alert = alert === 1;
  clientId = parseInt(clientId.slice(-4));
  let report = new Date(timestamp);
  prisma.clients.update({
    where: { id: clientId },
    data: {
      messages: {
        create: {
          alert,
          info,
          lat,
          lng,
          report,
          value,
        }
      }
    }
  }).then((result) => {
    console.log('Message saved to DB');
  }).catch((err) => {
    console.log(err);
  });
});