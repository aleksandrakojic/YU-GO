export enum AuthenticationState {
  UNDEFINED = 'undefined',
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
  AUTHENTICATING = 'authenticating',
  LOGGING_OUT = 'logging_out',
  ERROR = 'error'
}

export enum ProfileType {
  Organization,
  Member
}

export interface IData {
  id: number;
  name: string;
}

export interface IContractData {
  thematics: IData[];
  countries: IData[];
}

export type IMemberStatus = 'registered' | 'pending' | 'canceled';

export interface IMember {
  id: string;
  status: IMemberStatus;
  firstname: string;
  lastname: string;
  email: string;
  ethAddress: string;
  orgEthAddress: string;
  registrationDate: number;
}
