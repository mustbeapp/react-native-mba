//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, findNodeHandle, Modal, TouchableOpacity, FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable-promise';

AnimatableTouch = Animatable.createAnimatableComponent(TouchableOpacity);

var _this;
// create a component
class SelectListView extends Component {

    state = {
        text: null,
        modalVisible: false
    }

    renderItens = [];
    lastClicked = null;
    selectedItem = null;
    tempSelectedItem = null;

    constructor()
    {
        super();
        _this = this;
    }

    _keyExtractor = (item, index) => item.id;

    componentDidMount()
    {
        if(this.props.data)
        {
            for (var i = 0; i < this.props.data.length; i++) {
                if(!this.props.data[i]._index)
                {
                    this.props.data[i]._index = i;
                }
            }
        }

        if(this.props.placeholder)
        {
            this.setState({ text: this.props.placeholder });
        }
    }

    openSelectionBox()
    {
        this.setState({ modalVisible: true }, function(){
            _this.picker.fadeInUp(300).then(function() {
                if(_this.selectedItem)
                {
                    _this.tempSelectedItem = _this.selectedItem;
                    _this.lastClicked = _this.renderItens[_this.selectedItem.index];
                    if(_this.lastClicked)
                    {
                        _this.lastClicked.transitionTo({ backgroundColor: '#eee' }, 50); 
                    }
                }
                else if(_this.renderItens.length > 0)
                {
                    _this.selectedItem = _this.props.data[0];
                    _this.lastClicked = _this.renderItens[0];
                    _this.lastClicked.transitionTo({ backgroundColor: '#eee' }, 50); 
                }
            });
        });        
    }

    selectItem(index)
    {
        _this.selectedItem = {
             "item": { "name": _this.props.data[index].name, "id": _this.props.data[index].id }, "index": index 
        };
    }

    _onPressItem()
    {
        var _refItem = this.item;
        _this.tempSelectedItem = _refItem;
        if(_this.lastClicked)
        {
            _this.lastClicked.transitionTo({ backgroundColor: '#fff' }, 50);
        }
        _this.renderItens[_refItem.index].transitionTo({ backgroundColor: '#eee' }, 300).then(function() {
            _this.lastClicked = _this.renderItens[_refItem.index];
        });
    }

    handleCancel()
    {
        _this.hidePicker();
    }

    handleConfirm()
    {
        _this.selectedItem = _this.tempSelectedItem;
        _this.tempSelectedItem = null;
        
        _this.hidePicker(function() {
            if(_this.props.onItemSelected)
            {
                _this.props.onItemSelected(_this.selectedItem);
            }
        });
    }

    hidePicker(callback)
    {
        _this.renderItens = [];
        _this.picker.fadeOutDown(300).then(function(){
            _this.setState({ modalVisible: false }, function(){
                if(callback)
                {
                    setTimeout(function() {
                        callback();
                    }, 100);
                    
                }
            });
        })        
    }

    _renderItem(obj)
    {
        return (
            <AnimatableTouch ref={(e) => _this.renderItens[obj.index] = e} item={obj} onPress={_this._onPressItem} style={[styles.listItem, _this.props.itemStyle]}>
                <Text style={[styles.itemTextStyle, _this.props.itemTextStyle]}>{obj.item.name}</Text>
            </AnimatableTouch>
        )
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                supportedOrientations={['portrait', 'landscape']}
                visible={this.state.modalVisible}>
                <View style={styles.modalBackground} />
                <Animatable.View ref={(e) => this.picker = e} style={styles.bottomPicker}>
                    <View style={[styles.buttonsContainer, this.props.buttonsContainerStyle]}>
                        <TouchableOpacity onPress={this.handleCancel.bind(this)} style={[styles.button, this.props.buttonStyle]}>
                            <Text style={[styles.buttonText, this.props.buttonTextStyle]}>{this.props.cancelText ? this.props.cancelText : 'CANCEL'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleConfirm.bind(this)} style={[styles.button, this.props.buttonStyle]}>
                            <Text style={[styles.buttonText, this.props.buttonTextStyle]}>{this.props.confirmText ? this.props.cancelText : 'OK'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.listContainer, this.props.listStyle]}>
                        <FlatList
                                data={this.props.data}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                style={styles.flatlist}
                                />
                    </View>
                </Animatable.View>
            </Modal>
        );
    }
}

// define your styles
const styles = StyleSheet.create({    
    modalBackground: {
        backgroundColor: '#000',
        opacity: 0.5,
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    bottomPicker: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignSelf: 'center',
        height: '40%'
    },
    buttonsContainer: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#c0b6a7',
        borderBottomWidth: 2
    },
    button: {
        width: '50%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#404f94'
    },
    buttonText: {
        color: '#fff'
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    flatlist: {
        width: '100%'
    },
    itemTextStyle: {
        fontSize: 14
    },
    listItem: {
        width: '100%',
        height: 35,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});

//make this component available to the app
export default SelectListView;
