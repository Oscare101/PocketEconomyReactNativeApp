import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { updateLog } from '../../redux/log'
import { Log, User } from '../../constants/interfaces'
import { useState } from 'react'
import { updateUser } from '../../redux/user'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmount,
} from '../../functions/functions'
import rules from '../../constants/rules'
import Toast from 'react-native-toast-message'
import Button from '../../components/Button'
import { MMKV } from 'react-native-mmkv'
import { FontAwesome } from '@expo/vector-icons'

export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function BusinessesScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

  const dispatch = useDispatch()

  const data = [
    {
      title: 'Bank',
      screen: 'BankScreen',
      icon: (
        <FontAwesome
          name="bank"
          size={width * interfaceSize * 0.08}
          color={colors[themeColor].text}
        />
      ),
    },
  ]

  function RenderBusinessItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {}}
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        {item.icon}
        <Text
          style={{
            color: colors[themeColor].text,
            fontSize: width * interfaceSize * 0.04,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor, paddingBottom: 20 },
      ]}
    >
      <HeaderDrawer title="Businesses" />
      <FlatList
        style={{ width: '100%', marginTop: width * 0.02 }}
        numColumns={2}
        data={data}
        renderItem={RenderBusinessItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: width * 0.48,
    aspectRatio: 2,
    padding: width * 0.03,
    borderRadius: width * 0.03,
    margin: width * 0.01,
    alignSelf: 'center',
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartTitle: {
    fontSize: width * 0.05,
  },
  dateTime: { fontSize: width * 0.035 },
  cardComment: { fontSize: width * 0.05, fontWeight: '300' },
  input: {
    fontSize: width * 0.07,
    padding: 0,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
})
