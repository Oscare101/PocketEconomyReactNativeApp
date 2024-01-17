import { Dimensions, StyleSheet, View, useColorScheme } from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { Log, User } from '../../constants/interfaces'
import { MMKV } from 'react-native-mmkv'
import StoreIcon from '../../components/StoreIcon'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function StoreScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const dispatch = useDispatch()

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor, paddingBottom: 20 },
      ]}
    >
      <HeaderDrawer title="Store" />
      <StoreIcon width={width} theme={themeColor} type={'island'} />
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
