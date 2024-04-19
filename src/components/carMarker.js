import React from 'react';
import { Marker } from 'react-native-maps';
import {  Alert } from 'react-native';
import Car from '../components/car';

export default function CarMarker ({ coordinate, direction })  {
  return (
    <Marker 
    coordinate={coordinate}>
      <Car direction={direction} />
    </Marker>
  );
};

