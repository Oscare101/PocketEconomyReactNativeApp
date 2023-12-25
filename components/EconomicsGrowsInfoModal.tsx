import { Dimensions, Text, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

export default function EconomicsGrowsInfoModal() {
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
          Economics grows explanation
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
          Here is information on the growth of the entire economy in
          percentages, and separately of each company over the last 24 hours
          {'\n'}Note that the average indicator of economic growth is calculated
          relative to the size of each company, that is, the larger the company,
          the stronger it affects the change in the economy
        </Text>
      </View>
    </>
  )
}
