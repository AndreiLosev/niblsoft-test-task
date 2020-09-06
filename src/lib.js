import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const permisionLocation = async (setState) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setState((prev) => ({...prev, localPermision: true}));
    } else {
      setState((prev) => ({...prev, localPermision: false}));
    }
  } catch (err) {
    console.warn(err);
  }
};

export const getLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
  });

export const getAddr = (latitude, longitude) =>
  fetch(`https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${latitude}%2C${longitude}
    %2C250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=xvBOKDog-ZcJcPHqVB5qMVYySJEtLUG3Rae8yIPIGyk`);

export const getWeather = (latitude, longitude) =>
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=77a393b39ad176367472cb56f9a33f15`,
  );

export const addArchive = (db, latitude, longitude, Address, weather) =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const AddressStr = JSON.stringify(Address);
      const weatherStr = JSON.stringify(weather);
      const sqlRequest = `INSERT INTO Archive (Date, latitude, longitude, Address, weather)
      VALUES (${Date.now()}, ${latitude}, ${longitude}, '${AddressStr}', '${weatherStr}');`;
      tx.executeSql(
        sqlRequest,
        [],
        () => resolve('ok'),
        (err) => reject(console.log('sql error', err)),
      );
    });
  });

export const testDB = (db) => {
  db.transaction((tx) => {
    const sqlRequest = 'SELECT * FROM Archive';
    tx.executeSql(sqlRequest, [], (_, result) => {
      const len = result.rows.length;
      for (let i = 0; i < len; i++) {
        console.log(result.rows.item(i));
      }
    });
  });
};

export const getArchive = (db) =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const sqlRequest = 'SELECT * FROM Archive';
      tx.executeSql(
        sqlRequest,
        [],
        (_, result) => {
          const len = result.rows.length;
          const itemFun = result.rows.item;
          const returnData = [];
          for (let i = 0; i < len; i++) {
            const item = itemFun(i);
            returnData.push({
              id: item._id,
              date: converDate(item.Date),
              coords: {
                latitude: item.latitude,
                longitude: item.longitude,
              },
              address: JSON.parse(item.Address),
              weather: JSON.parse(item.weather),
            });
          }
          resolve(returnData);
        },
        (err) => reject(console.log('sql error: ', err)),
      );
    });
  });

export const converDate = (rafDate) => {
  const addNull = (value) => {
    return value < 10 ? `0${value}` : `${value}`;
  };
  const date = new Date(rafDate);
  const day = addNull(date.getDate());
  const month = addNull(date.getMonth() + 1);
  const year = addNull(date.getFullYear());
  const hours = addNull(date.getHours());
  const minuts = addNull(date.getMinutes());
  return `${hours}:${minuts} ${day}.${month}.${year}`;
};
