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
import StatisticsScreen from '../screens/application/StatisticsScreen'
import CustomBottomTabContent from '../components/CustomBottomTabContent'
import DepositsScreen from '../screens/application/DepositsScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

export default function MainNavigation() {
  function InvestNavigation() {
    return (
      <Tab.Navigator
        tabBar={(props: any) => <CustomBottomTabContent {...props} />}
      >
        <Tab.Screen
          name="InvestScreen"
          component={InvestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="DepositsScreen"
          component={DepositsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    )
  }

  function DrawerNavigation() {
    return (
      <Drawer.Navigator
        initialRouteName="InvestScreen"
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
          name="InvestNavigation"
          component={InvestNavigation}
        />
        <Drawer.Screen
          options={{ headerShown: false }}
          name="StatisticsScreen"
          component={StatisticsScreen}
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
    </Stack.Navigator>
  )

  return <>{navigation}</>
}
