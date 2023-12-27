import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../../constants/colors'
import HeaderDrawer from '../../components/HeaderDrawer'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import IconBlock from '../../components/IconBlock'
import rules from '../../constants/rules'
import { useState } from 'react'

const width = Dimensions.get('screen').width

export default function RealEstateScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const [region, setRegion] = useState<number>(0)

  const region1 = (
    <TouchableOpacity
      style={{
        width: '19%',
        height: '5%',
        position: 'absolute',
        top: '34%',
        right: '11%',
        zIndex: 2,
        transform: [{ rotate: '45deg' }],
      }}
      onPress={() => setRegion(1)}
    />
  )
  const region2 = (
    <>
      <TouchableOpacity
        style={{
          width: '17%',
          height: '7%',
          position: 'absolute',
          top: '22%',
          right: '27%',
          zIndex: 2,
          transform: [{ rotate: '30deg' }],
        }}
        onPress={() => setRegion(2)}
      />
      <TouchableOpacity
        style={{
          width: '17%',
          height: '3.5%',
          position: 'absolute',
          top: '11%',
          right: '30.5%',
          zIndex: 2,
          transform: [{ rotate: '-65deg' }],
        }}
        onPress={() => setRegion(2)}
      />
    </>
  )
  const region3 = (
    <>
      <TouchableOpacity
        style={{
          width: '20%',
          height: '7%',
          position: 'absolute',
          top: '10%',
          right: '19%',
          zIndex: 2,
          transform: [{ rotate: '-34deg' }],
        }}
        onPress={() => setRegion(3)}
      />
      <TouchableOpacity
        style={{
          width: '14%',
          height: '7%',
          position: 'absolute',
          top: '6%',
          right: '21%',
          zIndex: 2,
          transform: [{ rotate: '-0deg' }],
        }}
        onPress={() => setRegion(3)}
      />
    </>
  )
  const region4 = (
    <>
      <TouchableOpacity
        style={{
          width: '36%',
          height: '9%',
          position: 'absolute',
          top: '24%',
          right: '-5%',
          zIndex: 2,
          transform: [{ rotate: '61deg' }],
        }}
        onPress={() => setRegion(4)}
      />
      <TouchableOpacity
        style={{
          width: '7%',
          height: '9%',
          position: 'absolute',
          top: '17%',
          right: '23%',
          zIndex: 2,
          transform: [{ rotate: '-30deg' }],
        }}
        onPress={() => setRegion(4)}
      />
    </>
  )
  const region5 = (
    <>
      <TouchableOpacity
        style={{
          width: '6%',
          height: '9%',
          position: 'absolute',
          top: '29%',
          right: '41%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(5)}
      />

      <TouchableOpacity
        style={{
          width: '4%',
          height: '30%',
          position: 'absolute',
          top: '26%',
          right: '30%',
          zIndex: 2,
          transform: [{ rotate: '-52deg' }],
        }}
        onPress={() => setRegion(5)}
      />
    </>
  )
  const region6 = (
    <>
      <TouchableOpacity
        style={{
          width: '8%',
          height: '33%',
          position: 'absolute',
          top: '50%',
          right: '8%',
          zIndex: 2,
          transform: [{ rotate: '-23deg' }],
        }}
        onPress={() => setRegion(6)}
      />
    </>
  )
  const region7 = (
    <>
      <TouchableOpacity
        style={{
          width: '10%',
          height: '15%',
          position: 'absolute',
          top: '42%',
          right: '43%',
          zIndex: 2,
          transform: [{ rotate: '42deg' }],
        }}
        onPress={() => setRegion(7)}
      />
      <TouchableOpacity
        style={{
          width: '13%',
          height: '10%',
          position: 'absolute',

          top: '40%',
          right: '40%',
          zIndex: 2,
          transform: [{ rotate: '42deg' }],
        }}
        onPress={() => setRegion(7)}
      />
      <TouchableOpacity
        style={{
          width: '5.5%',
          height: '14%',
          position: 'absolute',
          top: '36.5%',
          right: '33.5%',
          zIndex: 2,
          transform: [{ rotate: '-47deg' }],
        }}
        onPress={() => setRegion(7)}
      />
    </>
  )
  const region8 = (
    <>
      <TouchableOpacity
        style={{
          width: '10%',
          height: '7%',
          position: 'absolute',
          top: '34%',
          right: '50%',
          zIndex: 2,
          transform: [{ rotate: '35deg' }],
        }}
        onPress={() => setRegion(8)}
      />
      <TouchableOpacity
        style={{
          width: '7%',
          height: '8%',
          position: 'absolute',
          top: '32%',
          right: '69%',
          zIndex: 2,
          transform: [{ rotate: '15deg' }],
        }}
        onPress={() => setRegion(8)}
      />
      <TouchableOpacity
        style={{
          width: '18%',
          height: '18%',
          position: 'absolute',
          top: '33.5%',
          right: '53.5%',
          zIndex: 2,
          transform: [{ rotate: '-75deg' }],
        }}
        onPress={() => setRegion(8)}
      />
    </>
  )
  const region9 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '12%',
          position: 'absolute',
          top: '4%',
          right: '51%',
          zIndex: 2,
          transform: [{ rotate: '43deg' }],
        }}
        onPress={() => setRegion(9)}
      />
      <TouchableOpacity
        style={{
          width: '10%',
          height: '9%',
          position: 'absolute',
          top: '16%',
          right: '48%',
          zIndex: 2,
          transform: [{ rotate: '38deg' }],
        }}
        onPress={() => setRegion(9)}
      />
    </>
  )
  const region10 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '8%',
          position: 'absolute',
          top: '24%',
          right: '53%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(10)}
      />
      <TouchableOpacity
        style={{
          width: '6%',
          height: '12%',
          position: 'absolute',
          top: '15%',
          right: '63%',
          zIndex: 2,
          transform: [{ rotate: '45deg' }],
        }}
        onPress={() => setRegion(10)}
      />
      <TouchableOpacity
        style={{
          width: '4%',
          height: '18%',
          position: 'absolute',
          top: '19%',
          right: '54%',
          zIndex: 2,
          transform: [{ rotate: '-50deg' }],
        }}
        onPress={() => setRegion(10)}
      />
    </>
  )
  const region11 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '18%',
          position: 'absolute',
          top: '50%',
          right: '28%',
          zIndex: 2,
          transform: [{ rotate: '-48deg' }],
        }}
        onPress={() => setRegion(11)}
      />
      <TouchableOpacity
        style={{
          width: '8%',
          height: '25%',
          position: 'absolute',
          top: '48%',
          right: '27%',
          zIndex: 2,
          transform: [{ rotate: '26deg' }],
        }}
        onPress={() => setRegion(11)}
      />
    </>
  )
  const region12 = (
    <>
      <TouchableOpacity
        style={{
          width: '27%',
          height: '6%',
          position: 'absolute',
          top: '50%',
          right: '56%',
          zIndex: 2,
          transform: [{ rotate: '15deg' }],
        }}
        onPress={() => setRegion(12)}
      />
      <TouchableOpacity
        style={{
          width: '22%',
          height: '10%',
          position: 'absolute',
          top: '54%',
          right: '60%',
          zIndex: 2,
          transform: [{ rotate: '50deg' }],
        }}
        onPress={() => setRegion(12)}
      />
      <TouchableOpacity
        style={{
          width: '6%',
          height: '24%',
          position: 'absolute',
          top: '52%',
          right: '60%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(12)}
      />
    </>
  )
  const region13 = (
    <>
      <TouchableOpacity
        style={{
          width: '29%',
          height: '5%',
          position: 'absolute',
          top: '64%',
          right: '32%',
          zIndex: 2,
          transform: [{ rotate: '52deg' }],
        }}
        onPress={() => setRegion(13)}
      />
      <TouchableOpacity
        style={{
          width: '8%',
          height: '22%',
          position: 'absolute',
          top: '58%',
          right: '51%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(13)}
      />
      <TouchableOpacity
        style={{
          width: '12%',
          height: '15%',
          position: 'absolute',
          top: '66%',
          right: '44%',
          zIndex: 2,
          transform: [{ rotate: '50deg' }],
        }}
        onPress={() => setRegion(13)}
      />
    </>
  )
  const region14 = (
    <>
      <TouchableOpacity
        style={{
          width: '26%',
          height: '12%',
          position: 'absolute',
          top: '13%',
          right: '65%',
          zIndex: 2,
          transform: [{ rotate: '-45deg' }],
        }}
        onPress={() => setRegion(14)}
      />
      <TouchableOpacity
        style={{
          width: '8%',
          height: '20%',
          position: 'absolute',
          top: '17%',
          right: '78%',
          zIndex: 2,
          transform: [{ rotate: '90deg' }],
        }}
        onPress={() => setRegion(14)}
      />
    </>
  )
  const region15 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '17%',
          position: 'absolute',
          top: '70%',
          right: '15%',
          zIndex: 2,
          transform: [{ rotate: '-35deg' }],
        }}
        onPress={() => setRegion(15)}
      />
      <TouchableOpacity
        style={{
          width: '5%',
          height: '17%',
          position: 'absolute',
          top: '61%',
          right: '18%',
          zIndex: 2,
          transform: [{ rotate: '-46deg' }],
        }}
        onPress={() => setRegion(15)}
      />
      <TouchableOpacity
        style={{
          width: '12%',
          height: '8%',
          position: 'absolute',
          top: '60%',
          right: '16%',
          zIndex: 2,
          transform: [{ rotate: '50deg' }],
        }}
        onPress={() => setRegion(15)}
      />
    </>
  )
  const region16 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '14%',
          position: 'absolute',
          top: '32%',
          right: '75%',
          zIndex: 2,
          transform: [{ rotate: '12deg' }],
        }}
        onPress={() => setRegion(16)}
      />
    </>
  )
  const region17 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '31%',
          position: 'absolute',
          top: '46%',
          right: '77%',
          zIndex: 2,
          transform: [{ rotate: '-32deg' }],
        }}
        onPress={() => setRegion(17)}
      />
    </>
  )
  const region18 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '18%',
          position: 'absolute',
          top: '77%',
          right: '56%',
          zIndex: 2,
          transform: [{ rotate: '-21deg' }],
        }}
        onPress={() => setRegion(18)}
      />
      <TouchableOpacity
        style={{
          width: '18%',
          height: '15%',
          position: 'absolute',
          top: '73%',
          right: '63%',
          zIndex: 2,
          transform: [{ rotate: '-28deg' }],
        }}
        onPress={() => setRegion(18)}
      />
    </>
  )
  const region19 = (
    <>
      <TouchableOpacity
        style={{
          width: '23%',
          height: '18%',
          position: 'absolute',
          top: '79%',
          right: '30%',
          zIndex: 2,
          transform: [{ rotate: '-21deg' }],
        }}
        onPress={() => setRegion(19)}
      />
    </>
  )
  // TITLES
  const title8 = (
    <Text
      style={{
        fontSize: width * 0.07,
        color:
          region === 8 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '37%',
        right: '61%',
      }}
    >
      8
    </Text>
  )
  const title9 = (
    <Text
      style={{
        fontSize: width * 0.07,
        color:
          region === 9 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '7%',
        right: '56%',
      }}
    >
      9
    </Text>
  )
  const title10 = (
    <Text
      style={{
        fontSize: width * 0.07,
        color:
          region === 10 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '22%',
        right: '60%',
      }}
    >
      10
    </Text>
  )
  const title11 = (
    <Text
      style={{
        fontSize: width * 0.07,
        color:
          region === 11 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '55%',
        right: '32%',
      }}
    >
      11
    </Text>
  )

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor },
      ]}
    >
      <HeaderDrawer title="Real estate" />
      <View
        style={{
          width: width,
          height: (width * 278) / 266,
        }}
      >
        <IconBlock width={width} theme={themeColor} type={region} />
        {/* TOUCHABLE */}
        {region1}
        {region2}
        {region3}
        {region4}
        {region5}
        {region6}
        {region7}
        {region8}
        {region9}
        {region10}
        {region11}
        {region12}
        {region13}
        {region14}
        {region15}
        {region16}
        {region17}
        {region18}
        {region19}
        {/* TITLES */}
        {title8}
        {title9}
        {title10}
        {title11}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})
