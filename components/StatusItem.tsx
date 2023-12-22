import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

interface StatusItemProps {
  title: string
  type: 'success' | 'warning' | 'error' | 'info'
  icon: keyof typeof Ionicons.glyphMap | ''
}

export default function StatusItem(props: StatusItemProps) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  return (
    <View
      style={[
        styles.button,
        { backgroundColor: colors[themeColor][`${props.type}Bg`] },
      ]}
    >
      {props.icon ? (
        <Ionicons
          name={props.icon}
          size={width * 0.03}
          color={colors[themeColor][`${props.type}Text`]}
        />
      ) : (
        <></>
      )}
      <Text
        style={[
          styles.buttonTitle,
          {
            color: colors[themeColor][`${props.type}Text`],
            marginLeft: props.icon ? 5 : 0,
          },
        ]}
      >
        {props.title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
  },
  buttonTitle: { fontSize: width * 0.04, fontWeight: '400' },
})
