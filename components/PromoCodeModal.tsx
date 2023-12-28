import { Dimensions, Text, TextInput, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import Button from './Button'
import rules from '../constants/rules'
import { User } from '../constants/interfaces'
import { updateUser } from '../redux/user'
import Toast from 'react-native-toast-message'
import { MMKV } from 'react-native-mmkv'
import { GetMoneyAmount } from '../functions/functions'

const width = Dimensions.get('screen').width
export const storage = new MMKV()

export default function PromoCodeModal(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const user: User = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const [request, setRequest] = useState<boolean>(false)
  const [promoCode, setPromoCode] = useState<string>('')

  function SetUserCash(value: number) {
    const newUserData: User = {
      ...user,
      cash: +(user.cash + value).toFixed(2),
    }

    dispatch(updateUser(newUserData))
    storage.set('user', JSON.stringify(newUserData))
    setPromoCode('')
    props.onClose()
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

  function SetPromoCode() {
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
          Promo code
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'column',
          marginVertical: width * 0.04,
        }}
      >
        <Text
          style={{ fontSize: width * 0.04, color: colors[themeColor].text }}
        >
          You know what to do, don't you?
        </Text>
        <TextInput
          style={{
            width: '92%',
            borderWidth: 1,
            borderColor: colors[themeColor].comment,
            borderRadius: 10,
            padding: 10,
            fontSize: 20,
            color: colors[themeColor].text,
          }}
          placeholder="promo code"
          value={promoCode}
          autoCapitalize="characters"
          placeholderTextColor={colors[themeColor].disable}
          onChangeText={(value: string) => {
            setPromoCode(value)
          }}
        />
        <Button
          title="SEND"
          type="info"
          action={() => {
            setRequest(true)
            SetPromoCode()
          }}
          disable={request}
        />
      </View>
    </>
  )
}
