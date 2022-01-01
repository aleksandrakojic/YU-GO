import React, { FC, useState, createContext } from 'react';

interface IAppContext {
  thematics: Array<any>;
  countries: Array<any>;
  abi: any;
  contractAddress: string;
  // organisations: Array<any>;
}

const initAppContext: IAppContext = {
  thematics: [],
  countries: [],
  abi: {},
  contractAddress: '',
  // organisations: [],
};

export const AppContext = createContext<IAppContext>(initAppContext);
