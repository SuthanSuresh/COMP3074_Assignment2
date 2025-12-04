import React, {useState} from "react";
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

const Stack= createStackNavigator();

function Mainscreen({navigation}){
  const [base, setBase]= useState("CAD");
  const [destination, setDestination]= useState("USD");
  const [amount, setAmount]= useState("1");
  const [error, setError] = useState("");

  const validateInputs = () => {
    const codeRegex= /^[A-Z]{3}$/; 

    if(!codeRegex.test(base)){
      return "Currency codes must be 3-letter uppercase ISO codes.(e.g: CAD)"
    }

    if(!codeRegex.test(destination)){
      return "Currency codes must be 3-letter uppercase ISO codes.(e.g: CAD)"
    }

    const num= Number(amount);
    if(isNaN(num) || num <=0){
      return "Amount must be a positive number."
    }
    return null; 
  };

  const Conversion = () => {
    const validationError = validateInputs();

    if(validationError){
      setError(validationError);
    }
    else{
      setError("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Base Currency</Text>
        <TextInput 
          value={base}
          onChangeText={(t)=> setBase(t.toUpperCase())}
          style={styles.input}
          maxLength={3}
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Destination Currency</Text>
        <TextInput 
          value={destination}
          onChangeText={(t)=> setDestination(t.toUpperCase())}
          style={styles.input}
          maxLength={3}
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Amount</Text>
        <TextInput 
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        {error? <Text style={StyleSheet.error}>{error}</Text>: null}

        <View style={styles.convertButton}>
          <Button title="Convert" onPress={Conversion} color="white" />
        </View>

        <View style={styles.aboutButton}>
          <Button title="About Us" onPress={()=> navigation.navigate("About")} color="white" />
        </View>
      </View>
    </View>
  );
}

function AboutScreen(){
  return(
    <View style={styles.container}>
      <Text style={styles.aboutTitle}>About Us</Text>
      <Text style={styles.studentinfo}>Full Name: Suthan Sureshkumar</Text>
      <Text style={styles.studentinfo}>Student ID: 101511337</Text>

      <Text style={styles.seperator}>----------------------------------------------</Text>

      <Text style={styles.studentinfo}>Full Name: Ayesha Akbar</Text>
      <Text style={styles.studentinfo}>Student ID: 100949840</Text>

      <Text style={styles.seperator}>----------------------------------------------</Text>

      <Text style={styles.studentinfo}>This is a curreny conversion app, that was created by Ayesha and Suthan as part of Assignment 2 for COMP3074.</Text>

    </View>
  );
}

export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Mainscreen} options={{title: "Currency Converter"}} />
        <Stack.Screen name="About" component={AboutScreen} options={{title: "About"}} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'center',
    padding: 25,
  },

  title:{
    fontSize: 25,
    textAlign: 'center', 
    fontWeight: 'bold',
    marginBottom: 25,
  },
  inputSection:{
    marginBottom: 15,
  },
  label: {
    fontsize: 20,
    marginBottom: 8,
    fontWeight: 700,
  },
  input:{
    borderWidth:1,
    borderColor: 'black',
    backgroundColor: 'white',
    fontSize: 15,
    padding: 10,
    borderRadius:10,
  },
  convertButton:{
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
    backgroundColor: 'green',
  },
  aboutButton:{
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#4A4A4A',
  },
  aboutTitle:{
    marginBottom: 15,
    fontSize: 25,
  },
  studentinfo:{
    marginBottom: 15,
    fontSize: 20,
  }
});
