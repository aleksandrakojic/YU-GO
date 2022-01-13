export enum AuthenticationState {
	UNDEFINED = 'undefined',
	UNAUTHENTICATED = 'unauthenticated',
	AUTHENTICATED = 'authenticated',
	AUTHENTICATING = 'authenticating',
	LOGGING_OUT = 'logging_out',
	ERROR = 'error',
}

export enum ProfileType {
	Organization,
	Member,
}

export interface IData {
	id: number;
	name: string;
}

export interface IContractData {
	thematics: IData[];
	countries: IData[];
}

export enum IMemberStatus {
	Registered = 'registered',
	Pending = 'pending',
	Canceled = 'canceled',
}

export interface IMember {
	id?: string;
	status: IMemberStatus;
	firstname?: string;
	lastname?: string;
	email?: string;
	ethAddress: string;
	orgEthAddress?: string;
	registrationDate?: number;
}

export interface IContest {
	id: string;
	name: string;
	description: string;
	themes: number[];
	countries: number[];
	actionsIds: number[];
	votingEndDate: number;
	applicationEndDate: number;
	availableFunds: number;
	addrGrantOrga: string;
	createdAt?: string;
	imageUrl?: string;
}

export interface IAction {
	id: string;
	name: string;
	description: string;
	hasVoted: string[];
	contestId: string;
	requiredFunds: number;
	addrOrgaCreator: string;
	votes: number;
	createdAt?: string;
	imageUrl?: string;
}
