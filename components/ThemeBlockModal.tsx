import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector, useDispatch } from 'react-redux'

import { Ionicons } from '@expo/vector-icons'
import { updateTheme } from '../redux/theme'
import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()
const themeButtonsData = [
  {
    state: 'system',
    title: 'System',
    description: "Use your device's theme",
    icon: 'phone-portrait-outline',
  },
  {
    state: 'light',
    title: 'Light',
    description: 'Always use light theme',
    icon: 'sunny-outline',
  },
  {
    state: 'dark',
    title: 'Dark',
    description: 'Always use dark theme',
    icon: 'moon-outline',
  },
]

export default function ThemeBlockModal() {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const dispatch = useDispatch()

  function RenderThemeButtonItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          width: '92%',
          paddingHorizontal: 20,
          opacity: theme === item.state ? 1 : 0.5,
          alignSelf: 'center',
        }}
        onPress={() => {
          dispatch(updateTheme(item.state))
          storage.set('theme', item.state)
        }}
      >
        <Ionicons name={item.icon} size={24} color={colors[themeColor].text} />
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: colors[themeColor].text,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: colors[themeColor].comment,
            }}
          >
            {item.description}
          </Text>
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
          Change Theme
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
          style={{ height: 180 }}
          data={themeButtonsData}
          renderItem={RenderThemeButtonItem}
        />
      </View>
    </>
  )
}
