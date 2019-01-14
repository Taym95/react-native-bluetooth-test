import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
} from "react-native";
import { BleManager, Device, BleError, LogLevel } from "react-native-ble-plx";
import { Root, Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch , Button, Toast} from 'native-base';
import { red } from "ansi-colors";


type Props = {};

type State = {
  text: Array<string>
};

function arrayBufferToHex(buffer) {
  if (!buffer) return null;
  const values = new Uint8Array(buffer);
  var string = "";
  for (var i = 0; i < values.length; i += 1) {
    const num = values[i].toString(16);
    string += num.length == 1 ? "0" + num : num;
  }
  return string;
}

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.manager = new BleManager();
    this.state = {
      text: [],
      devices: [],
    };
  }

  componentDidMount() {
    this.manager.onStateChange(newState => {
      if (newState != "PoweredOn") return;
      this.manager.startDeviceScan(
        null,
        {
          allowDuplicates: true
        },
        (error, device) => {
          if (error) {
            return;
          }
          if(device.name && device.name.includes('Hue L')){
            if(!this.state.devices.includes(device.id)) {
              console.log(this.state.devices)
              this.setState(prevState => ({
                devices: [...prevState.devices, device.id]
              }))
            }
          } 
        }
      );
    }, true);
  }


  onItemClick =(device)=>{
    

    this.manager.connectToDevice(device).then((device) => {
      
      Toast.show({
        text: `Connect to device ${device}`,
        buttonText: 'Okay'
      })
    }).catch((error) => {
      
        Toast.show({
          text: `Can not connect to device ${device}`,
          buttonText: 'Okay'
        })
    });
  }
  renderList =()=> {
    return this.state.devices.map((device, index)=>{
      
      return(
        <ListItem icon key={index} onPress={()=>this.onItemClick(device)}>
          <Left>
            <Button style={{ backgroundColor: "#007AFF" }}>
              <Icon active name="bluetooth" />
            </Button>
          </Left>
          <Body>
            <Text style={styles.text}>Device: {device}</Text>
          </Body>
          <Right>
            <Switch value={false} />
          </Right>
        </ListItem>
      )
    })
  }
  render() {
     {/*<SafeAreaView
        style={styles.container}
      >
        <Button
          onPress={() => {
            this.setState({
              text: []
            });
          }}
          title={"Clear"}
        />
        <FlatList
          style={styles.container}
          data={this.state.text}
          renderItem={({ item }) => <Text> {item} </Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>*/}
      
    return (
      <Root>
        <Container>
        <Header />
        <Content style={styles.container}>
          {this.renderList()}
        </Content>
    </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#242424'
  },
  text: {
    color: "#fff"
  }
});
