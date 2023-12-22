import { TouchableOpacity, View, useColorScheme } from 'react-native'
import colors from '../constants/colors'
import { useNavigation } from '@react-navigation/native'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

export default function DrawerButton(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const navigation: any = useNavigation()

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        aspectRatio: 1.15,
        padding: 22,
      }}
      activeOpacity={0.8}
      onPress={() => navigation.openDrawer()}
    >
      {[...Array(3)].map((_: any, index: number) => (
        <View
          key={index}
          style={{
            width: '100%',
            height: '5%',
            backgroundColor: colors[themeColor].text,
            borderRadius: 10,
          }}
        />
      ))}
    </TouchableOpacity>
  )
}
