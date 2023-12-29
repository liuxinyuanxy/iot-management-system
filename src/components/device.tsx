import React, { useEffect, useState } from 'react';
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
  Radio,
  RadioGroup,
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
  setIsUpdated,
}: {
  deviceID: number;
  isCreate: boolean;
  setIsUpdated?: () => void;
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
  }, [
    deviceID,
    deviceInfoQuery.data,
    deviceInfoQuery.error,
    deviceInfoQuery.isLoading,
    isCreate,
    toast,
  ]);

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
    setIsUpdated?.();
    if (isCreate) {
      setName('');
      setType(0);
    }
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
                  <option value="1" key="1">
                    {deviceType[1]}
                  </option>
                  <option value="2" key="2">
                    {deviceType[2]}
                  </option>
                  <option value="3" key="3">
                    {deviceType[3]}
                  </option>
                  <option value="4" key="4">
                    {deviceType[4]}
                  </option>
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

export function DeviceList({ isLogin }: { isLogin: boolean }) {
  const [managed, setManaged] = useState<boolean>(false);
  const toast = useToast();
  const managedListQuery = trpc.iot.managedDevice.useQuery();
  const allListQuery = trpc.iot.allDevice.useQuery();
  const [deviceList, setDeviceList] = useState<
    AppRouterOutput['iot']['managedDevice']
  >([]);
  const deviceListQuery = managed ? managedListQuery : allListQuery;
  const setIsUpdated = async () => {
    await deviceListQuery.refetch();
  };
  const setValue = async (value: string) => {
    setManaged(value === '2');
    await deviceListQuery.refetch();
  };
  useEffect(() => {
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
  }, [
    managed,
    isLogin,
    deviceListQuery.isLoading,
    toast,
    deviceListQuery.data,
    deviceListQuery.error,
  ]);
  if (deviceListQuery.isLoading) {
    return <CircularProgress isIndeterminate />;
  }
  return (
    <>
      {isLogin && (
        <DeviceEditModal
          isCreate={true}
          deviceID={1}
          setIsUpdated={setIsUpdated}
        />
      )}
      <RadioGroup onChange={setValue} defaultValue={managed ? '2' : '1'}>
        <Stack direction="row">
          <Radio value="1">All Device</Radio>
          {isLogin && <Radio value="2">Managed Device</Radio>}
        </Stack>
      </RadioGroup>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>DeviceID</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {deviceList.map((device) => (
              <Tr key={device.id}>
                <Td>{device.name}</Td>
                <Td>{deviceType[device.type ?? 0]}</Td>
                <Td>{device.id}</Td>
                <Td>
                  {managed ? (
                    <DeviceEditModal
                      deviceID={device.id}
                      isCreate={false}
                      setIsUpdated={setIsUpdated}
                    />
                  ) : (
                    <></>
                  )}
                  <a href={`/path/${device.id}`}>
                    <Button>View Path</Button>
                  </a>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
