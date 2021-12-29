import React, { FC, useState, createContext } from 'react';

interface IAppContext {
  thematics: Array<any>;
  countries: Array<any>;
  abi: any;
  contractAddress: string;
}

const initAppContext: IAppContext = {
  thematics: [],
  countries: [],
  abi: {},
  contractAddress: ''
};

export const AppContext = createContext<IAppContext>(initAppContext);
