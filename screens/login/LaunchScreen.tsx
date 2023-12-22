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
  GetElapsedHistory,
  UpdateCompaniesData,
  countElapsedPeriods,
} from '../../functions/functions'

const width = Dimensions.get('screen').width

export default function LaunchScreen({ navigation }: any) {
  const dispatch = useDispatch()

  async function GetData() {
    const theme: any = await AsyncStorage.getItem('theme')

    if (theme) {
      dispatch(updateTheme(theme))
    } else {
      dispatch(updateTheme('system'))
      await AsyncStorage.setItem('theme', 'system')
    }

    const user: any = await AsyncStorage.getItem('user')
    if (user) {
      dispatch(updateUser(JSON.parse(user)))
    } else {
      const defaultUser: User = {
        name: 'Oscare',
        loginDate: new Date().toISOString().split('T')[0],
        capital: 1000,
        stocks: [],
        history: [],
      }
      dispatch(updateUser(defaultUser))
      await AsyncStorage.setItem('user', JSON.stringify(defaultUser))
    }

    const companies: any = await AsyncStorage.getItem('companies')

    if (!!companies && JSON.parse(companies).length) {
      const updatedCompanies = UpdateCompaniesData(JSON.parse(companies))
      dispatch(updateCompanies(updatedCompanies))
    } else {
      const defaultCompanies: Company[] = [
        {
          name: 'ABCTech',
          industry: 'information technology',
          stat: {
            volatility: 2,
            dividendsConsistency: 5,
            companySize: 5,
            dividendsRate: 4.0,
          },
          description:
            'ABCTech is an innovative leader in the field of information technology, providing advanced solutions for the dynamic digital world',
          history: [
            {
              date: new Date().toISOString().split('T')[0],
              time: `${new Date().getHours()}:${new Date().getMinutes()}:00`,
              price: 159,
            },
          ],
          logo: '',
        },
        {
          name: 'Apollo',
          industry: 'power & utilities',
          stat: {
            volatility: 2,
            dividendsConsistency: 3,
            companySize: 5,
            dividendsRate: 4.0,
          },
          description:
            'Apollo is a company transforming the energy industry through high-tech and environmentally friendly solutions',
          history: [
            {
              date: new Date().toISOString().split('T')[0],
              time: `${new Date().getHours()}:${new Date().getMinutes()}:00`,
              price: 68.5,
            },
          ],
          logo: '',
        },
      ]
      dispatch(updateCompanies(defaultCompanies))
      await AsyncStorage.setItem('companies', JSON.stringify(defaultCompanies))
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'DrawerNavigation' }],
    })
  }

  useEffect(() => {
    GetData()
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
