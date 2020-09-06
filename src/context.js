import React from 'react';
import SQLite from 'react-native-sqlite-storage';

export const Context = React.createContext();

// SQLite.enablePromise(true);

export const db = SQLite.openDatabase(
  {
    name: 'archive.db',
    createFromLocation: '~archive.db',
  },
  () => console.log('open DB'),
  (err) => console.log('sql error: ', err.message),
);

export const Store = ({children}) => {
  const [state, setState] = React.useState({
    localPermision: false,
    localCorditae: {
      coords: {
        latitude: null,
        longitude: null,
      },
    },
    Address: {},
    weather: {},
    Arhive: [],
  });
  return (
    <Context.Provider value={{state, setState}}>{children}</Context.Provider>
  );
};
