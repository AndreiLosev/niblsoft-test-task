import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {Context} from '../context';
import {db} from '../context';
import {testDB} from '../lib';
import {Line} from '../components/line';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const SecondScreen = () => {
  const {
    state: {Arhive},
  } = React.useContext(Context);
  return (
    <SafeAreaView style={styles.screenWrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => testDB(db)}>
          <Text style={styles.text}>Second Screen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={Arhive}
          renderItem={({item}) => <ListItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const ListItem = ({item}) => {
  const [show, setShow] = React.useState(false);
  LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  return (
    <View style={styles.itemWrap}>
      <Line name={'date'} value={item.date} />
      <Line name={'latitude'} value={item.coords.latitude} />
      <Line name={'longitude'} value={item.coords.longitude} />
      {item.address.City ? (
        <Line name={'City'} value={item.address.City} />
      ) : null}
      <TouchableOpacity onPress={() => setShow(!show)}>
        {show ? (
          <View>
            {Object.keys(item.address).map((elem) => {
              return item !== 'City' ? (
                <Line name={elem} value={item.address[elem]} key={elem} />
              ) : null;
            })}
            {Object.keys(item.weather).map((elem) => (
              <Line name={elem} value={item.weather[elem]} key={elem} />
            ))}
          </View>
        ) : (
          <Text>Show more ...</Text>
        )}
      </TouchableOpacity>
    </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
  },
  itemWrap: {
    borderWidth: 2,
    paddingHorizontal: '18%',
  },
});
