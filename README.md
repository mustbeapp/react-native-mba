# react-native-mba

React Native Components by MustBeApp

Works on iOS and Android.

## Getting started

`$ npm install react-native-mba --save`

## Expo example

[Example](https://github.com/mustbeapp/react-native-mba/example)

* FacebookLogin

###### How to use

```javascript
import { FacebookLogin }  from 'react-native-mba';

class MyComponent extends Component
{
    handleFacebookLogin()
    {
        const { fbLogin } = this.refs;
        fbLogin.loginWithFacebook(function(data) {
        setTimeout(function() {
            alert(JSON.stringify(data));
        }, 500);
        });
    }

    render()
    {
        <View>
            <TouchableOpacity onPress={this.handleFacebookLogin.bind(this)}>
                <Text>FacebookLogin</Text>
            </TouchableOpacity>
            <FacebookLogin ref="fbLogin" clientId="830435910451170" redirectUri="http://fb.mustbeapp.com/"/>
        </View>
    }
}
```

* SelectListView

###### How to use

```javascript
import { SelectListView }  from 'react-native-mba';

class MyComponent extends Component
{
    handleSelectListView()
    {
        const { selectList } = this.refs;
        selectList.openSelectionBox();
    }

    onItemPicked(item)
    {
        alert('Item picked:' + JSON.stringify(item));
    }

    render()
    {
        <View>
            <TouchableOpacity onPress={this.handleSelectListView.bind(this)}>
                <Text>SelectListView</Text>
            </TouchableOpacity>
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
                  placeholder="select list view" />
        </View>
    }
}
```