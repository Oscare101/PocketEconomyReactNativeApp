import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

interface StockStatusItemProps {
  title: boolean
  type: 'volatility' | 'dividendsConsistency' | 'companySize'
  statNumber: number
}
const volatility = ['Low', 'Moderate', 'Middle', 'High', 'Substantial']
const dividendsConsistency = [
  'Rarely',
  'Periodically',
  'Often',
  'Frequently',
  'Always',
]

const companySize = [
  'Microenterprise',
  'Start-up',
  'Local enterprise',
  'Multinational corporation',
  'Global conglomerate',
]

export default function StockStatusItem(props: StockStatusItemProps) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const colorsTextArr = [
    colors[themeColor].errorText,
    colors[themeColor].semiErrorText,
    colors[themeColor].warningText,
    colors[themeColor].semiSuccessText,
    colors[themeColor].successText,
  ]
  const colorsBgArr = [
    colors[themeColor].errorBg,
    colors[themeColor].semiErrorBg,
    colors[themeColor].warningBg,
    colors[themeColor].semiSuccessBg,
    colors[themeColor].successBg,
  ]

  const icons: any = {
    volatility: 'trending-up-outline',
    dividendsConsistency: 'time-outline',
    companySize: 'business-outline',
  }
  const colorText = {
    volatility: colorsTextArr[colorsTextArr.length - props.statNumber],
    dividendsConsistency: colorsTextArr[props.statNumber - 1],
    companySize: colorsTextArr[props.statNumber - 1],
  }
  const colorBg = {
    volatility: colorsBgArr[colorsBgArr.length - props.statNumber],
    dividendsConsistency: colorsBgArr[props.statNumber - 1],
    companySize: colorsBgArr[props.statNumber - 1],
  }
  const titles = {
    volatility: volatility[props.statNumber - 1],
    dividendsConsistency: dividendsConsistency[props.statNumber - 1],
    companySize: companySize[props.statNumber - 1],
  }

  return (
    <View
      style={[
        styles.stat,
        {
          backgroundColor: `${colorBg[props.type]}`,
        },
      ]}
    >
      {props.title ? (
        <Text
          style={[
            styles.buttonTitle,
            {
              color: colorText[props.type],
              marginRight: 5,
            },
          ]}
        >
          {titles[props.type]}
        </Text>
      ) : (
        <></>
      )}
      <Ionicons
        name={icons[props.type]}
        size={width * 0.04}
        color={colorText[props.type]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  stat: {
    borderRadius: width * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.005,
    paddingHorizontal: width * 0.015,
    flexDirection: 'row',
  },
  buttonTitle: { fontSize: width * 0.04, fontWeight: '300' },
})
