import { DrawerContentScrollView } from '@react-navigation/drawer'
import colors from '../constants/colors'
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { GetMoneyAmount, GetUserStocksCapital } from '../functions/functions'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'
import { User } from '../constants/interfaces'
import { LinearGradient } from 'expo-linear-gradient'

const width = Dimensions.get('screen').width

export default function CustomDrawerContent(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const companies: any = useSelector((state: RootState) => state.companies)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  const screensButtonData = [
    {
      title: 'Portfolio',
      icon: 'briefcase-outline',
      screen: 'PortfolioScreen',
    },
    {
      title: 'Stock market',
      icon: 'bar-chart-outline',
      screen: 'InvestScreen',
    },
    {
      title: 'Analytics',
      icon: 'analytics-outline',
      screen: 'AnalyticsScreen',
    },
    { title: 'Deposit', icon: 'wallet-outline', screen: 'DepositsScreen' },

    { title: 'Real Estate', icon: 'home-outline', screen: 'RealEstateScreen' },
  ]

  function RenderScreenButtonItem({ item }: any) {
    const isCurrenctScreen: boolean =
      props.state.routeNames[props.state.index] === item.screen
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.jumpTo(item.screen)
        }}
        style={styles.screenButton}
      >
        <Ionicons
          name={item.icon}
          size={18}
          color={
            isCurrenctScreen
              ? colors[themeColor].text
              : colors[themeColor].comment
          }
        />
        <Text
          style={{
            color: isCurrenctScreen
              ? colors[themeColor].text
              : colors[themeColor].comment,
            marginLeft: 20,
            fontSize: 18,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <DrawerContentScrollView
      style={{
        flex: 1,
        backgroundColor: colors[themeColor].bgColor,
        padding: 0,
      }}
      contentContainerStyle={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
      }}
      {...props}
    >
      <View style={styles.topContainer}>
        {/* <View
          style={[
            styles.card,
            { backgroundColor: `${colors[themeColor].cardColor}` },
          ]}
        > */}
        <LinearGradient
          // Button Linear Gradient
          colors={
            themeColor === 'dark'
              ? [
                  `${colors[themeColor].infoBg}`,
                  `${colors[themeColor].infoBg}99`,
                ]
              : [
                  `${colors[themeColor].infoBg}99`,
                  `${colors[themeColor].infoBg}`,
                ]
          }
          start={[0, 0]}
          end={[1, 1]}
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <View
              style={{
                width: width * 0.05 * 1.6,
                height: width * 0.05,
                marginRight: 10,
              }}
            >
              <View
                style={{
                  height: '100%',
                  aspectRatio: 1,
                  backgroundColor: colors[themeColor].cardColor,
                  borderRadius: width * 0.05,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
              <View
                style={{
                  height: '100%',
                  aspectRatio: 1,
                  backgroundColor: colors[themeColor].cardColor,
                  borderRadius: width * 0.05,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              />
            </View>
            <Text
              style={[styles.comment, { color: colors[themeColor].comment }]}
            >
              **** 1234
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              style={[styles.comment, { color: colors[themeColor].comment }]}
            >
              06/26
            </Text>
          </View>
          <View style={[styles.rowBetween, { flex: 1 }]}>
            <View style={styles.columnStart}>
              <Text
                style={[
                  styles.comment,
                  { color: colors[themeColor].comment, fontSize: width * 0.05 },
                ]}
              >
                Balance:
              </Text>
              <Text style={[styles.money, { color: colors[themeColor].text }]}>
                $ {GetMoneyAmount(user.cash).value}.
                <Text style={styles.moneyDecimal}>
                  {GetMoneyAmount(user.cash).decimal}
                </Text>
                {GetMoneyAmount(user.cash).title}
              </Text>
            </View>
            <View style={[styles.columnStart, { alignItems: 'flex-end' }]}>
              <View
                style={{
                  width: width * 0.05 * 1.4,
                  height: width * 0.05,
                  borderWidth: 1,
                  borderColor: colors[themeColor].bgColor,
                  backgroundColor: colors[themeColor].warningBg,
                  borderRadius: width * 0.05 * 0.15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: '50%',
                    height: '100%',
                    borderRightWidth: 1,
                    borderLeftWidth: 1,
                    borderColor: colors[themeColor].bgColor,
                    backgroundColor: colors[themeColor].warningBg,
                    zIndex: 2,
                  }}
                />
                <View
                  style={{
                    width: '100%',
                    height: '33%',
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: colors[themeColor].bgColor,
                    backgroundColor: colors[themeColor].warningBg,
                    position: 'absolute',
                    zIndex: 1,
                  }}
                />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* </View> */}

        <FlatList
          scrollEnabled={false}
          style={{ width: '100%', marginTop: 50 }}
          data={screensButtonData}
          renderItem={RenderScreenButtonItem}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '92%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
                alignSelf: 'center',
              }}
            />
          )}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.jumpTo('SettingsScreen')
        }}
        style={[
          styles.navigationButton,
          { backgroundColor: colors[themeColor].cardColor },
        ]}
      >
        <Text
          style={[
            styles.navigationButtonTitle,
            { color: colors[themeColor].text },
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  navigationButton: {
    width: '92%',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  navigationButtonTitle: {
    fontSize: width * 0.05,
  },
  topBlock: {
    width: '100%',
    aspectRatio: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: width * 0.07,
    width: '100%',
    textAlign: 'center',
    fontWeight: '300',
  },
  topBlockCircle: {
    width: '35%',
    aspectRatio: 1,
    borderRadius: width,
    position: 'absolute',
    right: '5%',
    bottom: '-35%',
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  name: {
    fontSize: width * 0.04,
    padding: width * 0.02,
    width: '60%',
  },
  money: {
    fontSize: width * 0.06,
    // padding: width * 0.02,
    width: '100%',
    textAlign: 'left',
  },
  moneyDecimal: { fontSize: width * 0.04, fontWeight: '400' },
  topContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    width: '100%',
  },
  screenButton: {
    width: '92%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  card: {
    width: '92%',
    aspectRatio: 2,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    alignSelf: 'center',
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnStart: {
    flexDirection: 'column',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  comment: {
    fontSize: width * 0.04,
  },
})
