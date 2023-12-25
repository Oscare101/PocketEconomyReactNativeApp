import { Dimensions, Text, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

export default function PersonalStocksProgressModal() {
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
          Personal stocks progress explanation
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
          Here is the percentage change in share prices in your portfolio
          relative to the purchase price of the share, and below is a list of
          all shares in your portfolio
        </Text>
      </View>
    </>
  )
}
