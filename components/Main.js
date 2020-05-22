import React from "react";
import { StyleSheet, Text, View } from 'react-native';

class Main extends React.Component
{
    constructor(){

        super();

        this.state={
            "deaths":0,
            "recoverd":0,
            "cases":0,
            "today-cases":0,

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
        })

    }

    render()
    {
        return(
            <View style={styles.container}>
                <Text>
                    Hello
                </Text>
            </View>
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
  });
  


export default Main;