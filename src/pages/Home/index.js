import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import jsonData from '../../data/frontend_data_gps.json';// Importar os dados do arquivo JSON

const R = 6371; // Radius of the earth in km
const dataGps = jsonData.courses;

export default function Home (){
  const {t} = useTranslation()
  // Definindo estados para a localização e mensagem de erro
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [speed, setSpeed] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const mapViewRef = useRef(null);
  const markerRef = useRef(null);

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

  // UseEffect para obter a velocidade atual do veículo
  useEffect(() => {
    let previousLocation = null;
    let distance = 0;
    let time = 0;

    const interval = setInterval(() => {
      if (location && location.coords) {
        if (previousLocation) {
          const newDistance = haversineDistance(
            previousLocation.latitude,
            previousLocation.longitude,
            location.coords.latitude,
            location.coords.longitude
          );
          distance += newDistance;
          const newTime = new Date().getTime();
          time = newTime - time;
          const newSpeed = distance / time;
          setSpeed(newSpeed);
        }
        previousLocation = { ...location.coords };
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [location]); // O array vazio como segundo argumento garante que o efeito seja executado apenas uma vez

  // UseEffect para obter a velocidade atual do veículo
  useEffect(() => {
    const requestLocation = async () => {
      // Solicita permissão para acessar a localização do usuário
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


  // Função para calcular a distância entre dois pontos usando a fórmula de Haversine
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI/ 180);
    const lat1_ = lat1 * (Math.PI / 180);
    const lat2_ = lat2 * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1_) *
        Math.cos(lat2_);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

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
      {/* Renderiza a mensagem deerro, se houver */}
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
          {/* Renderiza o marcador nas coordenadas selecionadas */}
          {selectedRoute !== null && (
            <Marker
              ref={markerRef}
              coordinate={longitudeLatitudeArray[0]}
              onPress={() => {
                Alert.alert(
                  t('marker_title'),
                  `${t('speed_message')} ${speed} km/h\n${t('distance_message')} ${haversineDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    longitudeLatitudeArray[0].latitude,
                    longitudeLatitudeArray[0].longitude
                  ).toFixed(2)} km`
                );
              }}
            />
          )}
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
