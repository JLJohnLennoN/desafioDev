import React from 'react';
import { View, Image } from 'react-native';

const carSprite = require('../assets/vehicles.png'); // Caminho para o sprite

export default function Car  ({ direction })  {
    // Suponha que cada imagem do carro no sprite tem 50x50 pixels
    const spriteSize = 50;

    // Mapeando direções para posições no sprite
    const directionMap = {
        'N': 0,
        'NE': 1,
        'E': 2,
        'SE': 3,
        'S': 4,
        'SW': 5,
        'W': 6,
        'NW': 7
    };

    // Encontrar a posição X no sprite baseada na direção
    const positionX = spriteSize * (directionMap[direction] || 0);

    return (
        <View>
            <Image
                source={carSprite}
                style={{
                    width: spriteSize,
                    height: spriteSize,
                    resizeMode: 'cover',
                    transform: [{ translateX: -positionX }]
                }}
            />
        </View>
    );
};