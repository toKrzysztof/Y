const DEV_MODE = import.meta.env.DEV;

export const API_URL =
  DEV_MODE === true
    ? `http://${window.location.hostname}/api`
    : `https://${window.location.hostname}/api`;
export const WEBSOCKET_URL =
  DEV_MODE === true
    ? `ws://${window.location.hostname}/`
    : `wss://${window.location.hostname}/`;

console.log(API_URL, WEBSOCKET_URL);
