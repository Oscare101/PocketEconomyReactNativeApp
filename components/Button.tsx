import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

interface ButtonProps {
  title: string
  type: 'success' | 'warning' | 'error' | 'info'
  disable: boolean
  action: any
  style?: any
}

export default function Button(props: ButtonProps) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: props.disable
            ? colors[themeColor].cardColor
            : colors[themeColor][`${props.type}Bg`],
        },
        props.style,
      ]}
      disabled={props.disable}
      activeOpacity={0.8}
      onPress={props.action}
    >
      <Text
        style={[
          styles.buttonTitle,
          {
            color: props.disable
              ? colors[themeColor].disable
              : colors[themeColor][`${props.type}Text`],
          },
        ]}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '92%',
    height: width * 0.15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: { fontSize: width * 0.07, fontWeight: '400' },
})
