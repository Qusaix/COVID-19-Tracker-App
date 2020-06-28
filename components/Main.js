import React from "react";
import { StyleSheet , View , Image , Button, AsyncStorage, Alert} from 'react-native';
import { Container, Header, Content, Card, CardItem, Body, Text , Left , Right } from 'native-base';
import { MaterialCommunityIcons , FontAwesome5 , FontAwesome , Octicons } from '@expo/vector-icons';
import Moment from 'moment';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { ar } from "../localization/languages.js"
import * as Font from 'expo-font';
import { ProgressChart } from "react-native-chart-kit";
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
    app_title:'COVID 19 IN JORDAN',
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
    app_title:'كورونا في الاردن',

  },
};

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

// const data = {
//   labels: ["5/15", "5/16", "5/17", "5/18", "5/19", "6/1"],
//   datasets: [
//     {
//       data: [5, 25, 9, 10, 38, 0],
//       color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
//       strokeWidth: 3 // optional
//     }
//   ],
//  // legend: ["Rainy Days", "Sunny Days", "Snowy Days"] // optional
// };
// each value represents a goal ring in Progress chart
const data = {
  //labels: ["Cases","Deaths"], // optional
  data: [0.4, 0.6]
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
            'today_status':[],


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

            /** PUSH NEW STATUS */

            this.state.today_status.push( this.state.today_cases )
            this.state.today_status.push( this.state.today_deaths )

            this.setState({
              today_status:this.state.today_status
            });






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
                if( analytics_array[ analytics_array.length -1 ].date !== today && this.state.today_cases !== 0)
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


          <Container style={styles.container} >


            <Content >

              {/** HEADER IMAGE */  }
              <Image source={require('../assets/header_image.jpg')}  style={styles.headerImage} />

              <Text style={styles.screenTitle}> {i18n.t('app_title')} </Text>
              
             {/** CHART  */}
             
              <ProgressChart
                data={{
                  data:this.state.today_status
                }}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(18, 55, 100, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                hideLegend={false}
            />

            { /** CASES */ }

            <View style={styles.casesContner}>
                
               <Text style={ styles.statusBlocks2 }></Text>
               <Text style={ styles.statusBlocksText }> {i18n.t('cases')} : {this.state.today_cases} </Text>
               <Text style={ styles.statusBlocks1 }></Text>
               <Text style={ styles.statusBlocksText }> {i18n.t('deaths')} : {this.state.today_deaths} </Text>
               {/* <Text style={ styles.statusBlocks3 }></Text> */}
               


            </View>

              

                        <View style={{flex:1,alignItems:"center"}} >
                          <Image source={require('../assets/manWithmask.jpg')} style={{width:150,height:250}} />
                        <Text style={styles.overAllInfoTitle}>
                           {i18n.t('over_all_info')}
                        </Text>
                        </View>

                       <CardItem>
                         <Body style={{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
                           {/* <Text style={styles.overAllInfoText}>
                            {i18n.t('cases')}: {this.state.today_cases}
                           </Text> */}
                           <Text style={styles.overAllInfoText}>
                            {i18n.t('yesterday_cases')}: {this.state.yesterday_cases}
                           </Text>
                           <Text style={styles.overAllInfoText}>
                            {i18n.t('recoverd')}: {this.state.recoverd}
                           </Text>
                           <Text style={styles.overAllInfoText}>
                            {i18n.t('active')}: {this.state.active}
                           </Text>
                           <Text style={styles.overAllInfoText}>
                            {i18n.t('critical')}: {this.state.critical}
                           </Text>
                           <Text style={styles.overAllInfoText}>
                            {i18n.t('deaths')}: {this.state.deaths}
                           </Text>
                           <Text style={styles.overAllInfoText}>
                            {i18n.t('all_cases')}: {this.state.cases}
                           </Text>
                           <Text style={styles.overAllInfoText}>
                            {i18n.t('tests')}: {this.state.tests}
                           </Text>                   
                         </Body>
                       </CardItem>

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
      marginTop:"10%"
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
    headerImage: {
      height:150,
      width:350,
      borderRadius:9
    },
    screenTitle:{
      marginTop:"5%",
      color:"#123764",
      fontFamily:'Cairo_Bold',
    },
    statusBlocks1:{
      backgroundColor:'#8b0101',
      padding:25 ,
      height:10 ,
      margin:"2%" ,
      borderRadius:5
    },
    statusBlocks2:{
      backgroundColor:'#123764',
      padding:25 ,
      height:10 ,
      margin:"2%" ,
      borderRadius:5
    },
    statusBlocks3:{
      backgroundColor:'#000',
      padding:25 ,
      height:10 ,
      margin:"2%" ,
      borderRadius:5
    },
    statusBlocksText:{
       marginTop:"5%",
       fontSize:12,
       fontFamily:'Cairo_Regular'
       
    },
    casesContner:{
      flex:1 , 
      flexDirection:'row' ,
      justifyContent:"center"
    },
    overAllInfoTitle:{
      fontFamily:"Cairo_Bold",
      color:"#123764",
      
    },
    overAllInfoText:{
      fontFamily:"Cairo_Bold", 
      fontSize:12,
      margin:'2%'
    }
  
  });
  


export default Main;