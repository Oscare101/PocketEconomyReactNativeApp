import 'react-native-gesture-handler'
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native'
import MainNavigation from './navigation/MainNavigation'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Dimensions, StatusBar, Text, View, useColorScheme } from 'react-native'
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
  GetCurrentDate,
  GetCurrentTime,
  UpdateCompaniesData,
  countElapsedPeriods,
} from './functions/functions'
import { MMKV } from 'react-native-mmkv'
import {
  Bank,
  Log,
  User,
  UserDeposit,
  UserRealEstate,
} from './constants/interfaces'
import { updateUser } from './redux/user'
import {
  CheckMatureDeposits,
  GetDepositInterestReturn,
  GetDepositsRenewalLeft,
  GetDepositsReturnAmount,
} from './functions/depositFunctions'
import {
  GetNewUserRealEstateHistory,
  GetPropertyCost,
  IsRealEstatePaymentTime,
} from './functions/realEstateFunctions'
import { updateLog } from './redux/log'
import {
  CountElapsedDays,
  CreditInterestedClient,
  DepositInterestedClient,
  GenerateCash,
  GenerateIncome,
  GetCreditClient,
  GetDepositClient,
  GetUserIncreaseKoef,
} from './functions/bankFunctions'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function App() {
  const toastConfig = {
    ToastMessage: ({ props }: any) => (
      <View
        style={{
          width: '92%',
          backgroundColor: colors.black,
          padding: width * 0.04,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: width * 0.015,
        }}
      >
        <Text
          style={{
            fontSize: width * 0.05,
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
    const user: User = useSelector((state: RootState) => state.user)
    const log: Log[] = useSelector((state: RootState) => state.log)

    const themeColor: any = theme === 'system' ? systemTheme : theme
    const dispatch = useDispatch()

    useEffect(() => {
      if (user.name) {
        storage.set('user', JSON.stringify(user))
      }
    }, [user])

    useEffect(() => {
      if (log.length) {
        storage.set('log', JSON.stringify(log))
      }
    }, [log])

    useEffect(() => {
      NavigationBar.setBackgroundColorAsync(colors[themeColor].bgColor)
      NavigationBar.setButtonStyleAsync(
        themeColor === 'dark' ? 'light' : 'dark'
      )
    }, [themeColor])

    function SetUserDividends(dividends: any[]) {
      // console.log('SetUserDividends()', dividends)

      const value = dividends.reduce((a: any, b: any) => a + b.value, 0)
      // console.log('value', value)

      const lastDividends = user.dividendsHistory || []
      const newUserData: User = {
        ...user,
        cash: +(user.cash + value).toFixed(2),
        dividendsHistory: FilterRecentDividendsHistory([
          ...lastDividends,
          ...dividends,
        ]),
      }
      // console.log('newUserData', newUserData)

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
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: `You have received your stock dividend`,
        },
        position: rules.toast.position,
      })
    }

    function RemoveMatureDeposits() {
      let newUserData: User = user
      while (true) {
        const isMatureDeposits = CheckMatureDeposits(
          newUserData.deposits
        ).length

        const matureDeposits = CheckMatureDeposits(newUserData.deposits)
        const matureDepositsSum = GetDepositsReturnAmount(matureDeposits)

        const matureDepositsWithRenewal = GetDepositsRenewalLeft(
          newUserData.deposits,
          matureDeposits
        )

        newUserData = {
          ...newUserData,
          cash: +(newUserData.cash + matureDepositsSum).toFixed(2),
          deposits: matureDepositsWithRenewal,
        }

        if (isMatureDeposits === 0) {
          dispatch(updateUser(newUserData))
          dispatch(
            updateLog([
              ...log,
              {
                ...rules.log.deposit,
                date: GetCurrentDate(),
                time: GetCurrentTime(),
                data: newUserData,
              },
            ])
          )
          // storage.set('user', JSON.stringify(newUserData))
          break
        }
      }
      Toast.show({
        type: 'ToastMessage',
        props: {
          title: `The deposit has been repaid`,
        },
        position: rules.toast.position,
      })
    }

    function SetNewData() {
      const newCompaniesData = UpdateCompaniesData(user.stocks, companies)
      const dividends = [...newCompaniesData.dividends]
      // console.log('dividends', dividends)

      if (dividends.length) {
        SetUserDividends(dividends)
      }
      dispatch(updateCompanies(newCompaniesData.data))
      storage.set('companies', JSON.stringify(newCompaniesData.data))
    }

    function SetRealEstatePayment() {
      if (!user.realEstateHistory.length) {
        const newUserData: User = {
          ...user,
          realEstateHistory: [
            {
              date: GetCurrentDate(),
              time: `${new Date().getHours().toString().padStart(2, '0')}:00`,
              value: 0,
            },
          ],
        }
        dispatch(updateUser(newUserData))
        // storage.set('user', JSON.stringify(newUserData))
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
          cash: +(user.cash + userRealEstatePayment * elapsedPeriods).toFixed(
            2
          ),
          realEstateHistory: newRealEstateHistory,
        }
        dispatch(updateUser(newUserData))
        dispatch(
          updateLog([
            ...log,
            {
              ...rules.log.realEstatePayment,
              date: GetCurrentDate(),
              time: GetCurrentTime(),
              data: newUserData,
            },
          ])
        )
        // storage.set('user', JSON.stringify(newUserData))
      }
    }

    function BankUpdate() {
      const periodsElapsed = CountElapsedDays(
        user.bisuness?.find((b: any) => b.type === 'bank').lastUpdate
      )

      let bankData = user.bisuness?.find((b: any) => b.type === 'bank') as Bank
      // let deposit: number = 0
      // let credit: number = 0
      let usersCash: number = 0
      let usersIncome: number = 0
      let usersAmount: number = bankData.clientsAmount
      let temporaryCash: number = bankData.cash

      for (let i = 0; i < periodsElapsed; i++) {
        usersAmount = Math.ceil(usersAmount * GetUserIncreaseKoef(bankData))

        for (let i = 0; i < +usersAmount; i++) {
          usersCash += GenerateCash()
          usersIncome += GenerateIncome()
          if (CreditInterestedClient(bankData.creditRate)) {
            const credit = GetCreditClient()
            if (credit <= temporaryCash) {
              temporaryCash += credit * (bankData.creditRate / 100)
            }
          } else if (DepositInterestedClient(bankData.depositRate)) {
            const deposit = GetDepositClient()
            temporaryCash -= deposit * (bankData.depositRate / 100)
          }
        }
      }
      // console.log('usersCash', usersCash)
      // console.log('usersIncome', usersIncome)
      // console.log('-deposits', deposit)
      // console.log('+credits', credit)
      // console.log('+commision', usersIncome * (bankData.commission / 100))

      temporaryCash += usersIncome * (bankData.commission / 100)
      // console.log('temporaryCash', temporaryCash)

      const businessesWithoutBank =
        user.bisuness?.filter((b: any) => b.type !== 'bank') || []

      const newBankData: Bank = {
        ...bankData,
        lastUpdate: GetCurrentDate(),
        cash: +temporaryCash.toFixed(2),
        clientsAmount: usersAmount,
      }

      const newUserData: User = {
        ...user,
        bisuness: [...businessesWithoutBank, newBankData],
      }
      dispatch(updateUser(newUserData))
    }

    const [lastUpdate, setLastUpdate] = useState<number>(0)

    function ChechUpdates() {
      if (
        countElapsedPeriods(
          `${companies[0].history[companies[0].history.length - 1].date}T${
            companies[0].history[companies[0].history.length - 1].time
          }`
        )
      ) {
        SetNewData()
      }

      if (
        user.bisuness &&
        user.bisuness.length &&
        CountElapsedDays(
          user.bisuness?.find((b: any) => b.type === 'bank').lastUpdate
        )
      ) {
        BankUpdate()
      }
      if (
        IsRealEstatePaymentTime(user.realEstateHistory) &&
        (user.realEstate.length || user.realEstateHistory.length)
      ) {
        SetRealEstatePayment()
      }

      if (CheckMatureDeposits(user.deposits).length) {
        RemoveMatureDeposits()
      }
      setLastUpdate(new Date().getTime())
    }

    const [initialCheck, setInitialCheck] = useState<boolean>(false)

    useEffect(() => {
      if (companies.length !== 0 && user.name && !initialCheck) {
        // console.log(user.dividendsHistory)

        setInitialCheck(true)
        ChechUpdates()
      }

      let timer = setTimeout(() => {
        ChechUpdates()
      }, 10000)

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
