import { useEffect } from 'react'
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import colors from '../../constants/colors'
import { Company, User } from '../../constants/interfaces'
import { updateUser } from '../../redux/user'
import { RootState } from '../../redux'
import HeaderDrawer from '../../components/HeaderDrawer'
import { GetMoneyAmount } from '../../functions/functions'
import { Ionicons } from '@expo/vector-icons'
import { GetDepositMatureDateTime } from '../../functions/depositFunctions'

const width = Dimensions.get('screen').width

const depositsData = [
  {
    name: 'Local deposit',
    minValue: 100,
    maxValue: 100000,
    interest: 5,
    durationHours: 24,
  },
  {
    name: 'Deposit 2.0',
    minValue: 200000,
    maxValue: 10000000,
    interest: 4,
    durationHours: 48,
  },
  {
    name: 'Star deposit',
    minValue: 100000,
    maxValue: 20000000,
    interest: 4,
    durationHours: 24,
  },
  {
    name: 'Go Karpaty',
    minValue: 5000000,
    maxValue: 2000000000,
    interest: 4,
    durationHours: 48,
  },
  {
    name: "Father's deposit",
    minValue: 1000000000,
    maxValue: 50000000000,
    interest: 5,
    durationHours: 72,
  },
]

export default function DepositsScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  function RenderDepositItem({ item }: any) {
    const depositInfo = [
      { title: 'Interest (per 24h)', value: `${item.interest} %` },
      {
        title: 'Duration',
        autoRenewalIcon: item.autoRenewal,
        value: `${item.durationHours} h`,
      },
      {
        title: 'Value',
        value: `$ ${GetMoneyAmount(item.value).value}.${
          GetMoneyAmount(item.value).decimal
        } ${GetMoneyAmount(item.value).title}`,
      },
      {
        title: 'Next payment',
        value: `${
          GetDepositMatureDateTime(
            item.openingDate,
            item.openingTime,
            item.durationHours
          ).date
        } ${
          GetDepositMatureDateTime(
            item.openingDate,
            item.openingTime,
            item.durationHours
          ).time
        }`,
      },
    ]

    function RenderDepositInfo({ item }: any) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 5,
          }}
        >
          <Text
            style={[
              styles.depositName,
              { color: colors[themeColor].comment, fontWeight: '300' },
            ]}
          >
            {item.title}
          </Text>
          <View style={{ flex: 1 }} />
          {item.autoRenewalIcon ? (
            <Ionicons
              name="repeat-outline"
              size={width * 0.04}
              color={colors[themeColor].successText}
            />
          ) : (
            <></>
          )}
          <Text
            style={[
              styles.depositName,
              {
                color: colors[themeColor].text,
                fontWeight: '300',
                marginLeft: 10,
              },
            ]}
          >
            {item.value}
          </Text>
        </View>
      )
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('EditDepositScreen', { deposit: item })
        }}
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={[styles.depositName, { color: colors[themeColor].text }]}
          >
            {item.name}
          </Text>
          <Ionicons
            name="open-outline"
            size={width * 0.05}
            color={colors[themeColor].comment}
          />
        </View>

        {/* <View
          style={[
            styles.card,
            { backgroundColor: colors[themeColor].cardColor, width: '48%' },
          ]}
        >
          <Text
            style={[styles.depositName, { color: colors[themeColor].comment }]}
          >
            {item.interest}
          </Text>
        </View> */}
        <FlatList data={depositInfo} renderItem={RenderDepositInfo} />
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor },
      ]}
    >
      <HeaderDrawer title="Deposits" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('CreateDepositScreen')
          }}
          style={[
            styles.button,
            { backgroundColor: colors[themeColor].cardColor },
          ]}
        >
          <Text
            style={[styles.buttonTitle, { color: colors[themeColor].text }]}
          >
            New Deposit
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors[themeColor].comment }]}>
          Available deposits:
        </Text>
        <FlatList
          scrollEnabled={false}
          style={{ width: '100%' }}
          data={user.deposits}
          renderItem={RenderDepositItem}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors['dark'].bgColor,
  },
  card: {
    width: '92%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'center',
  },
  button: {
    width: '92%',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: width * 0.05,
    width: '92%',
    alignSelf: 'center',
  },
  depositName: {
    fontSize: width * 0.04,
  },
  buttonTitle: { fontSize: width * 0.07 },
})
