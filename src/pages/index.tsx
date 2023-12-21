// import Image from 'next/image';
import { Inter } from 'next/font/google';
import { DeviceList } from '../components/device';
import React, { useEffect } from 'react';
import { UserLoginModal } from '../components/user';
import { Button, Heading, useColorMode } from '@chakra-ui/react';
import { trpc } from '../utils/trpc';

const inter = Inter({ subsets: ['latin'] });

function ColorChange() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </header>
  );
}

export default function Home() {
  const isLoginReq = trpc.iot.pingAuthed.useQuery();
  const [isLogin, setIsLogin] = React.useState(false);
  useEffect(() => {
    if (!isLoginReq.isLoading) {
      if (isLoginReq.error) {
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }
    }
  }, [isLoginReq.error, isLoginReq.isLoading]);
  return (
    <>
      <header className="flex justify-between w-full px-24 py-8">
        <ColorChange />
        <Heading> IoT Device Management System</Heading>
        <UserLoginModal isLogin={isLogin} />
      </header>
      <main
        className={`flex flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <DeviceList isLogin={isLogin} />
      </main>
    </>
  );
}