import React, { useState } from "react";
import { StyleSheet,Text,View,TextInput,TouchableOpacity, } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker"; 



// API Key used 
const API_KEY = "fca_live_wf2aZBB398NMmejQZ7zd5geglOhT7aYpQahucMR3";

// Drop down Currency countries
const CURRENCIES = ["CAD", "USD", "EUR", "GBP", "AUD", "JPY", "INR"];

const Stack = createStackNavigator();

function MainScreen({ navigation }) {
  const [base, setBase] = useState("CAD");
  const [destination, setDestination] = useState("USD");
  const [amount, setAmount] = useState("1");
  const [error, setError] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rateUsed, setRateUsed] = useState(null);


  //This is to vaildate the inputes to see if the currency code is correct or not 
  const validateInputs = () => {
    const codeRegex = /^[A-Z]{3}$/;

    if (!codeRegex.test(base)) {
      return "Currency codes must be 3-letter uppercase ISO codes (e.g: CAD).";
    }

    if (!codeRegex.test(destination)) {
      return "Currency codes must be 3-letter uppercase ISO codes (e.g: CAD).";
    }

    // You must use a positvie number to get a currency 

    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      return "Amount must be a positive number.";
    }

    return null;
  };

    // Response section from rate 

    const getRateFromResponse = (data, currencyCode) => {
    if (!data || !data.data) {
      return null;
    }

    if (!Object.prototype.hasOwnProperty.call(data.data, currencyCode)) {
    return "MISSING";   
  }

    const rate = data.data[currencyCode];

    if (typeof rate !== "number") {
      return null;
    }

    return rate; 
  };


  const Conversion = async () => {
    const validationError = validateInputs();

    if (validationError) {
      setError(validationError);
      setConvertedAmount(null);
      setRateUsed(null);  
      return;
    }

    // inputs are valid
    setError("");
    setConvertedAmount(null);
    setRateUsed(null);  
    setIsLoading(true);

    try {
      
      const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${base}&currencies=${destination}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
    setError(`Server error (${response.status}). Sorry error! Please try again later.`);
    return;
  }

      console.log("API response:", data);

      // Handle API-level errors
      
      if (data && data.error) {
          setError(`API error: ${data.error}`);
          return;
        }

      if (data && data.message && !data.data) {
        setError(`API error: ${data.message}`);
        return;
      }

      const rate = getRateFromResponse(data, destination);

      if (rate === "MISSING") {
      setError(`No exchange rate available for ${destination}. Please check the currency code.`);
      return;
}
      
      if (rate !== null) {
      const numAmount = Number(amount);
      setConvertedAmount(rate * numAmount);
      setRateUsed(rate);  
    } else {
      setError("Unable to get exchange rate. Please try again.");
    }
    } catch (e) {
      console.log("API error:", e);
      setError("Network error. Please try again.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Currency Converter</Text>

        <View style={styles.inputSection}>
        <Text style={styles.label}>Base Currency</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={base}
            onValueChange={(value) => setBase(value)}
            style={styles.picker}
            dropdownIconColor="#1E8449">
            {CURRENCIES.map((code) => (
              <Picker.Item key={code} label={code} value={code} />
            ))}
          </Picker>
        </View>
      </View>


        <View style={styles.inputSection}>
        <Text style={styles.label}>Destination Currency</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={destination}
            onValueChange={(value) => setDestination(value)}
            style={styles.picker}
            dropdownIconColor="#1E8449" >
            {CURRENCIES.map((code) => (
              <Picker.Item key={code} label={code} value={code} />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={styles.swapButton}
        onPress={() => {
          const temp = base;
          setBase(destination);
          setDestination(temp);
        }}>
        <Text style={styles.swapButtonText}>↕ Swap Currencies</Text>
      </TouchableOpacity>




        <View style={styles.inputSection}>
          <Text style={styles.label}>Converting Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {isLoading ? (
          <Text style={styles.loadingText}>Getting latest exchange rate...</Text>
        ) : null}

        {convertedAmount !== null && !error && !isLoading && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              {amount} {base} = {convertedAmount.toFixed(2)} {destination}
            </Text>

            {rateUsed !== null && (
              <Text style={styles.rateText}>
                Rate used: {rateUsed}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.convertButton} onPress={Conversion}>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aboutButton}
          onPress={() => navigation.navigate("About")}
        >
          <Text style={styles.aboutButtonText}>About Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AboutScreen() {
  return (

    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.aboutTitle}>About Us</Text>
        <Text style={styles.studentinfo}>Full Name: Ayesha Akbar</Text>
        <Text style={styles.studentinfo}>Student ID: 100949840</Text>
        
        <Text style={styles.separator}>
          ************************************************
        </Text>
        <Text style={styles.studentinfo}>Full Name: Suthan Sureshkumar</Text>
        <Text style={styles.studentinfo}>Student ID: 101511337</Text>
        
        <Text style={styles.separator}>
          ************************************************
        </Text>

        <Text style={styles.studentinfo}>
          This is a currency conversion app that was created by Ayesha and
          Suthan as part of Assignment 2 for COMP3074. It is a React Native app.
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: "Currency Converter" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "About Us" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1E8449",
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "white",
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
  },
  convertButton: {
    backgroundColor: "#1E8449",
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  convertButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  aboutButton: {
    backgroundColor: "#555",
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  aboutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  aboutTitle: {
    marginBottom: 18,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E8449",
  },
  studentinfo: {
    marginBottom: 12,
    fontSize: 18,
    color: "#222",
  },
  separator: {
    marginVertical: 8,
    textAlign: "center",
    color: "#888",
  },
  error: {
    color: "red",
    marginTop: 6,
    marginBottom: 4,
    fontSize: 16,
  },
  loadingText: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 14,
    color: "#555",
  },
  resultBox: {
    marginTop: 12,
    marginBottom: 4,
    padding: 12,
    backgroundColor: "#E9F7EF",
    borderRadius: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#145A32",
    textAlign: "center",
  },

    rateText: {
    marginTop: 6,
    fontSize: 16,
    color: "#1E8449",
    textAlign: "center",
  },

  pickerWrapper: {
  borderWidth: 1,
  borderColor: "#CCC",
  borderRadius: 10,
  backgroundColor: "white",
  overflow: "hidden",
  marginBottom: 10,
},
picker: {
  height: 48,
},

swapButton: {
  backgroundColor: "#1E8449",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10,
  marginBottom: 20,
},
swapButtonText: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
},


});
