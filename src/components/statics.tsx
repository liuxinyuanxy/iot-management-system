import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import React from 'react';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useColorMode, useToast } from '@chakra-ui/react';
import moment from 'moment';
const isLocalhost = process.env.APP_URL === 'http://localhost:3000';

type data = {
  time: string;
  value: number;
};

function ChartInner(datas: data[], name: string) {
  const { colorMode } = useColorMode();
  return (
    <div className="flex flex-col">
      <div> {name} </div>
      <div className="">
        <Chart
          options={{
            theme: {
              mode: colorMode,
            },
            chart: {
              id: 'basic-bar',
            },
            xaxis: {
              type: 'category',
              categories: datas.map((number) => number.time),
            },
            yaxis: {
              min: 0,
            },
          }}
          series={[
            {
              name: 'Device Number',
              data: datas.map((number) => number.value),
            },
          ]}
          type="line"
          width="100%"
          height="500"
        />
      </div>
    </div>
  );
}

export function AllDeviceChart() {
  const [deviceNumbers, setDeviceNumbers] = useState<data[]>([]);
  const [onlineDeviceNumbers, setOnlineDeviceNumbers] = useState<data[]>([]);
  const [messageNumbers, setMessageNumbers] = useState<data[]>([]);
  const toast = useToast();
  const deviceNumberGet = trpc.iot.staticsDeviceNumber.useQuery();
  const onlineDeviceNumberGet = trpc.iot.staticsDeviceOnline.useQuery();
  const messageNumberGet = trpc.iot.staticsDataBytes.useQuery();
  const resFilter = (
    res: any,
    setNumbers: React.Dispatch<React.SetStateAction<data[]>>,
  ) => {
    if (res.error) {
      toast({
        title: 'Error',
        description: res.error?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setNumbers((numbers) => {
      let tmp = [
        ...numbers,
        { time: moment().format('HH:mm:ss'), value: res.data ?? 0 },
      ];
      // filter to make sure time is unique
      tmp = tmp.filter(
        (number, index, self) =>
          self.findIndex((n) => n.time === number.time) === index,
      );
      // only keep the latest 20 data
      return tmp.slice(-20);
    });
  };
  const intervalSetting = (
    getMethod: typeof deviceNumberGet,
    setMethod: React.Dispatch<React.SetStateAction<data[]>>,
  ) => {
    setInterval(
      () => {
        getMethod
          .refetch()
          .then((res) => {
            resFilter(res, setMethod);
          })
          .catch((err) => {
            console.log(err);
            toast({
              title: 'Error',
              description: err.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          });
      },
      isLocalhost ? 1000 : 10000,
    );
  };
  intervalSetting(deviceNumberGet, setDeviceNumbers);
  intervalSetting(onlineDeviceNumberGet, setOnlineDeviceNumbers);
  intervalSetting(messageNumberGet, setMessageNumbers);
  return (
    <div className="flex flex-col md:flex-row justify-around">
      {ChartInner(deviceNumbers, 'Device Number')}
      {ChartInner(onlineDeviceNumbers, 'Online Device Number')}
      {ChartInner(messageNumbers, 'Message Number')}
    </div>
  );
}
