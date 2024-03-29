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
import {
  GetEconomicsProgress,
  GetSortedCompaniesByProgress,
} from '../../functions/functions'
import StatusItem from '../../components/StatusItem'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import { useMemo, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'

const width = Dimensions.get('screen').width

export default function AnalyticsScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const companies: any = useSelector((state: RootState) => state.companies)
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

  const themeColor: any = theme === 'system' ? systemTheme : theme
  const [showAllStocks, setShowAllStocks] = useState<boolean>(false)

  const [bottomSheetContent, setBottomSheetContent] =
    useState<any>('EconomicsGrowsInfo')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])

  const analyticsData = [
    {
      type: 'Progress',
      icon: 'analytics-outline',
      title: 'Stock market',
      comment: 'Best companies (last 24h)',
      value: GetEconomicsProgress(companies, 0).toFixed(2),
      infoModalData: '',
      data: GetSortedCompaniesByProgress(companies),
    },
  ]

  function RenderCompanyProgress({ item }: any) {
    return (
      <TouchableOpacity
        style={[
          styles.rowBetween,
          {
            height: width * interfaceSize * 0.08,
            marginVertical: 0,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('StockScreen', { companyName: item.name })
        }}
      >
        <Ionicons
          name={'open-outline'}
          size={width * interfaceSize * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.companyName,
            {
              color: colors[themeColor].text,
              fontSize: width * interfaceSize * 0.04,
            },
          ]}
        >
          {item.name}
          <Text
            style={{
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.035,
            }}
          >
            {' '}
            {item.industry}
          </Text>
        </Text>
        <StatusItem
          title={`${item.progress} %`}
          type={
            item.progress > 0.01
              ? 'success'
              : item.progress < -0.01
              ? 'error'
              : 'warning'
          }
          icon=""
        />
      </TouchableOpacity>
    )
  }

  function RenderAnalyticsItem({ item }: any) {
    const progressBlock = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <View style={[styles.rowBetween, { marginTop: 0 }]}>
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.title}:
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setBottomSheetContent('EconomicsGrowsInfo')
              bottomSheetModalRef.current?.present()
            }}
          >
            <Ionicons
              name="information-circle-outline"
              color={colors[themeColor].text}
              size={width * interfaceSize * 0.045}
            />
          </TouchableOpacity>
          <View style={styles.rowEnd}>
            <StatusItem
              title={`${item.value} %`}
              type={
                item.value > 0.01
                  ? 'success'
                  : item.value < -0.01
                  ? 'error'
                  : 'warning'
              }
              icon=""
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowAllStocks(!showAllStocks)}
          style={[styles.rowBetween, { marginVertical: 0, paddingVertical: 5 }]}
        >
          <Text
            style={{
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.045,
            }}
          >
            {item.comment}:
          </Text>
          <Ionicons
            name={showAllStocks ? 'chevron-up' : 'chevron-down'}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
        </TouchableOpacity>
        {showAllStocks ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />

            <FlatList
              data={item.data}
              style={{
                width: '100%',
                marginVertical: 5,
              }}
              renderItem={RenderCompanyProgress}
              ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
              scrollEnabled={false}
              initialNumToRender={item.data.length}
            />
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const renderType: any = {
      Progress: progressBlock,
    }

    return <>{renderType[item.type]}</>
  }

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          { backgroundColor: colors[themeColor].bgColor },
        ]}
      >
        <HeaderDrawer title="Analytics" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
        >
          <FlatList
            scrollEnabled={false}
            data={analyticsData}
            renderItem={RenderAnalyticsItem}
          />
        </ScrollView>
      </View>
      {/* BottomSheet */}
      <BottomModalBlock
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        dismiss={() => bottomSheetModalRef.current?.dismiss()}
        content={bottomSheetContent}
        onClose={() => bottomSheetModalRef.current?.dismiss()}
      />
    </BottomSheetModalProvider>
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
    marginVertical: 5,
  },
  rowEnd: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  cardTitle: {
    marginHorizontal: 10,
  },
  columnStart: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
  },
  companyName: {
    marginHorizontal: 10,
    flex: 1,
  },
})
