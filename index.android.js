/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  AlertIOS
} from 'react-native';

import Firebase from'firebase';
import StatusBar from'./components/StatusBar';
import ActionButton from'./components/ActionButton';
import ListItem from'./components/ListItem';
import styles from './styles.js';


class GroceryApp extends React.Component {

  constructor(props) {
    super(props);
    this.itemsRef = new Firebase("<https://kc-grocery-list.firebaseio.com/items")
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  _renderItem(item) {
    const onPress = () => {
      AlertIOS.prompt(
        'Complete',
        'Cross off '+item.title+'?',
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancel')},
          {text: '???', onPress: (text) => console.log('mystery Button')}
        ],
        'default'
      );
    }
    return (
      <ListItem item={item} onPress={onPress}/>
    );
  }

  _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text})
          }
        },
      ],
      'plain-text'
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="Grocery List" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          style={styles.linview}/>

        <ActionButton title="Add" onPress={this._addItem.bind(this)} />
      </View>
    );
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key()
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
    });
  }
}


AppRegistry.registerComponent('GroceryApp', () => GroceryApp);
