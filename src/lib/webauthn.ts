import { APP_NAME, APP_URL } from "./constants";

const url = new URL(APP_URL);

export const rpName = APP_NAME;
export const rpID = url.hostname;
export const origin = url.origin;
