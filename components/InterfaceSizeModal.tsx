import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector, useDispatch } from 'react-redux'
import { MMKV } from 'react-native-mmkv'
import StatusItem from './StatusItem'
import { updateInterfaceSize } from '../redux/interfaceSize'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

const sizeButtonsData = [
  { title: 'PrimePulse Consumer Goods', value: 1.22, size: 0.8 },
  { title: 'PrimePulse Consumer Goods', value: 1.22, size: 0.9 },
  { title: 'PrimePulse Consumer Goods', value: 1.22, size: 1 },
]

export default function InterfaceSizeModal() {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)
  const dispatch = useDispatch()

  function RenderSizeButtonItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '92%',
          alignSelf: 'center',
          height: 50 * item.size,
          marginVertical: 5,
          backgroundColor: colors[themeColor].cardColor,
          borderRadius: width * 0.03,
          paddingHorizontal: '4%',
        }}
        activeOpacity={0.8}
        onPress={() => {
          dispatch(updateInterfaceSize(item.size))
          storage.set('interfaceSize', item.size)
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            fontSize: width * 0.05 * item.size,
            color:
              item.size === interfaceSize
                ? colors[themeColor].text
                : colors[themeColor].comment,
          }}
        >
          {item.title}
        </Text>
        <View style={{ transform: [{ scale: item.size }] }}>
          <StatusItem
            title={item.value}
            type="success"
            icon=""
            doNotResize={true}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          borderBottomWidth: 1,
          borderBlockColor: colors[themeColor].comment,
          height: 60,
          backgroundColor: colors[themeColor].cardColor,
        }}
      >
        <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
          Interface size
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: 180,
        }}
      >
        <FlatList
          style={{ height: 180, width: '100%', marginVertical: 7 }}
          data={sizeButtonsData}
          renderItem={RenderSizeButtonItem}
        />
      </View>
    </>
  )
}
