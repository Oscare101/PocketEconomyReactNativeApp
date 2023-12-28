import { useEffect } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { updateTheme } from '../../redux/theme'
import colors from '../../constants/colors'
import * as NavigationBar from 'expo-navigation-bar'
import Button from '../../components/Button'
import { Company, User, UserRealEstate } from '../../constants/interfaces'
import { updateUser } from '../../redux/user'
import { updateCompanies } from '../../redux/companies'
import {
  AddSecondsToDateTime,
  CalculateStock,
  CreateDefaultHistory,
  FilterRecentDividendsHistory,
  GetElapsedHistory,
  UpdateCompaniesData,
  countElapsedPeriods,
} from '../../functions/functions'
import defaultData from '../../defaultData.json'
import { MMKV } from 'react-native-mmkv'
import rules from '../../constants/rules'
import Toast from 'react-native-toast-message'
import {
  GetNewUserRealEstateHistory,
  GetPropertyCost,
  IsRealEstatePaymentTime,
} from '../../functions/realEstateFunctions'

export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function LaunchScreen({ navigation }: any) {
  const dispatch = useDispatch()

  function SetUserDividends(dividends: any[], user: User) {
    const value = dividends.reduce((a: any, b: any) => a + b.value, 0)
    const lastDividends = user.dividendsHistory || []
    const newUserData: User = {
      ...user,
      cash: +(user.cash + value).toFixed(2),
      dividendsHistory: FilterRecentDividendsHistory([
        ...lastDividends,
        ...dividends,
      ]),
    }

    dispatch(updateUser(newUserData))
    storage.set('user', JSON.stringify(newUserData))
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `You have received your stock dividend`,
      },
      position: rules.toast.position,
    })
  }

  function SetRealEstatePayment(user: User) {
    if (!user.realEstateHistory.length) {
      const newUserData: User = {
        ...user,
        realEstateHistory: [
          {
            date: new Date().toISOString().split('T')[0],
            time: `${new Date().getHours()}:00`,
            value: 0,
          },
        ],
      }
      dispatch(updateUser(newUserData))
      storage.set('user', JSON.stringify(newUserData))
    } else {
      const elapsedPeriods: number = IsRealEstatePaymentTime(
        user.realEstateHistory
      )
      const userRealEstateValue = user.realEstate.reduce(
        (a: number, b: UserRealEstate) =>
          a + b.amount * GetPropertyCost(user.loginDate, b.region),
        0
      )
      const userRealEstatePayment = +(
        (userRealEstateValue * (rules.realEstate.incomePerDayPercent / 100)) /
        rules.realEstate.paymentTimes.length
      ).toFixed(2)

      const newRealEstateHistory = GetNewUserRealEstateHistory(user)

      const newUserData: User = {
        ...user,
        cash: +(user.cash + userRealEstatePayment * elapsedPeriods).toFixed(2),
        realEstateHistory: newRealEstateHistory,
      }
      dispatch(updateUser(newUserData))
      storage.set('user', JSON.stringify(newUserData))
    }
  }

  function GetStorage() {
    const theme: any = storage.getString('theme')

    if (theme) {
      dispatch(updateTheme(theme))
    } else {
      dispatch(updateTheme('system'))
      storage.set('theme', 'system')
    }

    const user: any = storage.getString('user')
    //!!user && JSON.parse(user).name
    if (!!user && JSON.parse(user).name) {
      dispatch(updateUser(JSON.parse(user)))

      if (
        IsRealEstatePaymentTime(JSON.parse(user).realEstateHistory) &&
        (JSON.parse(user).realEstate.length ||
          JSON.parse(user).realEstateHistory.length)
      ) {
        SetRealEstatePayment(JSON.parse(user))
      }
    } else {
      const defaultUser: User = {
        name: 'Oscare',
        loginDate: new Date().toISOString().split('T')[0],
        cash: rules.user.startCash,
        stocks: [],
        history: [],
        deposits: [],
        dividendsHistory: [],
        realEstate: [],
        realEstateHistory: [],
      }
      dispatch(updateUser(defaultUser))
      storage.set('user', JSON.stringify(defaultUser))
    }

    const companies: any = storage.getString('companies')
    //!!companies && JSON.parse(companies).length && JSON.parse(user).name
    if (
      !!companies &&
      JSON.parse(companies).length &&
      !!user &&
      JSON.parse(user).name
    ) {
      const newCompaniesData = UpdateCompaniesData(
        JSON.parse(user).stocks,
        JSON.parse(companies)
      )
      const dividends = newCompaniesData.dividends
      if (dividends.length && JSON.parse(user).name) {
        SetUserDividends(dividends, JSON.parse(user))
      }
      dispatch(updateCompanies(newCompaniesData.data))
      storage.set('companies', JSON.stringify(newCompaniesData.data))
    } else {
      const defaultCompanies = UpdateCompaniesData(
        [],
        CreateDefaultHistory(Object.values(defaultData))
      )
      dispatch(updateCompanies(defaultCompanies.data))
      storage.set('companies', JSON.stringify(defaultCompanies.data))
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'DrawerNavigation' }],
    })
  }

  useEffect(() => {
    GetStorage()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors['dark'].bgColor}
      />
      <Text style={styles.title1}>Pocket</Text>
      <Text style={styles.title2}>Economy</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors['dark'].bgColor,
  },
  title1: {
    fontSize: width * 0.2,
    color: colors['dark'].text,
    fontWeight: '300',
  },
  title2: {
    fontSize: width * 0.14,
    color: colors['dark'].text,
    fontWeight: '200',
  },
})
