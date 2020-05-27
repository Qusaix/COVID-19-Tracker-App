import React from "react";
import { StyleSheet , View , Image , Button} from 'react-native';
import { Container, Header, Content, Card, CardItem, Body, Text , Left , Right } from 'native-base';
import { MaterialCommunityIcons , FontAwesome5 , FontAwesome , Octicons } from '@expo/vector-icons';
import Moment from 'moment';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { ar } from "../localization/languages.js"

i18n.translations = {
  en: { 
    last_time_was_updated: 'Last Time Was Updated',
    today_info:"Today's info",
    deaths:"Deaths",
    cases:"Cases",
    yesterday_cases:"Yesterday Cases",
    recoverd:"Recoverd",
    active:"Active",
    critical:"Critical",
    all_cases:"All Cases",
    tests:"Tests",
    over_all_info:"Overall info's",
    loading:"Getting Data...",
  },
  ar: { 
    last_time_was_updated: 'تم التحديث',
    today_info:"معلومات اليوم",
    deaths:"الموتى",
    cases:"الاصابات",
    yesterday_cases:"اصابات البارحة",
    recoverd:"حالات الشفاء",
    active:"حالات نشطه",
    critical:"حالات خطره",
    all_cases:"جميع الحالات",
    tests:"الفحوصات",
    over_all_info:"جميع المعلومات",
    loading:"جاري جمع المعلومات...",

  },
};

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

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
            "yesterday_cases":0,


        }
    }


    componentDidMount(){

      // Set the locale once at the beginning of your app.
      i18n.locale = Localization.locale;


        fetch("https://disease.sh/v2/countries/jordan",{
            method:"get",
            headers:{
                
            }
        })
        .then((res)=>res.json())
        .then((res)=>{

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
            })
        })

        fetch("https://disease.sh/v2/countries/jordan?yesterday=true",{
          method:"get",
          headers:{
               
          }
      })
      .then((res)=>res.json())
      .then((res)=>{

          this.setState({
              yesterday_cases:res.todayCases,
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
              <Text style={{fontSize:30,color:"gray"}}>{i18n.t('loading')}</Text>
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
                <Text style={{margin:"3%",fontSize:12}} >{i18n.t('last_time_was_updated')}: {Moment(this.state.update).format('hh:mmA dddd')}  </Text>
              <Card>
                <CardItem>
                  <Body>
                    <Text>
                      {i18n.t('today_info')}
                    </Text>
                    <View style={{flex:1,flexDirection:"row",flexWrap:"wrap",marginTop:"3%"}} >

                      <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                          <FontAwesome5 name={"bed"} size={30}  />
                          <Text style={{margin:"5%" , fontSize:25}}>
                          {i18n.t('cases')}: {this.state.today_cases}
                          </Text>
                      </View>

                      <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <MaterialCommunityIcons name={"emoticon-dead"} size={30} />
                        <Text style={{margin:"5%" , fontSize:25}}>
                        {i18n.t('deaths')}: {this.state.today_deaths}
                        </Text>
                      </View>

                   
                    </View>
                   
                  </Body>
                </CardItem>
              </Card>

              <Card>
                <CardItem>
                  <Body>
                    <Text>
                    {i18n.t('over_all_info')}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('yesterday_cases')}: {this.state.yesterday_cases}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('recoverd')}: {this.state.recoverd}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('active')}: {this.state.active}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('critical')}: {this.state.critical}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('deaths')}: {this.state.deaths}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('all_cases')}: {this.state.cases}
                    </Text>
                    <Text style={{margin:"5%" , fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('tests')}: {this.state.tests}
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