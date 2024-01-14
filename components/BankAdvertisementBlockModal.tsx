import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
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
import { GetAdCost } from '../functions/bankFunctions'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function BankAdvertisementBlockModal(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)

  const dispatch = useDispatch()

  const [request, setRequest] = useState<boolean>(false)
  const [amount, setAmount] = useState<string>('')

  function GetUserBankInfo() {
    return user.bisuness?.find((b: any) => b.type === 'bank') as Bank
  }

  async function AttractClients() {
    const businessesWithoutBank =
      user.bisuness?.filter((b: any) => b.type !== 'bank') || []
    const bankData: Bank = GetUserBankInfo()
    const newClients = Math.floor(+amount * rules.business.bank.clientsPerAdd)
    const newBankData: Bank = {
      ...bankData,
      clientsAmount: bankData.clientsAmount + newClients,
      cash: bankData.cash - +amount,
    }
    const newUserData: User = {
      ...user,
      bisuness: [...businessesWithoutBank, newBankData],
    }

    dispatch(updateUser(newUserData))
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `Your advertisement attracted ${newClients} clients`,
      },
      position: rules.toast.position,
    })
    props.onClose()
  }

  const data = [
    {
      title: 'Advertisement cost',
      icon: 'pricetags-outline',
      value: `$ ${GetMoneyAmountString(
        GetAdCost(GetUserBankInfo().startDate)
      )}`,
    },
    {
      title: 'Clients per ad',
      icon: 'person-add-outline',
      value: `${rules.business.bank.clientsPerAdd}`,
    },
    {
      title: 'Bank cash',
      icon: 'cash-outline',
      value: `$ ${GetMoneyAmountString(GetUserBankInfo().cash)}`,
    },
  ]

  function RenderItem({ item }: any) {
    return (
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
        <Ionicons name={item.icon} size={20} color={colors[themeColor].text} />
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
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors[themeColor].text,
            }}
          >
            {item.value}
          </Text>
        </View>
      </View>
    )
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
          Bank advertisement
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: width * 0.03,
        }}
      >
        <FlatList
          style={{ width: '100%' }}
          data={data}
          renderItem={RenderItem}
        />
        <TextInput
          style={{
            width: '92%',
            borderWidth: 1,
            borderColor: colors[themeColor].comment,
            borderRadius: 10,
            padding: 10,
            fontSize: 20,
            color: colors[themeColor].text,
            marginBottom: width * 0.03,
          }}
          placeholder="advertisement amount"
          value={amount}
          keyboardType="number-pad"
          placeholderTextColor={colors[themeColor].disable}
          onChangeText={(value: string) => {
            const formatedValue = value.replace(/[^0-9]/g, '')
            if (formatedValue === '0') {
              return false
            } else if (+formatedValue > GetUserBankInfo().cash) {
              return false
            } else {
              setAmount(formatedValue)
            }
          }}
        />

        <Button
          title="Buy"
          type="info"
          action={AttractClients}
          disable={GetUserBankInfo().cash < +amount || request}
        />
      </View>
    </>
  )
}
