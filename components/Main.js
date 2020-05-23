import React from "react";
import { StyleSheet , View , Image , Button} from 'react-native';
import { Container, Header, Content, Card, CardItem, Body, Text , Left , Right } from 'native-base';
import { MaterialCommunityIcons , FontAwesome5 , FontAwesome , Octicons } from '@expo/vector-icons';
import Moment from 'moment';

class Main extends React.Component
{
    constructor(){

        super();

        this.state={
            "deaths":0,
            "recoverd":0,
            "cases":0,
            "today_cases":0,
            "today_recoverd":0,
            "today_deaths":0,
            "tests":0,
            'critical':0,
            'active':0,
            "update":"",
            "flag":"",
            "loading":true,


        }
    }


    componentDidMount(){


        fetch("https://disease.sh/v2/countries/jordan",{
            method:"get",
            headers:{
                
            }
        })
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res);

            let lastUpdate = new Date(parseInt(res.updated));
            let lastUpdateString = lastUpdate.toString();


            this.setState({
                today_cases:res.todayCases,
                today_deaths:res.todayDeaths,
                tests:res.tests,
                cases:res.cases,
                deaths:res.deaths,
                recoverd:res.recovered,
                critical:res.critical,
                active:res.active,
                update:lastUpdateString,
                flag:res.countryInfo.flag,
                loading:false,
            })
        })

    }

    
  

    update_data = () =>{

        fetch("https://disease.sh/v2/countries/jordan",{
            method:"get",
            headers:{
                
            }
        })
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res);

            this.setState({
                today_cases:res.todayCases,
                today_deaths:res.todayDeaths,
                tests:res.tests,
                cases:res.cases,
                deaths:res.deaths,
                recoverd:res.recovered,
                critical:res.critical,
                active:res.active,
                update:lastUpdate,
            })
            
        })

    }

    render()
    {
      Moment.locale('en');

      if(this.state.loading)
      {
        return(
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Octicons name={"database"} style={{color:"gray"}} size={50} />
            <Text style={{fontSize:30,color:"gray"}}>Getting Data...</Text>
          </View>
        )
      }
        return(
            <Container>
           <Header
           style={{
               backgroundColor:"#000"
           }}
           androidStatusBarColor={"#000"}
           >
          <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <Image
            source={{uri:this.state.flag}}
            style={{width:"20%",height:"20%"}}
            />
            <Text style={{fontSize:25,fontWeight:"bold",color:"#fff"}} > Jordan COVID 19 Tracker</Text>
          </Body>
        </Header>
            <Content>
                <Text style={{margin:"3%",fontSize:12}} >Last Time Was Updated: {Moment(this.state.update).format('hh:mmA d MMM')}</Text>
              <Card>
                <CardItem>
                  <Body>
                    <Text>
                      Today's Info
                    </Text>
                    <View style={{flex:1,flexDirection:"row",flexWrap:"wrap"}} >

                    <Text style={{margin:"5%" , fontSize:25}}>
                    <FontAwesome5 name={"bed"} size={15} /> Cases: {this.state.today_cases}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:25}}>
                    <MaterialCommunityIcons name={"emoticon-dead"} size={15} /> Deaths: {this.state.today_deaths}
                    </Text>
                    </View>
                   
                  </Body>
                </CardItem>
              </Card>

              <Card>
                <CardItem>
                  <Body>
                    <Text>
                      Overall info's
                    </Text>
                    <Text style={{margin:"5%" , fontSize:25}}>
                    <FontAwesome name={"heartbeat"} size={15} /> Recoverd: {this.state.recoverd}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:25}}>
                    <FontAwesome name={"heartbeat"} size={15} /> Active: {this.state.active}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:25}}>
                    <FontAwesome name={"heartbeat"} size={15} /> Critical: {this.state.critical}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:25}}>
                    <FontAwesome name={"heartbeat"} size={15} /> Deaths: {this.state.deaths}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:25}}>
                    <FontAwesome name={"heartbeat"} size={15} /> ALL Cases: {this.state.cases}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:25}}>
                    <FontAwesome name={"heartbeat"} size={15} /> Tests: {this.state.tests}
                    </Text>                   
                  </Body>
                </CardItem>
              </Card>
              
            </Content>
          </Container>
    
        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    animationContainer: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    buttonContainer: {
      paddingTop: 20,
    },
  
  });
  


export default Main;