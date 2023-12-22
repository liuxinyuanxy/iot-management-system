import React from 'react';
import { useState, useEffect } from 'react';
import { Map, APILoader, Provider, Marker } from '@uiw/react-baidu-map';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import type { AppRouterInput, AppRouterOutput } from '../types/client';
import { trpc } from '../utils/trpc';
import { CircularProgress, useToast } from '@chakra-ui/react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
function Messages(input: { data: AppRouterOutput['iot']['deviceMessages'] }) {
  const messages = Array.from(input.data);
  const [message, setMessage] =
    useState<AppRouterOutput['iot']['deviceMessages'][0]>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let center_x = 0;
  let center_y = 0;
  let max_x = -Infinity;
  let min_x = Infinity;
  let max_y = -Infinity;
  let min_y = Infinity;
  messages.forEach((message) => {
    center_x += Number(message.lng);
    center_y += Number(message.lat);
    max_x = Math.max(max_x, Number(message.lng));
    min_x = Math.min(min_x, Number(message.lng));
    max_y = Math.max(max_y, Number(message.lat));
    min_y = Math.min(min_y, Number(message.lat));
  });
  if (messages.length > 0) {
    center_x /= messages.length;
    center_y /= messages.length;
  }
  const icon = new BMap.Icon(
    'http://developer.baidu.com/map/jsdemo/img/fox.gif',
    new BMap.Size(200, 200),
  );
  console.log(messages);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>reportTime: {message?.report.toString()}</p>
            <p>lng: {message?.lng.toString()}</p>
            <p>lat: {message?.lat.toString()}</p>
            <p>alert: {message?.alert}</p>
            <p>info: {message?.info}</p>
            <p>value: {message?.value}</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Map
        ref={(props) => {
          if (props && props.map) {
            props.map.enableScrollWheelZoom();
          }
        }}
        widget={['NavigationControl', 'OverviewMapControl', 'ScaleControl']}
        enableMapClick={false}
        center={{
          lng: center_x,
          lat: center_y,
        }}
        zoom={13}
        style={{ height: 350 }}
      >
        {messages.map((message) => {
          return (
            <Marker
              key={String(message.lng) + String(message.lat) + message.report}
              position={{
                lng: Number(message.lng),
                lat: Number(message.lat),
              }}
              icon={icon}
              // type={message.alert ? 'loc_red' : 'loc_blue'}
              onClick={() => {
                setMessage(message);
                onOpen();
              }}
            />
          );
        })}
      </Map>
    </>
  );
}

export function Path(input: AppRouterInput['iot']['deviceMessages']) {
  const [messages, setMessages] = useState<
    AppRouterOutput['iot']['deviceMessages']
  >([]);
  const toast = useToast();
  const messagesQuery = trpc.iot.deviceMessages.useQuery(input);

  useEffect(() => {
    if (!messagesQuery.isLoading) {
      if (messagesQuery.error) {
        toast({
          title: 'Error',
          description: messagesQuery.error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      console.log('get data of messages');
      console.log(messagesQuery.data);
      setMessages(messagesQuery.data ?? []);
    }
  }, [messagesQuery.data, messagesQuery.error, messagesQuery.isLoading, toast]);
  if (messagesQuery.isLoading) {
    return <CircularProgress isIndeterminate />;
  }
  return (
    <>
      <>
        <TableContainer>
          <Table className="table-auto">
            <Thead>
              <Tr>
                <Th>reportTime</Th>
                <Th>lng</Th>
                <Th>lat</Th>
                <Th>alert</Th>
                <Th>info</Th>
                <Th>value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {messages.map((message) => {
                return (
                  <Tr key={message.report.toString()}>
                    <Td>{message.report.toString()}</Td>
                    <Td>{message.lng.toString()}</Td>
                    <Td>{message.lat.toString()}</Td>
                    <Td>{message.alert.toString()}</Td>
                    <Td>{message.info.toString()}</Td>
                    <Td>{message.value.toString()}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </>
      <div style={{ width: '100%', height: '300px', overflow: 'auto' }}>
        <APILoader akay="ik7tF5kocLWMEV5x2IdkWo41MbFVv0Kf">
          <Provider>
            <Messages data={messages} />
          </Provider>
        </APILoader>
      </div>
    </>
  );
}
