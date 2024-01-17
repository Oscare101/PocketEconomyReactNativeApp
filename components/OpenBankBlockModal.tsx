import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector, useDispatch } from 'react-redux'

import { Ionicons } from '@expo/vector-icons'
import { updateTheme } from '../redux/theme'
import { MMKV } from 'react-native-mmkv'
import Button from './Button'
import { useState } from 'react'
import { Bank, Log, User } from '../constants/interfaces'
import rules from '../constants/rules'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmount,
  GetMoneyAmountString,
} from '../functions/functions'
import { updateUser } from '../redux/user'
import { updateLog } from '../redux/log'
import Toast from 'react-native-toast-message'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function OpenBankBlockModal(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)

  const dispatch = useDispatch()

  const [request, setRequest] = useState<boolean>(false)

  async function OpenBank() {
    const userBusinesses = user?.bisuness || []
    const newBankData: Bank = {
      type: 'bank',
      cash: 0,
      clientsAmount: 100,
      depositRate: rules.business.bank.centralBankDepositRate,
      creditRate: rules.business.bank.centralBankCreditRate,
      commission: rules.business.bank.centralBankCommission,
      startDate: GetCurrentDate(),
      lastUpdate: GetCurrentDate(),
    }
    const newUserData: User = {
      ...user,
      cash: +(user.cash - rules.business.bank.cost).toFixed(2),
      bisuness: [...userBusinesses, newBankData],
    }

    dispatch(updateUser(newUserData))
    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.bankOpenning,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )

    Toast.show({
      type: 'ToastMessage',
      props: {
        title: 'You have opened a bank',
      },
      position: rules.toast.position,
    })
    props.onClose()
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
        <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
          Open Bank
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
        <Text
          style={{
            fontSize: width * 0.045,
            color: colors[themeColor].text,
            width: '92%',
          }}
        >
          You can get a license for bank opening
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 50,
            width: '100%',
            paddingHorizontal: 20,
            alignSelf: 'center',
          }}
        >
          <Ionicons
            name={'briefcase-outline'}
            size={20}
            color={colors[themeColor].text}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors[themeColor].text,
              }}
            >
              Openning cost
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors[themeColor].text,
              }}
            >
              {GetMoneyAmountString(rules.business.bank.cost)}
            </Text>
          </View>
        </View>
        <Button
          title="Buy"
          type="info"
          action={OpenBank}
          disable={user.cash < rules.business.bank.cost || request}
        />
      </View>
    </>
  )
}
