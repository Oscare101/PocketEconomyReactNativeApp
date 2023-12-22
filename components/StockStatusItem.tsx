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
const colorsArr = ['#cc4b41', '#cc8741', '#ccc341', '#a7cc41', '#54cc41']

export default function StockStatusItem(props: StockStatusItemProps) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const icons: any = {
    volatility: 'trending-up-outline',
    dividendsConsistency: 'time-outline',
    companySize: 'business-outline',
  }
  const color = {
    volatility: colorsArr[colorsArr.length - props.statNumber],
    dividendsConsistency: colorsArr[props.statNumber - 1],
    companySize: colorsArr[props.statNumber - 1],
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
          backgroundColor: `${color[props.type]}40`,
        },
      ]}
    >
      {props.title ? (
        <Text
          style={[
            styles.buttonTitle,
            {
              color: color[props.type],
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
        color={color[props.type]}
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
