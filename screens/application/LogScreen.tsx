import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { Log } from '../../constants/interfaces'
import { RootState } from '../../redux'
import { MMKV } from 'react-native-mmkv'
import rules from '../../constants/rules'

export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function LogScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const log: Log[] = useSelector((state: RootState) => state.log)
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

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
            style={{
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.035,
            }}
          >
            {item.date}
          </Text>
          <Text
            style={{
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.035,
            }}
          >
            {item.time}
          </Text>
        </View>

        <Text
          style={{
            color: colors[themeColor].text,
            fontSize: width * interfaceSize * 0.05,
          }}
        >
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
          {rules.app.promoCodeAvailable ? (
            <View
              style={[
                styles.card,
                { backgroundColor: colors[themeColor].cardColor },
              ]}
            >
              <View style={styles.rowBetween}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    color: colors[themeColor].comment,
                  }}
                >
                  Promocode usage
                </Text>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    color: colors[themeColor].comment,
                  }}
                >
                  {log.filter((l: Log) => l.title === 'Promo code').length}
                </Text>
              </View>
            </View>
          ) : (
            <></>
          )}

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
})
