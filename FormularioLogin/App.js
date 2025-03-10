import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Guardar sesión
const SaveSession = async (token) => {
  await AsyncStorage.setItem('userToken', token);
}

// Recuperar sesión
const getSession = async () => {
  return await AsyncStorage.getItem('userToken');
}

// Eliminar sesión
const removeSession = async () => {
  return await AsyncStorage.removeItem('userToken');
}

const generateToken = () => {
  return Math.random().toString(36).substring(2); 
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('Correo electrónico obligatorio'),
  password: Yup.string()
    .required('Contraseña obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const LoginForm = ({ navigation }) => {
  const handleSubmit = async (values) => {
    const token = generateToken(); 

    await SaveSession(token);
    console.log('Sesión guardada:', token);
    console.log('Valores enviados:', values);

    navigation.navigate('Inicio');
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Button onPress={handleSubmit} title="Iniciar Sesión" />
        </View>
      )}
    </Formik>
  );
};

const Inicio = ({ navigation }) => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      //const storedToken = await AsyncStorage.getItem('userToken');
      const storedToken = await getSession();
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleLogout = async () => {
    //await AsyncStorage.removeItem('userToken');
    await removeSession();
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Bienvenido!</Text>
      <Text style={styles.tokenText}>Tu token es: {token}</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Inicio" component={Inicio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  tokenText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
