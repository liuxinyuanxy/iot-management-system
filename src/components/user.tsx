import React from 'react';
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { Button, useToast } from '@chakra-ui/react';
export function UserLoginModal() {
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
