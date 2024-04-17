//Importações
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Home (){
  // Definindo estados para a localização e mensagem de erro
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  

  // Efeito que é executado uma vez, quando o componente é montado
  useEffect(() => {
    (async () => {
      // Solicita permissão para acessar a localização do usuário
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Se a permissão não for concedida, define uma mensagem de erro
        setErrorMsg('Permissão de localização não concedida');
        return;
      }

      try {
        // Obtém a localização atual do usuário
        let userLocation = await Location.getCurrentPositionAsync({});
        // Define a localização no estado
        setLocation(userLocation);
      } catch (error) {
        // Se ocorrer um erro ao obter a localização, define uma mensagem de erro
        setErrorMsg('Erro ao obter a localização do usuário');
      }
    })();
  }, []); // O array vazio como segundo argumento garante que o efeito seja executado apenas uma vez

  // Retorna a estrutura do componente
  return (
    <View style={styles.container}>
      {/* Renderiza a mensagem de erro, se houver */}
      {errorMsg && <Text>{errorMsg}</Text>}
      {/* Renderiza o mapa se a localização estiver disponível */}
      {location && location.coords && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Renderiza a rota a partir dos dados do arquivo JSON 
          {frontendDataGPS.route && (
            <Polyline
              coordinates={frontendDataGPS.route}
              
              strokeWidth={2}
              strokeColor="#00f"
            />
          )}
          */}
        </MapView>
      )}
    </View>
  );
};

//Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});