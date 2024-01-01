import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { updateLog } from '../../redux/log'
import { Log, User } from '../../constants/interfaces'
import { useState } from 'react'
import { updateUser } from '../../redux/user'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmount,
} from '../../functions/functions'
import rules from '../../constants/rules'
import Toast from 'react-native-toast-message'
import Button from '../../components/Button'
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function PromoCodeScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const dispatch = useDispatch()

  const [request, setRequest] = useState<boolean>(false)
  const [promoCode, setPromoCode] = useState<string>('')

  function SetUserCash(value: number) {
    const newUserData: User = {
      ...user,
      cash: +(user.cash + value).toFixed(2),
    }
    dispatch(updateUser(newUserData))
    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.promoCode,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )
    setPromoCode('')
    navigation.goBack()
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `$ ${GetMoneyAmount(value).value}.${
          GetMoneyAmount(value).decimal
        }${GetMoneyAmount(value).title} added to your account`,
      },
      position: rules.toast.position,
    })
  }

  function CheckPromoCode() {
    const promo = Object.values(rules.promoCode).find(
      (p: any) => p.id === promoCode
    )
    if (promo !== undefined) {
      if (promo.type === 'cash') {
        SetUserCash(promo.value)
      }
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor, paddingBottom: 20 },
      ]}
    >
      <HeaderDrawer title="Promo code" onAction={() => navigation.goBack()} />
      <TextInput
        style={{
          width: '92%',
          borderWidth: 1,
          borderColor: colors[themeColor].comment,
          borderRadius: 10,
          padding: 10,
          fontSize: 20,
          color: colors[themeColor].text,
          marginVertical: 20,
        }}
        placeholder="promo code"
        value={promoCode}
        placeholderTextColor={colors[themeColor].disable}
        onChangeText={(value: string) => {
          setPromoCode(value.toLocaleUpperCase())
        }}
      />
      <View style={{ flex: 1 }} />
      <Button
        title="Request"
        type="info"
        action={() => {
          setRequest(true)
          CheckPromoCode()
        }}
        disable={request}
      />
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

  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartTitle: {
    fontSize: width * 0.05,
  },
  dateTime: { fontSize: width * 0.035 },
  cardComment: { fontSize: width * 0.05, fontWeight: '300' },
  input: {
    fontSize: width * 0.07,
    padding: 0,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
})
