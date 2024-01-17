import {
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
import { Log, User, UserStock } from '../constants/interfaces'
import Button from './Button'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmount,
  GetMoneyAmountString,
  ReduceUserStocks,
  SetNewUserStocks,
} from '../functions/functions'
import { useState } from 'react'
import { updateUser } from '../redux/user'
import Toast from 'react-native-toast-message'
import rules from '../constants/rules'
import { updateLog } from '../redux/log'
export const storage = new MMKV()

export default function TransactionBlockModal(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const companies = useSelector((state: RootState) => state.companies)
  const log: Log[] = useSelector((state: RootState) => state.log)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  const [request, setRequest] = useState<boolean>(false)
  const [page, setPage] = useState<string>('Info')
  const [amounOfStocks, setAmounOfStocks] = useState<string>('')
  const [amountOfStocksToBuyError, setAmountOfStocksToBuyError] =
    useState<boolean>(false)

  const dispatch = useDispatch()

  function GetCompanyPrice() {
    const currentCompany: any = companies.find(
      (c: any) => c.name === props.transactionStockName
    )
    return currentCompany.history[currentCompany.history.length - 1].price
  }

  function GetCompanyStocksAmountLeft() {
    const currentCompany: any = companies.find(
      (c: any) => c.name === props.transactionStockName
    )
    const userStockAmount = GetUserStocksAmount().stockAmount

    return (
      rules.stock.companySizeStocksAmount[currentCompany.stat.companySize - 1] -
      userStockAmount
    )
  }

  function GetAmountOfStocksCanBuy() {
    const amounOfStocks = GetCompanyStocksAmountLeft()
    const amountOfStocksCanBuy = Math.floor(user.cash / GetCompanyPrice())
    return amountOfStocksCanBuy > amounOfStocks
      ? amounOfStocks
      : amountOfStocksCanBuy
  }

  function GetUserStocksAmount() {
    const stockAmount =
      user.stocks.find((s: any) => s.name === props.transactionStockName)
        ?.amount || 0
    const averagePrice =
      user.stocks.find((s: any) => s.name === props.transactionStockName)
        ?.averagePrice || 0
    return { stockAmount: stockAmount, averagePrice: averagePrice }
  }

  const transactionUserData = [
    {
      title: 'Your stocks amount',
      icon: 'briefcase-outline',
      value: GetUserStocksAmount()
        .stockAmount.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Your stocks worth',
      icon: 'cash-outline',
      value: `$ ${GetMoneyAmountString(GetUserStocksAmount().averagePrice)}`,
    },
    {
      title: 'Current stocks price',
      icon: 'receipt-outline',
      value: `$ ${GetMoneyAmountString(GetCompanyPrice())}`,
    },
  ]

  function BuyStocks() {
    const price = GetCompanyPrice()
    const amount = +amounOfStocks
    const value = +(price * +amounOfStocks).toFixed(2)
    const newUserData = {
      ...user,
      cash: +(user.cash - value).toFixed(2),
      stocks: SetNewUserStocks(
        user.stocks,
        amount,
        price,
        props.transactionStockName
      ),
    }
    dispatch(updateUser(newUserData))
    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.stockBuy,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `A share of ${amount} stocks of ${props.transactionStockName} was purchased`,
      },
      position: rules.toast.position,
    })
    props.onClose()
  }

  function SellStocks() {
    const value = +(GetCompanyPrice() * +amounOfStocks).toFixed(2)
    const amount = +amounOfStocks
    const newUserData = {
      ...user,
      cash: +(user.cash + value).toFixed(2),
      stocks: ReduceUserStocks(user.stocks, amount, props.transactionStockName),
    }
    dispatch(updateUser(newUserData))
    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.stockSell,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `A share of ${amount} stocks of ${props.transactionStockName} was sold`,
      },
      position: rules.toast.position,
    })
    props.onClose()
  }

  function RenderUserTransactionItem({ item }: any) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
          width: '100%',
          paddingHorizontal: 20,
          opacity: theme === item.state ? 1 : 0.5,
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
      <FlatList
        style={{ height: 180, width: '100%' }}
        data={transactionUserData}
        renderItem={RenderUserTransactionItem}
      />
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
          title="Buy"
          action={() => {
            setPage('Buy')
          }}
          type="success"
          disable={
            user.cash < GetCompanyPrice() || GetCompanyStocksAmountLeft() === 0
          }
          style={{ width: '48%' }}
        />
        <Button
          title="Sell"
          action={() => {
            setPage('Sell')
          }}
          type="error"
          disable={GetUserStocksAmount().stockAmount === 0}
          style={{ width: '48%' }}
        />
      </View>
      {user.cash < GetCompanyPrice() ? (
        <Text
          style={{
            fontSize: 12,
            color: colors[themeColor].errorText,
          }}
        >
          You don't have enough cash to make a purchase
        </Text>
      ) : (
        <></>
      )}
    </>
  )

  const buyBlock = (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          width: '100%',
          paddingHorizontal: 20,
          // opacity: theme === item.state ? 1 : 0.5,
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
            Purchase price
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors[themeColor].text,
            }}
          >
            $ {GetMoneyAmountString(GetCompanyPrice() * +amounOfStocks)}
          </Text>
        </View>
      </View>
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
            setAmounOfStocks(GetAmountOfStocksCanBuy().toString())
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
          can buy {GetAmountOfStocksCanBuy()}
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
        value={amounOfStocks}
        keyboardType="number-pad"
        placeholderTextColor={colors[themeColor].disable}
        onChangeText={(value: string) => {
          const formatedValue = value.replace(/[^0-9]/g, '')
          if (formatedValue === '0') {
            return false
          } else if (+formatedValue > GetAmountOfStocksCanBuy()) {
            setAmountOfStocksToBuyError(true)
            return false
          } else {
            setAmounOfStocks(formatedValue)
            setAmountOfStocksToBuyError(false)
          }
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: colors[themeColor].errorText,
          opacity:
            amountOfStocksToBuyError ||
            +amounOfStocks > GetAmountOfStocksCanBuy()
              ? 1
              : 0,
          marginVertical: 5,
        }}
      >
        Can't buy more then {GetAmountOfStocksCanBuy()}
      </Text>
      <Button
        title="Buy"
        type="info"
        action={() => {
          setRequest(true)
          BuyStocks()
        }}
        disable={
          !amounOfStocks ||
          +amounOfStocks > GetAmountOfStocksCanBuy() ||
          request
        }
      />
    </>
  )

  const sellBlock = (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          width: '100%',
          paddingHorizontal: 20,
          // opacity: theme === item.state ? 1 : 0.5,
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
            Sell price
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors[themeColor].text,
            }}
          >
            $ {GetMoneyAmountString(GetCompanyPrice() * +amounOfStocks)}
          </Text>
        </View>
      </View>
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
            setAmounOfStocks(GetUserStocksAmount().stockAmount.toString())
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
          can sell {GetUserStocksAmount().stockAmount}
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
        value={amounOfStocks}
        keyboardType="number-pad"
        placeholderTextColor={colors[themeColor].disable}
        onChangeText={(value: string) => {
          const formatedValue = value.replace(/[^0-9]/g, '')
          if (formatedValue === '0') {
            return false
          } else if (+formatedValue > GetUserStocksAmount().stockAmount) {
            setAmountOfStocksToBuyError(true)
            return false
          } else {
            setAmounOfStocks(formatedValue)
            setAmountOfStocksToBuyError(false)
          }
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: colors[themeColor].errorText,
          opacity:
            amountOfStocksToBuyError ||
            +amounOfStocks > GetUserStocksAmount().stockAmount
              ? 1
              : 0,
          marginVertical: 5,
        }}
      >
        Can't sell more then {GetUserStocksAmount().stockAmount}
      </Text>
      <Button
        title="Sell"
        type="info"
        action={() => {
          setRequest(true)
          SellStocks()
        }}
        disable={
          !amounOfStocks ||
          +amounOfStocks > GetUserStocksAmount().stockAmount ||
          request
        }
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
            setAmounOfStocks('')
            setAmountOfStocksToBuyError(false)
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            color={colors[themeColor].text}
            size={24}
          />
        </TouchableOpacity>

        <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
          {page === 'Buy' ? 'Buy' : page === 'Sell' ? 'Sell' : 'Transaction'}
        </Text>
        <View style={{ width: 60 }} />
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
        {page === 'Buy' ? buyBlock : page === 'Sell' ? sellBlock : infoBlock}
      </View>
    </>
  )
}
