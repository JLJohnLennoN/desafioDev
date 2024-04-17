import { View, 
    Text, 
    StyleSheet,
    TouchableOpacity
   } from 'react-native'
  
   import { useNavigation } from '@react-navigation/native'
  
  export default function Welcome() {
    
    const navigation = useNavigation();
  
   return (
  <View style={styles.container}>
      <View style={styles.containerLogo}>

      </View>
  
      <View 
      animation='fadeInUp' delay={500}
      style={styles.containerForm}>
        <Text style={styles.title}>Frontend 3D car</Text>
        <Text style={styles.text}>Clique em 'Acessar' para começar</Text>
  
        <TouchableOpacity 
        style={styles.button}
        onPress={()=> navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
  
      </View>
  </View> 
    );
  }
  const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor:'#4169E1'
  
    },
    containerLogo:{
      flex: 2,
      backgroundColor:'#4169E1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerForm:{
      flex: 1,
      backgroundColor:'#FFF',
      paddingStart:'5%',
      paddingEnd:'5%',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25
    },
    title:{
      fontSize: 24,
      fontWeight:'bold',
      marginTop: 28,
      marginBottom: 12,
    },
    text:{
      color:'#A1A1A1',
    },
    button:{
      position:'absolute',
      backgroundColor:'#4169E1',
      borderRadius: 50,
      paddingVertical: 8,
      width: '60%',
      alignSelf:'center',
      bottom:'15%',
      alignItems:'center',
      justifyContent:'center'
  
    },
    buttonText:{
      fontSize: 18,
      color:'#FFF',
      fontWeight:'bold'
  
    },  
  })