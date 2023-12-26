import { Dimensions, Text, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'
import rules from '../constants/rules'

const width = Dimensions.get('screen').width

export default function DepositInfoModal() {
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
          Deposit explanation
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
          The entire amount of the deposit with interest will be returned to
          your account automatically after mature date{'\n'}If you chose
          automatic renewal of the deposit, only interest will be returned to
          the account and the body of the deposit will be renewed for the same
          term
        </Text>
      </View>
    </>
  )
}
