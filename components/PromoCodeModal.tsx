import { Text, TextInput, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector, useDispatch } from 'react-redux'
import { MMKV } from 'react-native-mmkv'
import { Log, User } from '../constants/interfaces'
import Button from './Button'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmountString,
} from '../functions/functions'
import { useState } from 'react'
import { updateUser } from '../redux/user'
import Toast from 'react-native-toast-message'
import rules from '../constants/rules'
import { updateLog } from '../redux/log'

export const storage = new MMKV()

export default function PromoCodeModal(props: any) {
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
    props.onClose()
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `$ ${GetMoneyAmountString(value)} added to your account`,
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

  const promoCodeBlock = (
    <>
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
        placeholder="amount of stocks ot buy"
        value={promoCode}
        placeholderTextColor={colors[themeColor].disable}
        onChangeText={(value: string) => {
          setPromoCode(value)
        }}
      />
      <Button
        title="Request"
        type="info"
        action={() => {
          setRequest(true)
          CheckPromoCode()
        }}
        disable={request}
      />
    </>
  )

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderBottomWidth: 1,
          borderBlockColor: colors[themeColor].comment,
          height: 60,
          backgroundColor: colors[themeColor].cardColor,
        }}
      >
        <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
          Promo code
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: 180,
        }}
      >
        {promoCodeBlock}
      </View>
    </>
  )
}
