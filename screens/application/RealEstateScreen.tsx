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
        <TouchableOpacity
          style={{
            width: '19%',
            height: '5%',
            // backgroundColor: '#ff000066',
            position: 'absolute',
            top: '34%',
            right: '11%',
            transform: [{ rotate: '45deg' }],
          }}
          onPress={() => setRegion(1)}
        ></TouchableOpacity>
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
