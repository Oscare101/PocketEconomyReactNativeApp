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
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

  return (
    <View
      style={[
        styles.button,
        {
          backgroundColor: colors[themeColor][`${props.type}Bg`],
          paddingVertical: width * interfaceSize * 0.01,
          paddingHorizontal: width * interfaceSize * 0.02,
          borderRadius: width * interfaceSize * 0.02,
        },
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
            fontSize: width * interfaceSize * 0.04,
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
    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },
  buttonTitle: { fontWeight: '400' },
})
