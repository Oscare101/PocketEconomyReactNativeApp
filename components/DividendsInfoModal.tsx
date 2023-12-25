import { Dimensions, Text, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

export default function DividendsInfoModal() {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          borderBottomWidth: 1,
          borderBlockColor: colors[themeColor].comment,
          height: 60,
          backgroundColor: colors[themeColor].cardColor,
        }}
      >
        <Text
          style={{ fontSize: width * 0.05, color: colors[themeColor].text }}
        >
          Dividends explanation
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: width * 0.045,
            color: colors[themeColor].text,
            width: '92%',
          }}
        >
          Dividends are part of the profit that the company pays to its
          investors, each company has statistics on the regularity of dividend
          payments, and the amount of interest to which payments are made{'\n'}
          Dividends are paid at 9:00 a.m. each day automatically
          {'\n'}Some companies may skip paying dividends altogether
        </Text>
      </View>
    </>
  )
}
