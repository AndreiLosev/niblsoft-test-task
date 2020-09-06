import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export const Line = ({name, value}) => {
  return (
    <View style={styles.componentWrap}>
      <View style={styles.textWrap}>
        <Text style={styles.text}>{`${name}:`}</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.text}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  textWrap: {
    padding: 5,
  },
});
