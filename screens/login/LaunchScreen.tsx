import { useEffect } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { updateTheme } from '../../redux/theme'
import colors from '../../constants/colors'
import * as NavigationBar from 'expo-navigation-bar'
import Button from '../../components/Button'
import { Company, User } from '../../constants/interfaces'
import { updateUser } from '../../redux/user'
import { updateCompanies } from '../../redux/companies'
import {
  AddSecondsToDateTime,
  CalculateStock,
  CreateDefaultHistory,
  GetElapsedHistory,
  UpdateCompaniesData,
  countElapsedPeriods,
} from '../../functions/functions'
import defaultData from '../../defaultData.json'
import { MMKV } from 'react-native-mmkv'
import rules from '../../constants/rules'
export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function LaunchScreen({ navigation }: any) {
  const dispatch = useDispatch()

  function GetStorage() {
    const theme: any = storage.getString('theme')

    if (theme) {
      dispatch(updateTheme(theme))
    } else {
      dispatch(updateTheme('system'))
      storage.set('theme', 'system')
    }

    const user: any = storage.getString('user')

    if (!!user && JSON.parse(user).name) {
      dispatch(updateUser(JSON.parse(user)))
    } else {
      const defaultUser: User = {
        name: 'Oscare',
        loginDate: new Date().toISOString().split('T')[0],
        cash: rules.user.startCash,
        stocks: [],
        history: [],
      }
      dispatch(updateUser(defaultUser))
      storage.set('user', JSON.stringify(defaultUser))
    }

    const companies: any = storage.getString('companies')
    //!!companies && JSON.parse(companies).length
    if (!!companies && JSON.parse(companies).length) {
      const updatedCompanies = UpdateCompaniesData(JSON.parse(companies))
      dispatch(updateCompanies(updatedCompanies))
    } else {
      const defaultCompanies: Company[] = UpdateCompaniesData(
        CreateDefaultHistory(Object.values(defaultData))
      )
      dispatch(updateCompanies(defaultCompanies))
      storage.set('companies', JSON.stringify(defaultCompanies))
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
