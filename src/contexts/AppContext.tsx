import React, { createContext } from 'react';
import { ProfileType } from 'src/models';

interface IAppContext {
	thematics: Array<any>;
	countries: Array<any>;
	abi: any;
	contractAddress: string;
	currentUser?: any;
	type?: ProfileType;
	setType: Function;
	// organisations: Array<any>;
}

const initAppContext: IAppContext = {
	thematics: [],
	countries: [],
	abi: {},
	contractAddress: '',
	currentUser: {},
	type: ProfileType.None,
	setType: (type: ProfileType) => type,
	// organisations: [],
};

export const AppContext = createContext<IAppContext>(initAppContext);
