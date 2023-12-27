import { Dimensions, Text, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'
import rules from '../constants/rules'

const width = Dimensions.get('screen').width

export default function StocksOvertakeInfoModal() {
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
          Stocks Overtake explanation
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
          This indicator tells you how much your stock portfolio is
          outperforming the stock market on average {'\n'}If your investments
          grow faster than the stock market, then the rating will be greater
          than 1, if your investments are less successful and grow slower than
          the stock market, then less than 1.{'\n'}You can see all the
          information about the growth of the stock market on the analytics
          screen
        </Text>
      </View>
    </>
  )
}
