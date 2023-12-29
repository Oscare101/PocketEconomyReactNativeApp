import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import DrawerButton from './DrawerButton'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'

const width = Dimensions.get('screen').width

interface HeaderDrawerProps {
  title: string
  onAction?: any
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
      {props.onAction ? (
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: 1.15,
          }}
          activeOpacity={0.8}
          onPress={props.onAction}
        >
          <Ionicons
            name="chevron-back"
            size={width * 0.07}
            color={colors[themeColor].text}
          />
        </TouchableOpacity>
      ) : (
        <DrawerButton />
      )}
      <Text style={[styles.headerTitle, { color: colors[themeColor].text }]}>
        {props.title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: width * 0.18,
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
