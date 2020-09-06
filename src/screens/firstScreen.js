import React from 'react';
import {Text, StyleSheet, SafeAreaView, View} from 'react-native';
// import Geocoder from 'react-native-geocoding';
import {
  permisionLocation,
  getLocation,
  getAddr,
  getWeather,
  addArchive,
  getArchive,
} from '../lib';
import {Context, db} from '../context';
import {Line} from '../components/line';

export const FirstScreen = () => {
  const {state, setState} = React.useContext(Context);
  React.useEffect(() => {
    const asyncWrap = async () => permisionLocation(setState);
    asyncWrap();
  }, [setState]);
  React.useEffect(() => {
    const asyncWrap = async () => {
      const x = await getLocation();
      const result = await Promise.all([
        getAddr(x.coords.latitude, x.coords.longitude),
        getWeather(x.coords.latitude, x.coords.longitude),
      ]);
      const localtion = await result[0].json();
      const Address = localtion.Response.View[0].Result[0].Location.Address;
      delete Address.Label;
      delete Address.AdditionalData;
      const WeatherRaf = await result[1].json();
      const Weather = {};
      Object.keys(WeatherRaf.main).forEach((item) => {
        Weather[item] =
          item.includes('temp') || item === 'feels_like'
            ? Math.round((WeatherRaf.main[item] - 273.15) * 10) / 10
            : WeatherRaf.main[item];
      });
      setState((prev) => ({
        ...prev,
        Address: Address,
        weather: Weather,
        localCorditae: x,
      }));
      await addArchive(
        db,
        x.coords.latitude,
        x.coords.longitude,
        Address,
        Weather,
      );
      const Arhive = await getArchive(db);
      setState((prev) => ({...prev, Arhive: Arhive}));
    };
    if (state.localPermision) {
      asyncWrap();
    }
  }, [setState, state.localPermision]);
  return (
    <SafeAreaView style={styles.screenWrapper}>
      <View style={styles.header}>
        <Text style={styles.text}>first Screen</Text>
      </View>
      <View style={styles.content}>
        {state.localCorditae.coords.latitude ? (
          <Line name={'latitude'} value={state.localCorditae.coords.latitude} />
        ) : null}
        {state.localCorditae.coords.longitude ? (
          <Line
            name={'longitude'}
            value={state.localCorditae.coords.longitude}
          />
        ) : null}
        {Object.keys(state.Address).map((item) => {
          return state.Address[item] ? (
            <Line key={item} name={item} value={state.Address[item]} />
          ) : null;
        })}
        {Object.keys(state.weather).map((item) => {
          return state.weather[item] ? (
            <Line key={item} name={item} value={state.weather[item]} />
          ) : null;
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
