import { Inter } from 'next/font/google';
import { Path } from '../../components/path';
import React from 'react';
import { useRouter } from 'next/router';

import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Input,
  Text,
} from '@chakra-ui/react';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [value, setValue] = React.useState<number | undefined>(undefined);
  const [alert, setAlert] = React.useState<boolean | undefined>(undefined);
  const [start, setStart] = React.useState<Date | undefined>(undefined);
  const [end, setEnd] = React.useState<Date | undefined>(undefined);
  const device = useRouter().query.device;
  const deviceID = Number(device);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div style={{ width: '80%', overflow: 'auto' }}>
        <Card size={'lg'}>
          <CardHeader>
            <Heading size="md">Client Path Info</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Option (leave the option alone if you do not want to filter it)
                </Heading>

                <Box>
                  <Text>Value</Text>
                  <NumberInput mx="auto">
                    <NumberInputField
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
                <Box>
                  <Text>alert or not</Text>
                  <Select
                    placeholder="Select option"
                    onChange={(e) => setAlert(Boolean(e.target.value))}
                  >
                    <option value="True">Alert</option>
                    <option value="">Not Alert</option>
                  </Select>
                </Box>
                <Box>
                  <Text>Start Time and End Time</Text>
                  <Input
                    placeholder="Start time"
                    onChange={(e) => setStart(new Date(e.target.value))}
                    type="datetime-local"
                  />
                  <Input
                    placeholder="End time"
                    onChange={(e) => setEnd(new Date(e.target.value))}
                    type="datetime-local"
                  />
                </Box>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Map
                </Heading>
                <Path
                  id={deviceID}
                  value={value}
                  alert={alert}
                  start={start}
                  end={end}
                />
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
