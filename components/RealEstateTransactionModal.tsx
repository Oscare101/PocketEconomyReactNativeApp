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
import { MMKV } from 'react-native-mmkv'
import { Log, User, UserRealEstate } from '../constants/interfaces'
import Button from './Button'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmount,
} from '../functions/functions'
import { useState } from 'react'
import { updateUser } from '../redux/user'
import Toast from 'react-native-toast-message'
import rules from '../constants/rules'
import {
  GetPropertyCost,
  GetPropertyIncome,
} from '../functions/realEstateFunctions'
import { updateLog } from '../redux/log'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function RealEstateTransactionModal(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)

  const themeColor: any = theme === 'system' ? systemTheme : theme
  const [page, setPage] = useState<string>('Info')
  const [amounOfStocks, setAmounOfStocks] = useState<string>('')
  const [request, setRequest] = useState<boolean>(false)

  const dispatch = useDispatch()

  const buyData = [
    {
      title: 'Property cost',
      icon: 'briefcase-outline',
      value: `$ ${
        GetMoneyAmount(GetPropertyCost(user.loginDate, props.region)).value
      }.${
        GetMoneyAmount(GetPropertyCost(user.loginDate, props.region)).decimal
      }${GetMoneyAmount(GetPropertyCost(user.loginDate, props.region)).title}`,
    },
    {
      title: 'Daily income per day',
      icon: 'cash-outline',
      value: `$ ${
        GetMoneyAmount(GetPropertyIncome(user.loginDate, props.region)).value
      }.${
        GetMoneyAmount(GetPropertyIncome(user.loginDate, props.region)).decimal
      }${
        GetMoneyAmount(GetPropertyIncome(user.loginDate, props.region)).title
      }`,
    },
  ]

  const sellData = [
    {
      title: `Property sell cost (${rules.realEstate.sellValue * 100} %)`,
      icon: 'briefcase-outline',
      value: `$ ${
        GetMoneyAmount(
          GetPropertyCost(user.loginDate, props.region) *
            rules.realEstate.sellValue
        ).value
      }.${
        GetMoneyAmount(
          GetPropertyCost(user.loginDate, props.region) *
            rules.realEstate.sellValue
        ).decimal
      }${
        GetMoneyAmount(
          GetPropertyCost(user.loginDate, props.region) *
            rules.realEstate.sellValue
        ).title
      }`,
    },
  ]

  function BuyProperty() {
    const cost = GetPropertyCost(user.loginDate, props.region)
    let newUserRealEstate: UserRealEstate[] = user.realEstate
    const foundIndex = newUserRealEstate.findIndex(
      (r: UserRealEstate) => r.region === props.region
    )

    if (foundIndex !== -1) {
      newUserRealEstate = user.realEstate.map((r: UserRealEstate) => {
        if (r.region === props.region) {
          return {
            ...r,
            amount: r.amount + 1,
          }
        } else {
          return r
        }
      })
    } else {
      newUserRealEstate = [
        ...newUserRealEstate,
        { region: props.region, amount: 1 },
      ]
    }
    const newUserData: User = {
      ...user,
      cash: +(user.cash - cost).toFixed(2),
      realEstate: newUserRealEstate,
    }
    dispatch(updateUser(newUserData))

    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.propertyBuy,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `The property was purchased`,
      },
      position: rules.toast.position,
    })
    props.onClose()
  }

  function SellProperty() {
    const value =
      GetPropertyCost(user.loginDate, props.region) * rules.realEstate.sellValue
    const newUserRealEstate = user.realEstate.map((r: UserRealEstate) => {
      if (r.region === props.region) {
        return {
          ...r,
          amount: r.amount - 1,
        }
      } else {
        return r
      }
    })

    const newUserData: User = {
      ...user,
      cash: +(user.cash + value).toFixed(2),
      realEstate: newUserRealEstate,
      realEstateHistory: newUserRealEstate.filter(
        (r: UserRealEstate) => r.amount
      ).length
        ? user.realEstateHistory
        : [],
    }
    dispatch(updateUser(newUserData))
    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.propertySell,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `A property was sold`,
      },
      position: rules.toast.position,
    })
    props.onClose()
  }

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
              fontSize: width * 0.04,
              color: colors[themeColor].text,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: width * 0.04,
              color: colors[themeColor].text,
            }}
          >
            {item.value}
          </Text>
        </View>
      </View>
    )
  }

  const buyBlock = (
    <>
      <FlatList
        style={{ width: '100%' }}
        data={buyData}
        renderItem={RenderItem}
      />
      <Text
        style={{
          fontSize: width * 0.04,
          color: colors[themeColor].errorText,
        }}
      >
        {user.cash < GetPropertyCost(user.loginDate, props.region)
          ? 'Not enough cash'
          : ''}
      </Text>
      <Button
        title="Buy"
        type="success"
        disable={
          user.cash < GetPropertyCost(user.loginDate, props.region) || request
        }
        action={() => {
          setRequest(true)
          BuyProperty()
        }}
      />
    </>
  )

  const sellBlock = (
    <>
      <FlatList
        style={{ width: '100%' }}
        data={sellData}
        renderItem={RenderItem}
      />
      <Text
        style={{
          fontSize: width * 0.04,
          color: colors[themeColor].errorText,
        }}
      >
        {user.cash < GetPropertyCost(user.loginDate, props.region)
          ? 'Not enough cash'
          : ''}
      </Text>
      <Button
        title="Sell"
        type="error"
        disable={request}
        action={() => {
          setRequest(true)
          SellProperty()
        }}
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
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            color={colors[themeColor].text}
            size={24}
          />
        </TouchableOpacity>

        <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
          {props.userProperty ? 'Sell property' : 'Buy  property'}
        </Text>
        <View style={{ width: 60 }} />
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          // height: 180,
          paddingBottom: 15,
        }}
      >
        {props.userProperty ? sellBlock : buyBlock}
      </View>
    </>
  )
}
