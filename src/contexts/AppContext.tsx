import React, { createContext } from 'react';

interface IAppContext {
	thematics: Array<any>;
	countries: Array<any>;
	abi: any;
	contractAddress: string;
	currentUser?: any;
	// organisations: Array<any>;
}

const initAppContext: IAppContext = {

	thematics: [],
	countries: [],
	abi: {},
	contractAddress: '',
	currentUser: {},
	// organisations: [],

};

export const AppContext = createContext<IAppContext>(initAppContext);
