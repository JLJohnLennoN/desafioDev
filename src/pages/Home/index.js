import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import jsonData from '../../data/frontend_data_gps.json';// Importar os dados do arquivo JSON

const dataGps = jsonData.courses;

export default function Home (){
  const {t} = useTranslation()
  // Definindo estados para a localização e mensagem de erro
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const mapViewRef = useRef(null);

    // Função que lida com a seleção de uma rota
    const handleRouteSelection = (index) => {
      setSelectedRoute(index);
      if (mapViewRef.current && dataGps[index].gps.length > 0) {
        mapViewRef.current.animateCamera({
          center: {
            latitude: dataGps[index].gps[0].latitude,
            longitude: dataGps[index].gps[0].longitude,
          },
          pitch: 45,
          altitude: 0,
          heading: 0,
          zoom: 16,
        });
      }
    };

    // Solicita permissão para acessar a localização do usuário
  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') {
        setErrorMsg(`${t('welcome_message')}`);
        return;
      }

      try {
        // Obtém a localização atual do usuário
        let userLocation = await Location.getCurrentPositionAsync({});
        // Define a localização no estado
        setLocation(userLocation);
      } catch (error) {
        // Se ocorrer um erro ao obter a localização, define uma mensagem de erro
        setErrorMsg(`${t('error_message')}`);
      }
    };

    requestLocation();
  }, []); // O array vazio como segundo argumento garante que o efeito seja executado apenas uma vez

  // Obtem a matriz "gps" dos dados JSON
  const gpsArray = selectedRoute ? dataGps[selectedRoute].gps : [];

  // Função map() para percorrer o array e retornar um novo array com apenas as propriedades "longitude" e "latitude"
  const longitudeLatitudeArray = gpsArray.map(item => {
    return {
      longitude: item.longitude,
      latitude: item.latitude,
    };
  });

  return (
    <View style={styles.container}>
      {/* Renderiza a mensagem de erro, se houver */}
      {errorMsg && <Text>{errorMsg}</Text>}
      {/* Renderiza o mapa se a localização estiver disponível */}
      {location && location.coords && (
        <MapView
          style={styles.map}
          ref={mapViewRef}
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Renderiza a linha no mapa usando o array de longitude e latitude */}
          <Polyline
            coordinates={longitudeLatitudeArray}
            strokeColor="#4169E1" // Defina a cor da linha aqui
            strokeWidth={3} // Defina a largura da linha aqui
          />
        </MapView>
      )}
       {/* Renderiza os botões que permitem ao usuário selecionar a rota */}
       <View style={styles.buttons}>
        {dataGps.map((route, index) => (
          <Button
            key={index}
            title={`${t('route_button')} ${index + 1}`}
            onPress={() => handleRouteSelection(index)}
          />
        ))}
      </View>
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'pace-around',
    padding: 10,
  },
});