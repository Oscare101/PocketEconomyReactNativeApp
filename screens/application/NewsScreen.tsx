import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { GetNews } from '../../functions/functions'

const width = Dimensions.get('screen').width

export default function NewsScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const companies = useSelector((state: RootState) => state.companies)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor },
      ]}
    >
      <HeaderDrawer title="News for today" />
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
          <View
            style={[
              styles.card,
              { backgroundColor: colors[themeColor].cardColor },
            ]}
          >
            <Text
              style={{ fontSize: width * 0.04, color: colors[themeColor].text }}
            >
              There is a lot of good news in the{' '}
              <Text style={{ color: colors[themeColor].successText }}>
                {GetNews().good}
              </Text>{' '}
              industry today, they have a little impact on the growth of
              companies in this sector
            </Text>
          </View>
          <View
            style={[
              styles.card,
              { backgroundColor: colors[themeColor].cardColor },
            ]}
          >
            <Text
              style={{ fontSize: width * 0.04, color: colors[themeColor].text }}
            >
              It seems these are not the best times for the{' '}
              <Text style={{ color: colors[themeColor].errorText }}>
                {GetNews().bad}
              </Text>{' '}
              industry. Companies in this area may be a little less productive
              than usual
            </Text>
          </View>
          <Text
            style={[styles.cardComment, { color: colors[themeColor].comment }]}
          >
            the news has little impact on companies, but it hits small
            businesses harder than big ones
          </Text>
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
  },
  cardComment: { fontSize: width * 0.04, fontWeight: '300', width: '92%' },
})
