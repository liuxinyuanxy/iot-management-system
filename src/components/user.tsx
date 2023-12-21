import React from 'react';
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { Button, useToast } from '@chakra-ui/react';

function UserLogout() {
  return (
    <Button
      onClick={async () => {
        // fetch /api/logout
        await fetch('/api/signout');
        // refresh the page
        window.location.reload();
      }}
    >
      Logout
    </Button>
  );
}

export function UserLogin() {
  const [url, setUrl] = useState<string>('');
  const toast = useToast();
  const urlGet = trpc.iot.loginURL.useQuery();
  useEffect(() => {
    if (!urlGet.isLoading) {
      if (urlGet.error) {
        toast({
          title: 'Error',
          description: 'Failed to get login url, please refresh the page',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setUrl(urlGet.data);
    }
  }, [toast, urlGet.data, urlGet.error, urlGet.isLoading]);

  return (
    <>
      <a href={url}>
        <Button>Login</Button>
      </a>
    </>
  );
}

export function UserLoginModal({ isLogin }: { isLogin: boolean }) {
  return <>{isLogin ? <UserLogout /> : <UserLogin />}</>;
}
