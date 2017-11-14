//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, WebView, TouchableOpacity, Animated, Image } from 'react-native';

var _this;
const { width } = Dimensions.get('window');
// create a component
class FacebookLogin extends Component {
    _client_id = "";
    _redirect_uri = "";
    tempCallback = null;
    gettingInformation = false;

    state = {
        modalVisible: false,
        canRender: false,
        wvURI: null,
        boxScale: new Animated.Value(0.1),
        closeOpacity: new Animated.Value(0),
    }

    constructor()
    {
        super();
        _this = this;
    }

    componentDidMount()
    {
        this._client_id = this.props.clientId;
        this._redirect_uri = this.props.redirectUri;
    }

    _closeWindow(userClosed)
    {        
        Animated.timing(
            _this.state.boxScale,
            {
                toValue: 0,
                duration: 150
            }
        ).start(function() {
            _this.setState({ modalVisible: false, canRender: false });
            if(userClosed)
            {
                if(_this.tempCallback)
                {
                    _this.gettingInformation = false;
                    _this.tempCallback({ error: true, message: 'User Cancelled' });
                }
            }
        });
    }

    _showWindow()
    {
        _this.setState({ modalVisible: true, canRender: true });

        this.setState({ 
            wvURI: 
                { 
                    uri: 'https://graph.facebook.com/oauth/authorize' +
                    '?response_type=token' +
                    '&client_id='+ this._client_id +
                    '&redirect_uri=' + this._redirect_uri +
                    '&scope=email' 
                }
        });

        Animated.parallel([
            Animated.timing(
                this.state.closeOpacity,
                {
                    toValue: 1,
                    duration: 300
                }
            ),
            Animated.spring(
            this.state.boxScale,
            {
                toValue: 1
            })
        ]).start();
    }

    _onNavigationStateChange(webViewState){

        console.log(webViewState.url);
        if(webViewState.url.indexOf('#access_token') >= 0)
        {
            var query = webViewState.url.replace(_this._redirect_uri, '');
            query = query.replace('?', '');
            query = query.split('&');
            var token = query[0].replace('#access_token=', ''); 

            _this._closeWindow();
            _this._getUserInformation(token);
        }

        if(webViewState.url.indexOf('access_denied') >= 0)
        {
            if(webViewState.url.indexOf('login') >= 0)
            {
                return;
            }
            _this._closeWindow();
            _this.tempCallback({ error: true, message: 'Access Denied' });
        }
    }

    _getUserInformation(token)
    {
        if(!_this.gettingInformation)
        {
            _this.gettingInformation = true;
            fetch('https://graph.facebook.com/v2.8/me?fields=id,name,email,picture&access_token=' + token, {
                method: 'GET',
            })
            .then((response) => response.text())
            .then((responseJson) => {
                if(_this.tempCallback)
                {
                    _this.gettingInformation = false;
                    _this.tempCallback({ token: token, response: responseJson });
                }
            })
            .catch((error) => {
                console.warn(error);
            });
        }
    }

    loginWithFacebook(callback)
    {
        this.tempCallback = callback;
        this._showWindow();
    }    

    silentLogin(token, callback)
    {
        this.tempCallback = callback;
        this._getUserInformation(token);
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                supportedOrientations={['portrait', 'landscape']}
                visible={this.state.modalVisible}>
                {
                    this.state.canRender ?
                    (
                        <View style={styles.container}>
                            <Animated.View style={[styles.webViewContainer, { transform: [ { scale: this.state.boxScale } ]}]}>
                                    <WebView
                                        loading={true}
                                        startInLoadingState={true}
                                        source={this.state.wvURI}
                                        renderError={() => 
                                        {
                                            <View style={{ backgroundColor: '#FFF' }}/>
                                        }}
                                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                        style={styles.webView}
                                    />                        
                            </Animated.View>
                            <Animated.View style={[styles.closeContainer, { opacity: this.state.closeOpacity }]}>
                                <TouchableOpacity onPress={() => this._closeWindow(true)} style={[styles.closeButton, ]}>
                                    <Image style={styles.iconClose} source={require('../assets/icon_close.png')} />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    ) : null
                }
            </Modal>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    webViewContainer: 
    {
        width: '85%',
        height: '85%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        overflow: 'hidden'
    },
    webView: {
        width: '100%',
        height: '100%'
    },
    closeContainer: {
        position: 'absolute',
        top: '6%',
        left: (width * 0.95) - 30,
        width: 32,
        height: 32,
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#000',
        borderColor: '#FFF',
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeButtonIcon: {
        color: '#FFF',
        fontSize: 16
    },
    iconClose: {
        width: 16,
        height: 16,
        resizeMode: 'cover'
    }
});

//make this component available to the app
export default FacebookLogin;
