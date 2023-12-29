import React from 'react';
import { useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { Button, useToast } from '@chakra-ui/react';

export function MqttButton() {
  const toast = useToast();
  const mqttStartQuery = trpc.iot.mqttStart.useQuery();
  useEffect(() => {
    if (!mqttStartQuery.isLoading) {
      toast({
        title: 'Info',
        description: 'mqtt has refreshed',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast, mqttStartQuery.error, mqttStartQuery.isLoading]);
  const onclick = async () => {
    await mqttStartQuery.refetch();
  };
  return (
    <>
      <Button onClick={onclick}>Refresh MQTT server</Button>
    </>
  );
}