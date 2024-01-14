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

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function BankInvestBlockModal(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)

  const dispatch = useDispatch()

  const [request, setRequest] = useState<boolean>(false)
  const [page, setPage] = useState<string>('info')
  const [amountToInvest, setAmountToInvest] = useState<string>('')
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>('')

  function GetUserBankInfo() {
    return user.bisuness?.find((b: any) => b.type === 'bank') as Bank
  }

  async function InvestFunc() {
    const businessesWithoutBank =
      user.bisuness?.filter((b: any) => b.type !== 'bank') || []
    const bankData: Bank = GetUserBankInfo()
    const newBankData: Bank = {
      ...bankData,
      cash:
        bankData.cash +
        +amountToInvest * (1 - rules.business.bank.investCommission / 100),
    }
    const newUserData: User = {
      ...user,
      bisuness: [...businessesWithoutBank, newBankData],
      cash: user.cash - +amountToInvest,
    }

    dispatch(updateUser(newUserData))
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `You have invested $ ${amountToInvest} to the bank`,
      },
      position: rules.toast.position,
    })
    setAmountToInvest('')
    setPage('info')
    setRequest(false)
  }

  async function WithdrawFunc() {
    const businessesWithoutBank =
      user.bisuness?.filter((b: any) => b.type !== 'bank') || []
    const bankData: Bank = GetUserBankInfo()
    const newBankData: Bank = {
      ...bankData,
      cash: bankData.cash - +amountToWithdraw,
    }
    const newUserData: User = {
      ...user,
      bisuness: [...businessesWithoutBank, newBankData],
      cash:
        user.cash +
        +amountToWithdraw * (1 - rules.business.bank.withdrawCommission / 100),
    }

    dispatch(updateUser(newUserData))
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `You have withdrawn $ ${amountToWithdraw} from the bank`,
      },
      position: rules.toast.position,
    })
    setAmountToWithdraw('')
    setPage('info')
    setRequest(false)
  }

  const data = [
    {
      title: 'Bank cash',
      icon: 'briefcase-outline',
      value: `$ ${GetMoneyAmountString(GetUserBankInfo().cash)}`,
    },

    {
      title: 'Your cash',
      icon: 'cash-outline',
      value: `$ ${GetMoneyAmountString(user.cash)}`,
    },
  ]

  const dataWtihdraw = [
    {
      title: 'Withdraw commission',
      icon: 'pricetag-outline',
      value: `${rules.business.bank.withdrawCommission} %`,
    },

    {
      title: 'After commission',
      icon: 'cash-outline',
      value: `$ ${GetMoneyAmountString(
        +amountToWithdraw * (1 - rules.business.bank.withdrawCommission / 100)
      )}`,
    },
  ]

  const dataInvest = [
    {
      title: 'Withdraw commission',
      icon: 'pricetag-outline',
      value: `${rules.business.bank.investCommission} %`,
    },

    {
      title: 'After commission',
      icon: 'cash-outline',
      value: `$ ${GetMoneyAmountString(
        +amountToInvest * (1 - rules.business.bank.investCommission / 100)
      )}`,
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

  const infoBlock = (
    <>
      <FlatList style={{ width: '100%' }} data={data} renderItem={RenderItem} />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <Button
          title="Invest"
          action={() => {
            setPage('Buy')
          }}
          type="success"
          disable={user.cash <= 0}
          style={{ width: '48%' }}
        />
        <Button
          title="Withdraw"
          action={() => {
            setPage('Sell')
          }}
          type="error"
          disable={GetUserBankInfo().cash <= 0}
          style={{ width: '48%' }}
        />
      </View>
    </>
  )

  const buyBlock = (
    <>
      <FlatList
        style={{ width: '100%' }}
        data={dataInvest}
        renderItem={RenderItem}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '92%',
          marginBottom: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setAmountToInvest(user.cash.toString())
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: colors[themeColor].infoText,
              textDecorationStyle: 'solid',
              textDecorationColor: colors[themeColor].infoText,
              textDecorationLine: 'underline',
            }}
          >
            Max
          </Text>
        </TouchableOpacity>
        <Text style={{ color: colors[themeColor].comment }}>
          {' '}
          can buy {GetMoneyAmountString(user.cash)}
        </Text>
      </View>
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
        value={amountToInvest}
        keyboardType="number-pad"
        placeholderTextColor={colors[themeColor].disable}
        onChangeText={(value: string) => {
          const formatedValue = value.replace(/[^0-9]/g, '')
          if (formatedValue === '0') {
            return false
          } else if (+formatedValue > user.cash) {
            return false
          } else {
            setAmountToInvest(formatedValue)
          }
        }}
      />

      <Button
        title="Invest"
        type="info"
        action={() => {
          setRequest(true)
          InvestFunc()
        }}
        disable={!amountToInvest || +amountToInvest > user.cash || request}
        style={{ marginVertical: width * 0.03 }}
      />
    </>
  )

  const sellBlock = (
    <>
      <FlatList
        style={{ width: '100%' }}
        data={dataWtihdraw}
        renderItem={RenderItem}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '92%',
          marginBottom: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setAmountToWithdraw(GetUserBankInfo().cash.toString())
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: colors[themeColor].infoText,
              textDecorationStyle: 'solid',
              textDecorationColor: colors[themeColor].infoText,
              textDecorationLine: 'underline',
            }}
          >
            Max
          </Text>
        </TouchableOpacity>
        <Text style={{ color: colors[themeColor].comment }}>
          {' '}
          can withdraw {GetMoneyAmountString(GetUserBankInfo().cash)}
        </Text>
      </View>
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
        value={amountToWithdraw}
        keyboardType="number-pad"
        placeholderTextColor={colors[themeColor].disable}
        onChangeText={(value: string) => {
          const formatedValue = value.replace(/[^0-9]/g, '')
          if (formatedValue === '0') {
            return false
          } else if (+formatedValue > GetUserBankInfo().cash) {
            return false
          } else {
            setAmountToWithdraw(formatedValue)
          }
        }}
      />

      <Button
        title="Withdraw"
        type="info"
        action={() => {
          setRequest(true)
          WithdrawFunc()
        }}
        disable={
          !amountToWithdraw ||
          +amountToWithdraw > GetUserBankInfo().cash ||
          request
        }
        style={{ marginVertical: width * 0.03 }}
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
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: page === 'Info' ? 0 : 1,
          }}
          activeOpacity={0.8}
          disabled={page === 'Info'}
          onPress={() => {
            setPage('Info')
            setAmountToInvest('')
            setAmountToWithdraw('')
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            color={colors[themeColor].text}
            size={24}
          />
        </TouchableOpacity>

        <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
          {page === 'Buy'
            ? 'Invest'
            : page === 'Sell'
            ? 'Withraw'
            : 'Transaction'}
        </Text>
        <View style={{ width: 60 }} />
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {page === 'Buy' ? buyBlock : page === 'Sell' ? sellBlock : infoBlock}
      </View>
    </>
  )
}
