import {
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { Log, User, UserDeposit } from '../../constants/interfaces'
import { RootState } from '../../redux'
import { useMemo, useRef, useState } from 'react'
import {
  GetDepositInterestReturn,
  GetDepositMatureDateTime,
} from '../../functions/depositFunctions'
import { GetMoneyAmount } from '../../functions/functions'
import Button from '../../components/Button'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { updateUser } from '../../redux/user'
import { MMKV } from 'react-native-mmkv'
import rules from '../../constants/rules'

export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function LogScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const log: Log[] = useSelector((state: RootState) => state.log)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const dispatch = useDispatch()

  function RenderLogItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('LogInfoScreen', { data: item.data })
        }
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <View style={styles.rowBetween}>
          <Text
            style={[styles.dateTime, { color: colors[themeColor].comment }]}
          >
            {item.date}
          </Text>
          <Text
            style={[styles.dateTime, { color: colors[themeColor].comment }]}
          >
            {item.time}
          </Text>
        </View>

        <Text style={[styles.cartTitle, { color: colors[themeColor].text }]}>
          {item.title}
        </Text>
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
      <HeaderDrawer title="Logs" onAction={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colors[themeColor].bgColor },
          ]}
        >
          <FlatList
            style={{ width: '100%', marginBottom: 10 }}
            data={[...log].reverse()}
            renderItem={RenderLogItem}
            scrollEnabled={false}
          />
        </View>
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
  },
  card: {
    width: '92%',
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginTop: width * 0.03,
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
