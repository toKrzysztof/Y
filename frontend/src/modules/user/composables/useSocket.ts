import { io } from 'socket.io-client';
import { WEBSOCKET_URL } from '@/config/env';

export function useSocket() {
  const socket = io(`${WEBSOCKET_URL}`);

  return {
    socket
  };
}
