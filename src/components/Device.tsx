import React from 'react';
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { deviceType } from '../types';
import type { AppRouterOutput } from '../types/client';
import {
  Button,
  Stack,
  ButtonGroup,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  CircularProgress,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

export function DeviceEditModal({
  deviceID,
  isCreate,
}: {
  deviceID: number;
  isCreate: boolean;
}) {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const nameInvalid = name.length === 0;
  const typeInvalid = Object(deviceType)[type] === undefined;
  const deviceInfoQuery = trpc.iot.deviceInfo.useQuery({ id: deviceID });
  const deviceCreateMutation = trpc.iot.addDevice.useMutation();
  const deviceUpdateMutation = trpc.iot.updateDevice.useMutation();

  useEffect(() => {
    if (isCreate) {
      return;
    }
    (async () => {
      if (!deviceInfoQuery.isLoading) {
        if (deviceInfoQuery.error) {
          toast({
            title: 'Error',
            description: deviceInfoQuery.error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        setName(deviceInfoQuery.data?.name ?? '');
        setType(deviceInfoQuery.data?.type ?? 0);
      }
    })();
  }, [deviceID, deviceInfoQuery.isLoading, isCreate, toast]);

  const onSave = async () => {
    if (nameInvalid || typeInvalid) {
      toast({
        title: 'Invalid input',
        description: 'Please check your input',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (isCreate) {
      await deviceCreateMutation.mutateAsync({
        name: name,
        type: type,
      });
    } else {
      await deviceUpdateMutation.mutateAsync({
        id: deviceID,
        name: name,
        type: type,
      });
    }
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>{isCreate ? 'Create' : 'Edit'}</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit device</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <FormControl id="name" isInvalid={nameInvalid}>
                <FormLabel>Device name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl id="type" isInvalid={typeInvalid}>
                <FormLabel>Device type</FormLabel>
                <Select
                  value={type}
                  placeholder="Select device type"
                  onChange={(e) => setType(parseInt(e.target.value))}
                >
                  {Object.keys(deviceType).map((key) => (
                    <option
                      key={key + deviceID}
                      value={Object(deviceType)[key]}
                    >
                      {key}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onSave}>Save</Button>
              <Button onClick={onClose}>Cancel</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeviceList({
  managed,
  isLogin,
}: {
  managed: boolean;
  isLogin: boolean;
}) {
  const toast = useToast();
  const deviceListQuery = managed
    ? trpc.iot.managedDevice.useQuery()
    : trpc.iot.allDevice.useQuery();
  const [deviceList, setDeviceList] = useState<
    AppRouterOutput['iot']['managedDevice']
  >([]);
  useEffect(() => {
    if (!isLogin) {
      return;
    }
    (async () => {
      if (!deviceListQuery.isLoading) {
        if (deviceListQuery.error) {
          toast({
            title: 'Error',
            description: deviceListQuery.error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        setDeviceList(deviceListQuery.data ?? []);
      }
    })();
  }, [managed, isLogin, deviceListQuery.isLoading, toast]);
  if (deviceListQuery.isLoading) {
    return <CircularProgress isIndeterminate />;
  }
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {deviceList.map((device) => (
            <Tr key={device.id}>
              <Td>{device.name}</Td>
              <Td>{deviceType[device.type ?? 0]}</Td>
              <Td>
                <DeviceEditModal deviceID={device.id} isCreate={false} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
