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
import { GetMoneyAmount } from '../functions/functions'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'
import { User } from '../constants/interfaces'

const width = Dimensions.get('screen').width

export default function CustomDrawerContent(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  const screensButtonData = [
    { title: 'Invest', icon: 'bar-chart-outline', screen: 'InvestScreen' },
    {
      title: 'Portfolio',
      icon: 'briefcase-outline',
      screen: 'PortfolioScreen',
    },
    { title: 'Rating', icon: 'people-outline', screen: '' },
    {
      title: 'Statistics',
      icon: 'analytics-outline',
      screen: 'StatisticsScreen',
    },
    { title: 'Settings', icon: 'cog-outline', screen: 'SettingsScreen' },
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
        <View
          style={[
            styles.topBlock,
            { backgroundColor: colors[themeColor].infoBg },
          ]}
        >
          <Text style={[styles.title, { color: colors[themeColor].infoText }]}>
            Pocket Economy
          </Text>
          <View
            style={[
              styles.topBlockCircle,
              {
                backgroundColor: colors[themeColor].infoText,
                borderColor: colors[themeColor].bgColor,
              },
            ]}
          >
            {/* <Ionicons
              name="ios-person-outline"
              size={width * 0.15}
              color={colors[themeColor].text}
            /> */}
            {/* TODO: change this */}
            <Image
              source={{
                uri: 'https://www.jamsadr.com/images/neutrals/person-donald-900x1080.jpg',
              }}
              width={100}
              height={100}
              style={{ resizeMode: 'cover' }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[styles.name, { color: colors[themeColor].text }]}
          >
            Name
          </Text>
        </View>
        {/* <Text style={[styles.money, { color: colors[themeColor].comment }]}>
          $ {GetMoneyAmount(user.capital).value}.
          <Text style={styles.moneyDecimal}>
            {GetMoneyAmount(user.capital).decimal}
          </Text>{' '}
          {GetMoneyAmount(user.capital).title}
        </Text> */}
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
          props.navigation.jumpTo('TestScreen')
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
          Test
        </Text>
      </TouchableOpacity>
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
    fontSize: width * 0.05,
    padding: width * 0.02,
    width: '100%',
    textAlign: 'left',
    // alignSelf: 'flex-start',
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
})
