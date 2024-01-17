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
import { useSelector } from 'react-redux'
import colors from '../../constants/colors'
import { User } from '../../constants/interfaces'
import { RootState } from '../../redux'
import HeaderDrawer from '../../components/HeaderDrawer'
import { GetMoneyAmountString } from '../../functions/functions'
import { Ionicons } from '@expo/vector-icons'
import { GetDepositMatureDateTime } from '../../functions/depositFunctions'

const width = Dimensions.get('screen').width

export default function DepositsScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

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
        value: `$ ${GetMoneyAmountString(item.value)}`,
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
            style={{
              color: colors[themeColor].comment,
              fontWeight: '300',
              fontSize: width * interfaceSize * 0.04,
            }}
          >
            {item.title}
          </Text>
          <View style={{ flex: 1 }} />
          {item.autoRenewalIcon ? (
            <Ionicons
              name="repeat-outline"
              size={width * interfaceSize * 0.04}
              color={colors[themeColor].successText}
            />
          ) : (
            <></>
          )}
          <Text
            style={{
              color: colors[themeColor].text,
              fontWeight: '300',
              marginLeft: 10,
              fontSize: width * interfaceSize * 0.04,
            }}
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
            style={{
              color: colors[themeColor].text,
              fontSize: width * interfaceSize * 0.04,
            }}
          >
            {item.name}
          </Text>
          <Ionicons
            name="open-outline"
            size={width * interfaceSize * 0.04}
            color={colors[themeColor].comment}
          />
        </View>
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
            styles.card,
            {
              backgroundColor: colors[themeColor].cardColor,
              alignItems: 'center',
            },
          ]}
        >
          <Text
            style={{
              color: colors[themeColor].text,
              fontSize: width * interfaceSize * 0.07,
            }}
          >
            New Deposit
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            {
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.05,
            },
          ]}
        >
          Your deposits:
        </Text>
        {user.deposits.length ? (
          <FlatList
            scrollEnabled={false}
            style={{ width: '100%' }}
            data={user.deposits}
            renderItem={RenderDepositItem}
          />
        ) : (
          <Text
            style={{
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.04,
            }}
          >
            No deposits yet
          </Text>
        )}
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
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginTop: width * 0.03,
    alignSelf: 'center',
  },
  title: {
    width: '92%',
    alignSelf: 'center',
  },
})
