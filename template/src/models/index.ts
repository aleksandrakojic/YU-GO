export enum AuthenticationState {
  UNDEFINED = 'undefined',
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
  AUTHENTICATING = 'authenticating',
  LOGGING_OUT = 'logging_out',
  ERROR = 'error'
}

export interface IData {
  id: number;
  name: string;
}

export interface IContractData {
  thematics: IData[];
  countries: IData[];
}
