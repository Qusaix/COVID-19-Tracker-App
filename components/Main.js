import React from "react";
import { StyleSheet , View , Image , Button, AsyncStorage, Alert} from 'react-native';
import { Container, Header, Content, Card, CardItem, Body, Text , Left , Right } from 'native-base';
import { MaterialCommunityIcons , FontAwesome5 , FontAwesome , Octicons } from '@expo/vector-icons';
import Moment from 'moment';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { ar } from "../localization/languages.js"
import * as Font from 'expo-font';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width/1.1;

i18n.translations = {
  en: { 
    last_time_was_updated: 'Last Time Was Updated',
    today_info:"Week Analytics",
    deaths:"Deaths",
    cases:"Today Cases",
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
    today_info:"احصائيات الاسبوع",
    deaths:"الموتى",
    cases:"اصابات اليوم",
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

const data = {
  labels: ["5/15", "5/16", "5/17", "5/18", "5/19", "6/1"],
  datasets: [
    {
      data: [5, 25, 9, 10, 38, 0],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
      strokeWidth: 3 // optional
    }
  ],
 // legend: ["Rainy Days", "Sunny Days", "Snowy Days"] // optional
};
const chartConfig = {
  backgroundGradientFrom: "black",
  backgroundGradientFromOpacity: 0.5,
  backgroundGradientTo: "red",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0,
  useShadowColorFromDataset: true // optional
};


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
            'all_analyrics':[],
            "analytics_date":[0],
            "analytics_num":[0],


        }
    }


   async componentDidMount(){

    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Cairo_Black: require('../assets/fonts/Cairo_Black.ttf'),
      Cairo_Regular: require('../assets/fonts/Cairo-Regular.ttf'),
      Cairo_Bold: require('../assets/fonts/Cairo-Bold.ttf'),



      
      
    });
      

      // Set the locale once at the beginning of your app.
      i18n.locale = Localization.locale;


        fetch("https://disease.sh/v2/countries/jordan",{
            method:"get",
            headers:{
                
            } 
        })
        .then((res)=>res.json())
        .then( async (res)=>{

           /** Analytics */

      // get the data
      let date = new Date;
      let today = date.getDate();
      let new_info = {'date':0,'cases':0};
      let all_data = [{'date':0,'cases':0}]; 


     

        // get the analytics
        try
        {
            let week_data = await AsyncStorage.getItem('analytics');
           

            if(week_data != null)
            {
                let analytics_array = JSON.parse(week_data);

                // check if we are in the same day 
                if( analytics_array[ analytics_array.length -1 ].date !== today )
                {
                 
                  new_info.date = today;
                  new_info.cases = this.state.today_cases;
                  
                  analytics_array.push(new_info);

                  // if all data have more then 7 dayes delete the last day
                  if( analytics_array.length > 7 )
                  {
                    
                    analytics_array.shift()
                  }

                  let i;

                  for( i = 0 ; i < analytics_array.length ; i++)
                  {
                    this.state.analytics_date.push( analytics_array[i].date );
                    this.state.analytics_num.push( analytics_array[i].cases ); 
          
                  }

                

                  this.setState({
                    analytics_date:this.state.analytics_date,
                    analytics_num:this.state.analytics_num,
                  });



                  // // save the data to in the phone
                   AsyncStorage.setItem('analytics',JSON.stringify( analytics_array ));



                }
                else
                {
                  let that = this;
                  AsyncStorage.getItem('analytics', (error, result) => {
                    this.setState({
                      all_analyrics: JSON.parse(result) 
                      },
                    function () {
          
                      let data = that.state.all_analyrics;

                      
          
                      let i;
          
                      for( i=0; i<data.length; i++ )
                      {
                        that.state.analytics_date.push(data[i].date)
                        that.state.analytics_num.push(data[i].cases)
                      }
                      
                      that.setState({
                        analytics_date: that.state.analytics_date,
                        analytics_num:that.state.analytics_num
                      });
          
                      });
                    });


                }



              
            }
            else
            {
                /** CREATE ANALYTICS  */
                AsyncStorage.setItem('analytics',JSON.stringify([{'date':0,'cases':0}]))

                let analytics_array_for_newUser = JSON.parse(week_data);


                if( analytics_array_for_newUser[ analytics_array_for_newUser.length -1 ].date !== today )
                {
                 
                  new_info.date = today;
                  new_info.cases = this.state.today_cases;
                  
                  analytics_array_for_newUser.push(new_info);

                  // if all data have more then 7 dayes delete the last day
                  if( analytics_array_for_newUser.length > 7 )
                  {
                    
                    analytics_array_for_newUser.shift()
                  }

                  let i;

                  for( i = 0 ; i < analytics_array_for_newUser.length ; i++)
                  {
                    this.state.analytics_date.push( analytics_array_for_newUser[i].date );
                    this.state.analytics_num.push( analytics_array_for_newUser[i].cases ); 
          
                  }

                

                  this.setState({
                    analytics_date:this.state.analytics_date,
                    analytics_num:this.state.analytics_num,
                  });



                  // // save the data to in the phone
                   AsyncStorage.setItem('analytics',JSON.stringify( analytics_array_for_newUser ));



                }
                else
                {
                  let that = this;
                  AsyncStorage.getItem('analytics', (error, result) => {
                    this.setState({
                      all_analyrics: JSON.parse(result) 
                      },
                    function () {
          
                      let data = that.state.all_analyrics;

                      
          
                      let i;
          
                      for( i=0; i<data.length; i++ )
                      {
                        that.state.analytics_date.push(data[i].date)
                        that.state.analytics_num.push(data[i].cases)
                      }
                      
                      that.setState({
                        analytics_date: that.state.analytics_date,
                        analytics_num:that.state.analytics_num
                      });
          
                      });
                    });


                }

               



            }
            


        } 
        catch
        {
            alert("there somthing wrong!")
        }

             /** UPDATE INFO */

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




     
      



      
     


      console.log(all_data);



        })


        /** Yesterday */

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

    _get_diffrent_data = ( today , yesterday )=>
    {
      return Math.abs(today - yesterday);
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
            <Text style={{fontSize:25,color:"#fff",fontFamily:"Cairo_Regular"}} > Jordan COVID 19 Tracker</Text>
          </Body>
        </Header>
            <Content>
                <Text style={{margin:"3%",fontSize:12}} >{i18n.t('last_time_was_updated')}: {Moment(this.state.update).format('hh:mmA dddd')}  </Text>
              <Card>
                <CardItem>
                  <Body>
                    <Text style={{fontFamily:"Cairo_Regular"}}>
                      {i18n.t('today_info')}
                    </Text>
                    <View style={{flex:1,flexDirection:"row",flexWrap:"wrap",marginTop:"3%"}} >

                      {/* <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                          <FontAwesome5 name={"bed"} size={30}  />
                          <Text style={{margin:"5%" , fontSize:25,fontFamily:"Cairo_Bold"}}>
                          {i18n.t('cases')}: {this.state.today_cases}
                          </Text>
                      </View>

                      <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <MaterialCommunityIcons name={"emoticon-dead"} size={30} />
                        <Text style={{margin:"5%" , fontSize:25,fontFamily:"Cairo_Bold"}}>
                        {i18n.t('deaths')}: {this.state.today_deaths}
                        </Text>
                      </View> */}
                      <LineChart
                    data={{
                      labels: this.state.analytics_date,
                      datasets: [
                        {
                          data: this.state.analytics_num,
                          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
                          strokeWidth: 3 // optional
                        }
                      ],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
             />

                   
                    </View>
                   
                  </Body>
                </CardItem>
              </Card>

              <Card>
              


                <CardItem>
                  <Body>
                    <Text style={{fontFamily:"Cairo_Bold"}}>
                    {i18n.t('over_all_info')}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('cases')}: {this.state.today_cases}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('yesterday_cases')}: {this.state.yesterday_cases}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('recoverd')}: {this.state.recoverd}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('active')}: {this.state.active}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('critical')}: {this.state.critical}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('deaths')}: {this.state.deaths}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
                    <FontAwesome name={"heartbeat"} size={15} /> {i18n.t('all_cases')}: {this.state.cases}
                    </Text>
                    <Text style={{margin:"5%" ,fontFamily:"Cairo_Regular", fontSize:18}}>
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