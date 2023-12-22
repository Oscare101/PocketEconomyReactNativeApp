import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import DrawerButton from './DrawerButton'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

interface HeaderDrawerProps {
  title: string
}

export default function HeaderDrawer(props: HeaderDrawerProps) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors[themeColor].bgColor,
          borderColor: colors[themeColor].comment,
        },
      ]}
    >
      <DrawerButton />
      <Text style={[styles.headerTitle, { color: colors[themeColor].text }]}>
        {props.title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: width * 0.07,
    marginRight: '5%',
    fontWeight: '300',
  },
})
