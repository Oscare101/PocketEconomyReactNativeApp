import 'react-native-gesture-handler'
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native'
import MainNavigation from './navigation/MainNavigation'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { StatusBar, Text, View, useColorScheme } from 'react-native'
import colors from './constants/colors'
import Toast from 'react-native-toast-message'
import { useEffect, useState } from 'react'
import { RootState } from './redux'
import { useDispatch, useSelector } from 'react-redux'
import * as NavigationBar from 'expo-navigation-bar'
import rules from './constants/rules'
import { updateCompanies } from './redux/companies'
import {
  CalculateStock,
  FilterRecentDividendsHistory,
  UpdateCompaniesData,
  countElapsedPeriods,
} from './functions/functions'
import { MMKV } from 'react-native-mmkv'
import { User, UserDeposit } from './constants/interfaces'
import { updateUser } from './redux/user'
import * as Notifications from 'expo-notifications'
import {
  CheckMatureDeposits,
  GetDepositReturn,
} from './functions/depositFunctions'

export const storage = new MMKV()

export default function App() {
  const toastConfig = {
    ToastMessage: ({ props }: any) => (
      <View
        style={{
          width: '92%',
          backgroundColor: colors.black,
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.white,
            textAlign: 'left',
          }}
        >
          {props.title}
        </Text>
      </View>
    ),
  }

  function AppComponent() {
    const systemTheme = useColorScheme()
    const theme = useSelector((state: RootState) => state.theme)
    const companies = useSelector((state: RootState) => state.companies)
    const user = useSelector((state: RootState) => state.user)

    const themeColor: any = theme === 'system' ? systemTheme : theme
    const dispatch = useDispatch()

    useEffect(() => {
      // Забезпечте права для повідомлень
      Notifications.requestPermissionsAsync()

      // Встановлення щоденного повідомлення о 9:00
      const scheduleNotification = async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Check your dividends',
            subtitle: 'Sub',
            body: 'You may have already received dividends',
            color: '#000000',
            badge: 1,
          },
          trigger: {
            hour: 9,
            minute: 0,
            repeats: true,
          },
        })

        // await Notifications.cancelAllScheduledNotificationsAsync()
      }

      scheduleNotification()
    }, [])

    useEffect(() => {
      NavigationBar.setBackgroundColorAsync(colors[themeColor].bgColor)
      NavigationBar.setButtonStyleAsync(
        themeColor === 'dark' ? 'light' : 'dark'
      )
    }, [themeColor])

    function SetUserDividends(dividends: any[]) {
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
        position: 'bottom',
      })
    }

    function RemoveMatureDeposits() {
      const matureDeposits = CheckMatureDeposits(user.deposits)
      const matureDepositsSum = matureDeposits.reduce(
        (a: number, b: UserDeposit) =>
          a + GetDepositReturn(b.value, b.durationHours, b.interest),
        0
      )
      const newDepositsArr = user.deposits.filter(
        (d: UserDeposit) => !matureDeposits.find(d.name)
      )
      const newUserData: User = {
        ...user,
        cash: +(user.cash + matureDepositsSum).toFixed(2),
        deposits: newDepositsArr,
      }
      console.log(newUserData) // TODO check deposit return

      // dispatch(updateUser(newUserData))
      // storage.set('user', JSON.stringify(newUserData))
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: `The deposit has been repaid`,
        },
        position: 'bottom',
      })
    }

    function SetNewData() {
      const newCompaniesData = UpdateCompaniesData(user.stocks, companies)
      const dividends = newCompaniesData.dividends
      if (dividends.length) {
        SetUserDividends(dividends)
      }
      dispatch(updateCompanies(newCompaniesData.data))
      storage.set('companies', JSON.stringify(newCompaniesData.data))
    }

    const [lastUpdate, setLastUpdate] = useState<number>(0)

    useEffect(() => {
      let timer = setTimeout(() => {
        if (
          countElapsedPeriods(
            `${companies[0].history[companies[0].history.length - 1].date}T${
              companies[0].history[companies[0].history.length - 1].time
            }`
          )
        ) {
          SetNewData()
        }

        if (CheckMatureDeposits(user.deposits).length) {
          RemoveMatureDeposits()
        }

        setLastUpdate(new Date().getTime())
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }, [lastUpdate, companies])

    return (
      <>
        <StatusBar
          barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors[themeColor].bgColor}
        />
      </>
    )
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppComponent />
        <MainNavigation />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </Provider>
  )
}
