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
  UpdateCompaniesData,
  countElapsedPeriods,
} from './functions/functions'
import { MMKV } from 'react-native-mmkv'
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
          marginBottom: 40,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.White,
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

    const themeColor: any = theme === 'system' ? systemTheme : theme
    const dispatch = useDispatch()

    useEffect(() => {
      NavigationBar.setBackgroundColorAsync(colors[themeColor].bgColor)
      NavigationBar.setButtonStyleAsync(
        themeColor === 'dark' ? 'light' : 'dark'
      )
    }, [themeColor])

    function SetNewData() {
      const newCompaniesData = UpdateCompaniesData(companies).slice()

      dispatch(updateCompanies(newCompaniesData))
      storage.set('companies', JSON.stringify(newCompaniesData))
    }

    const [lastUpdate, setLastUpdate] = useState<number>(0)

    useEffect(() => {
      let timer = setTimeout(() => {
        // if (
        //   companies?.length &&
        //   new Date().getSeconds() === 0 &&
        //   // new Date().getMinutes() % 5 === 0 &&
        //   companies[0].history[companies[0].history.length - 1].time.split(
        //     ':'
        //   )[1] !== new Date().getMinutes().toString().padStart(2, '0')
        // ) {
        if (
          countElapsedPeriods(
            `${companies[0].history[companies[0].history.length - 1].date}T${
              companies[0].history[companies[0].history.length - 1].time
            }`
          )
        ) {
          SetNewData()
        }
        // console.log(companies[0].history)

        setLastUpdate(new Date().getTime())
      }, 1000) //TODO check

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
