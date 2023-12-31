import { useEffect } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { updateTheme } from '../../redux/theme'
import colors from '../../constants/colors'
import { Log, User } from '../../constants/interfaces'
import { updateUser } from '../../redux/user'
import { updateCompanies } from '../../redux/companies'
import {
  CreateDefaultHistory,
  FilterRecentDividendsHistory,
  GetCurrentDate,
  GetCurrentTime,
  UpdateCompaniesData,
} from '../../functions/functions'
import defaultData from '../../defaultData.json'
import { MMKV } from 'react-native-mmkv'
import rules from '../../constants/rules'
import { updateLog } from '../../redux/log'
import { RootState } from '../../redux'
import Toast from 'react-native-toast-message'
import { updateInterfaceSize } from '../../redux/interfaceSize'

export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function LaunchScreen({ navigation }: any) {
  const dispatch = useDispatch()

  function SetUserDividends(dividends: any[], user: User, log: Log[]) {
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
    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.dividends,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )
    storage.set('user', JSON.stringify(newUserData))
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `You have received your stock dividend`,
      },
      position: rules.toast.position,
    })
  }

  function GetStorage() {
    const interfaceSize: any = storage.getNumber('interfaceSize')
    if (interfaceSize) {
      dispatch(updateInterfaceSize(interfaceSize))
    } else {
      storage.set('interfaceSize', 1)
    }

    const log: any = storage.getString('log')
    if (log && JSON.parse(log).length) {
      dispatch(updateLog(JSON.parse(log)))
    } else {
    }

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
      if (dividends.length) {
        SetUserDividends(dividends, JSON.parse(user), JSON.parse(log))
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
