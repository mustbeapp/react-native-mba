import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, StatusBar, Platform } from 'react-native';
import { FacebookLogin, SelectListView } from 'react-native-mba';

export default class App extends React.Component {
  
  fbLogin = null;

  constructor()
  {
     super();
  }

  handleFacebookLogin()
  {
     const { fbLogin } = this.refs;
     fbLogin.loginWithFacebook(function(data) {
        setTimeout(function() {
          alert(JSON.stringify(data));
        }, 500);
     });
  }

  handleSelectListView()
  {
    const { selectList } = this.refs;
    selectList.openSelectionBox();
  }

  onItemPicked(item)
  {
      alert('Item picked:' + JSON.stringify(item));
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <ScrollView style={styles.buttonList} contentContainerStyle={styles.buttonListContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handleFacebookLogin.bind(this)}>
              <Text>FacebookLogin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.handleSelectListView.bind(this)}>
              <Text>SelectListView</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
              <Text style={styles.headerText}>React Native MBA</Text>
          </View>
          <Image style={styles.headerShadow} source={require('./assets/shadow.png')}/>
        </View>
        <FacebookLogin ref="fbLogin" clientId="830435910451170" redirectUri="http://fb.mustbeapp.com/" />
        <SelectListView ref="selectList"
                  onItemSelected={this.onItemPicked}
                  selectionBoxStyle={styles.selectionBox}
                  data={[
                    { name: 'Item 0: React' },
                    { name: 'Item 1: Native' },
                    { name: 'Item 2: is' },
                    { name: 'Item 3: Awesome' },
                    { name: 'Item 4: React-Native-Mba' },
                    { name: 'Item 5: Another one' },
                  ]}
                  placeholder="selecione uma categoria" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  header: {
    width: '100%',
    height: 80,
    position: 'absolute',
    top: 0
  },
  headerContent: {
    width: '100%',
    height: 75,
    padding: 25,
    backgroundColor: '#404f94',
    alignItems: 'center'
  },
  headerShadow: {
    width: '100%',
    height: 5,
    resizeMode: Platform.OS == 'ios' ? 'repeat' : 'stretch'
  },
  headerText: {
    fontSize: 21,
    color: '#fff'
  },
  buttonList: {
    width: '100%',
    marginTop: 78
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 4,
    height: 50,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#dcdcdc',
    borderWidth: 1
  },
  buttonListContainer: {
    padding: 15
  }
});
