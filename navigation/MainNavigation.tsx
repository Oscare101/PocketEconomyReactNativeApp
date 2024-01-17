import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer'
import LaunchScreen from '../screens/login/LaunchScreen'

import SettingsScreen from '../screens/application/SettingsScreen'
import CustomDrawerContent from '../components/CustomDrawerContent'
import PortfolioScreen from '../screens/application/PortfolioScreen'
import InvestScreen from '../screens/application/InvestScreen'
import StockScreen from '../screens/application/StockScreen'

import DepositsScreen from '../screens/application/DepositsScreen'
import AnalyticsScreen from '../screens/application/AnalyticsScreen'
import DividendsScreen from '../screens/application/DividendsScreen'
import CreateDepositScreen from '../screens/application/CreateDepositScreen'
import EditDepositScreen from '../screens/application/EditDepositScreen'
import RealEstateScreen from '../screens/application/RealEstateScreen'
import LogScreen from '../screens/application/LogScreen'
import LogInfoScreen from '../screens/application/LogInfoScreen'
import NewsScreen from '../screens/application/NewsScreen'
import PromoCodeScreen from '../screens/application/PromoCodeScreen'
import StoreScreen from '../screens/application/StoreScreen'
import BusinessesScreen from '../screens/application/BusinessesScreen'
import BankScreen from '../screens/application/BankScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

export default function MainNavigation() {
  function DrawerNavigation() {
    return (
      <Drawer.Navigator
        initialRouteName="PortfolioScreen"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          options={{ headerShown: false }}
          name="PortfolioScreen"
          component={PortfolioScreen}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="SettingsScreen"
          component={SettingsScreen}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="NewsScreen"
          component={NewsScreen}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="AnalyticsScreen"
          component={AnalyticsScreen}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="RealEstateScreen"
          component={RealEstateScreen}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="InvestScreen"
          component={InvestScreen}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="DepositsScreen"
          component={DepositsScreen}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="BusinessesScreen"
          component={BusinessesScreen}
        />
      </Drawer.Navigator>
    )
  }

  const navigation = (
    <Stack.Navigator initialRouteName="LaunchScreen">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="LaunchScreen"
        component={LaunchScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
        name="DrawerNavigation"
        component={DrawerNavigation}
      />
      {/* other screens then must apear without bottom tab navigation */}
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="StockScreen"
        component={StockScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="DividendsScreen"
        component={DividendsScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="CreateDepositScreen"
        component={CreateDepositScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="EditDepositScreen"
        component={EditDepositScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="LogScreen"
        component={LogScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="LogInfoScreen"
        component={LogInfoScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="PromoCodeScreen"
        component={PromoCodeScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="BankScreen"
        component={BankScreen}
      />
    </Stack.Navigator>
  )

  return <>{navigation}</>
}
