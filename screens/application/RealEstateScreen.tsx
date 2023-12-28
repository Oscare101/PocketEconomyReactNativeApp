import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../../constants/colors'
import HeaderDrawer from '../../components/HeaderDrawer'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import IconBlock from '../../components/IconBlock'
import rules from '../../constants/rules'
import { useMemo, useRef, useState } from 'react'
import { GetMoneyAmount } from '../../functions/functions'
import { Ionicons } from '@expo/vector-icons'
import Button from '../../components/Button'
import {
  GetDaysFromDate,
  GetPropertyCost,
  GetPropertyIncome,
} from '../../functions/realEstateFunctions'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'

const width = Dimensions.get('screen').width

export default function RealEstateScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user = useSelector((state: RootState) => state.user)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const [region, setRegion] = useState<number>(0)
  const [userProperty, setUserProperty] = useState<boolean>(false)

  const [bottomSheetContent, setBottomSheetContent] = useState<any>(
    'RealEstateTransaction'
  )
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [300], [])

  const region1 = (
    <TouchableOpacity
      style={{
        width: '19%',
        height: '5%',
        position: 'absolute',
        top: '34%',
        right: '11%',
        zIndex: 2,
        transform: [{ rotate: '45deg' }],
      }}
      onPress={() => setRegion(1)}
    />
  )
  const region2 = (
    <>
      <TouchableOpacity
        style={{
          width: '17%',
          height: '7%',
          position: 'absolute',
          top: '22%',
          right: '27%',
          zIndex: 2,
          transform: [{ rotate: '30deg' }],
        }}
        onPress={() => setRegion(2)}
      />
      <TouchableOpacity
        style={{
          width: '17%',
          height: '3.5%',
          position: 'absolute',
          top: '11%',
          right: '30.5%',
          zIndex: 2,
          transform: [{ rotate: '-65deg' }],
        }}
        onPress={() => setRegion(2)}
      />
    </>
  )
  const region3 = (
    <>
      <TouchableOpacity
        style={{
          width: '20%',
          height: '7%',
          position: 'absolute',
          top: '10%',
          right: '19%',
          zIndex: 2,
          transform: [{ rotate: '-34deg' }],
        }}
        onPress={() => setRegion(3)}
      />
      <TouchableOpacity
        style={{
          width: '14%',
          height: '7%',
          position: 'absolute',
          top: '6%',
          right: '21%',
          zIndex: 2,
          transform: [{ rotate: '-0deg' }],
        }}
        onPress={() => setRegion(3)}
      />
    </>
  )
  const region4 = (
    <>
      <TouchableOpacity
        style={{
          width: '36%',
          height: '9%',
          position: 'absolute',
          top: '24%',
          right: '-5%',
          zIndex: 2,
          transform: [{ rotate: '61deg' }],
        }}
        onPress={() => setRegion(4)}
      />
      <TouchableOpacity
        style={{
          width: '7%',
          height: '9%',
          position: 'absolute',
          top: '17%',
          right: '23%',
          zIndex: 2,
          transform: [{ rotate: '-30deg' }],
        }}
        onPress={() => setRegion(4)}
      />
    </>
  )
  const region5 = (
    <>
      <TouchableOpacity
        style={{
          width: '6%',
          height: '9%',
          position: 'absolute',
          top: '29%',
          right: '41%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(5)}
      />

      <TouchableOpacity
        style={{
          width: '4%',
          height: '30%',
          position: 'absolute',
          top: '26%',
          right: '30%',
          zIndex: 2,
          transform: [{ rotate: '-52deg' }],
        }}
        onPress={() => setRegion(5)}
      />
    </>
  )
  const region6 = (
    <>
      <TouchableOpacity
        style={{
          width: '8%',
          height: '33%',
          position: 'absolute',
          top: '50%',
          right: '8%',
          zIndex: 2,
          transform: [{ rotate: '-23deg' }],
        }}
        onPress={() => setRegion(6)}
      />
    </>
  )
  const region7 = (
    <>
      <TouchableOpacity
        style={{
          width: '10%',
          height: '15%',
          position: 'absolute',
          top: '42%',
          right: '43%',
          zIndex: 2,
          transform: [{ rotate: '42deg' }],
        }}
        onPress={() => setRegion(7)}
      />
      <TouchableOpacity
        style={{
          width: '13%',
          height: '10%',
          position: 'absolute',

          top: '40%',
          right: '40%',
          zIndex: 2,
          transform: [{ rotate: '42deg' }],
        }}
        onPress={() => setRegion(7)}
      />
      <TouchableOpacity
        style={{
          width: '5.5%',
          height: '14%',
          position: 'absolute',
          top: '36.5%',
          right: '33.5%',
          zIndex: 2,
          transform: [{ rotate: '-47deg' }],
        }}
        onPress={() => setRegion(7)}
      />
    </>
  )
  const region8 = (
    <>
      <TouchableOpacity
        style={{
          width: '10%',
          height: '7%',
          position: 'absolute',
          top: '34%',
          right: '50%',
          zIndex: 2,
          transform: [{ rotate: '35deg' }],
        }}
        onPress={() => setRegion(8)}
      />
      <TouchableOpacity
        style={{
          width: '7%',
          height: '8%',
          position: 'absolute',
          top: '32%',
          right: '69%',
          zIndex: 2,
          transform: [{ rotate: '15deg' }],
        }}
        onPress={() => setRegion(8)}
      />
      <TouchableOpacity
        style={{
          width: '18%',
          height: '18%',
          position: 'absolute',
          top: '33.5%',
          right: '53.5%',
          zIndex: 2,
          transform: [{ rotate: '-75deg' }],
        }}
        onPress={() => setRegion(8)}
      />
    </>
  )
  const region9 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '12%',
          position: 'absolute',
          top: '4%',
          right: '51%',
          zIndex: 2,
          transform: [{ rotate: '43deg' }],
        }}
        onPress={() => setRegion(9)}
      />
      <TouchableOpacity
        style={{
          width: '10%',
          height: '9%',
          position: 'absolute',
          top: '16%',
          right: '48%',
          zIndex: 2,
          transform: [{ rotate: '38deg' }],
        }}
        onPress={() => setRegion(9)}
      />
    </>
  )
  const region10 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '8%',
          position: 'absolute',
          top: '24%',
          right: '53%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(10)}
      />
      <TouchableOpacity
        style={{
          width: '6%',
          height: '12%',
          position: 'absolute',
          top: '15%',
          right: '63%',
          zIndex: 2,
          transform: [{ rotate: '45deg' }],
        }}
        onPress={() => setRegion(10)}
      />
      <TouchableOpacity
        style={{
          width: '4%',
          height: '18%',
          position: 'absolute',
          top: '19%',
          right: '54%',
          zIndex: 2,
          transform: [{ rotate: '-50deg' }],
        }}
        onPress={() => setRegion(10)}
      />
    </>
  )
  const region11 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '18%',
          position: 'absolute',
          top: '50%',
          right: '28%',
          zIndex: 2,
          transform: [{ rotate: '-48deg' }],
        }}
        onPress={() => setRegion(11)}
      />
      <TouchableOpacity
        style={{
          width: '8%',
          height: '25%',
          position: 'absolute',
          top: '48%',
          right: '27%',
          zIndex: 2,
          transform: [{ rotate: '26deg' }],
        }}
        onPress={() => setRegion(11)}
      />
    </>
  )
  const region12 = (
    <>
      <TouchableOpacity
        style={{
          width: '27%',
          height: '6%',
          position: 'absolute',
          top: '50%',
          right: '56%',
          zIndex: 2,
          transform: [{ rotate: '15deg' }],
        }}
        onPress={() => setRegion(12)}
      />
      <TouchableOpacity
        style={{
          width: '22%',
          height: '10%',
          position: 'absolute',
          top: '54%',
          right: '60%',
          zIndex: 2,
          transform: [{ rotate: '50deg' }],
        }}
        onPress={() => setRegion(12)}
      />
      <TouchableOpacity
        style={{
          width: '6%',
          height: '24%',
          position: 'absolute',
          top: '52%',
          right: '60%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(12)}
      />
    </>
  )
  const region13 = (
    <>
      <TouchableOpacity
        style={{
          width: '29%',
          height: '5%',
          position: 'absolute',
          top: '64%',
          right: '32%',
          zIndex: 2,
          transform: [{ rotate: '52deg' }],
        }}
        onPress={() => setRegion(13)}
      />
      <TouchableOpacity
        style={{
          width: '8%',
          height: '22%',
          position: 'absolute',
          top: '58%',
          right: '51%',
          zIndex: 2,
          transform: [{ rotate: '0deg' }],
        }}
        onPress={() => setRegion(13)}
      />
      <TouchableOpacity
        style={{
          width: '12%',
          height: '15%',
          position: 'absolute',
          top: '66%',
          right: '44%',
          zIndex: 2,
          transform: [{ rotate: '50deg' }],
        }}
        onPress={() => setRegion(13)}
      />
    </>
  )
  const region14 = (
    <>
      <TouchableOpacity
        style={{
          width: '26%',
          height: '12%',
          position: 'absolute',
          top: '13%',
          right: '65%',
          zIndex: 2,
          transform: [{ rotate: '-45deg' }],
        }}
        onPress={() => setRegion(14)}
      />
      <TouchableOpacity
        style={{
          width: '8%',
          height: '20%',
          position: 'absolute',
          top: '17%',
          right: '78%',
          zIndex: 2,
          transform: [{ rotate: '90deg' }],
        }}
        onPress={() => setRegion(14)}
      />
    </>
  )
  const region15 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '17%',
          position: 'absolute',
          top: '70%',
          right: '15%',
          zIndex: 2,
          transform: [{ rotate: '-35deg' }],
        }}
        onPress={() => setRegion(15)}
      />
      <TouchableOpacity
        style={{
          width: '5%',
          height: '17%',
          position: 'absolute',
          top: '61%',
          right: '18%',
          zIndex: 2,
          transform: [{ rotate: '-46deg' }],
        }}
        onPress={() => setRegion(15)}
      />
      <TouchableOpacity
        style={{
          width: '12%',
          height: '8%',
          position: 'absolute',
          top: '60%',
          right: '16%',
          zIndex: 2,
          transform: [{ rotate: '50deg' }],
        }}
        onPress={() => setRegion(15)}
      />
    </>
  )
  const region16 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '14%',
          position: 'absolute',
          top: '32%',
          right: '75%',
          zIndex: 2,
          transform: [{ rotate: '12deg' }],
        }}
        onPress={() => setRegion(16)}
      />
    </>
  )
  const region17 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '31%',
          position: 'absolute',
          top: '46%',
          right: '77%',
          zIndex: 2,
          transform: [{ rotate: '-32deg' }],
        }}
        onPress={() => setRegion(17)}
      />
    </>
  )
  const region18 = (
    <>
      <TouchableOpacity
        style={{
          width: '18%',
          height: '18%',
          position: 'absolute',
          top: '77%',
          right: '56%',
          zIndex: 2,
          transform: [{ rotate: '-21deg' }],
        }}
        onPress={() => setRegion(18)}
      />
      <TouchableOpacity
        style={{
          width: '18%',
          height: '15%',
          position: 'absolute',
          top: '73%',
          right: '63%',
          zIndex: 2,
          transform: [{ rotate: '-28deg' }],
        }}
        onPress={() => setRegion(18)}
      />
    </>
  )
  const region19 = (
    <>
      <TouchableOpacity
        style={{
          width: '23%',
          height: '18%',
          position: 'absolute',
          top: '79%',
          right: '30%',
          zIndex: 2,
          transform: [{ rotate: '-21deg' }],
        }}
        onPress={() => setRegion(19)}
      />
    </>
  )
  // TITLES
  const title1 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 1 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '30%',
        right: '22%',
      }}
    >
      1
    </Text>
  )
  const title2 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 2 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '22%',
        right: '33%',
      }}
    >
      2
    </Text>
  )
  const title3 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 3 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '8%',
        right: '28%',
      }}
    >
      3
    </Text>
  )
  const title4 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 4 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '20%',
        right: '13%',
      }}
    >
      4
    </Text>
  )
  const title5 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 5 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '31%',
        right: '42%',
      }}
    >
      5
    </Text>
  )
  const title6 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 6 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '63%',
        right: '10%',
      }}
    >
      6
    </Text>
  )
  const title7 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 7 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '42%',
        right: '45%',
      }}
    >
      7
    </Text>
  )
  const title8 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 8 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '37%',
        right: '61%',
      }}
    >
      8
    </Text>
  )
  const title9 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 9 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '7%',
        right: '56%',
      }}
    >
      9
    </Text>
  )
  const title10 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 10 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '22%',
        right: '60%',
      }}
    >
      10
    </Text>
  )
  const title11 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 11 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '55%',
        right: '32%',
      }}
    >
      11
    </Text>
  )
  const title12 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 12 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '55%',
        right: '64%',
      }}
    >
      12
    </Text>
  )
  const title13 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 13 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '66%',
        right: '48%',
      }}
    >
      13
    </Text>
  )
  const title14 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 14 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '19%',
        right: '76%',
      }}
    >
      14
    </Text>
  )
  const title15 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 15 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '72%',
        right: '20%',
      }}
    >
      15
    </Text>
  )
  const title16 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 16 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '35%',
        right: '80%',
      }}
    >
      16
    </Text>
  )
  const title17 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 17 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '62%',
        right: '79%',
      }}
    >
      17
    </Text>
  )
  const title18 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 18 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '78%',
        right: '63%',
      }}
    >
      18
    </Text>
  )
  const title19 = (
    <Text
      style={{
        fontSize: width * 0.06,
        color:
          region === 19 ? colors[themeColor].text : colors[themeColor].comment,
        position: 'absolute',
        top: '83%',
        right: '38%',
      }}
    >
      19
    </Text>
  )
  const mapBlock = (
    <View
      style={{
        width: width,
        height: (width * 278) / 266,
      }}
    >
      <IconBlock width={width} theme={themeColor} type={region} />
      {/* TOUCHABLE */}
      {region1}
      {region2}
      {region3}
      {region4}
      {region5}
      {region6}
      {region7}
      {region8}
      {region9}
      {region10}
      {region11}
      {region12}
      {region13}
      {region14}
      {region15}
      {region16}
      {region17}
      {region18}
      {region19}
      {/* TITLES */}
      {title1}
      {title2}
      {title3}
      {title4}
      {title5}
      {title6}
      {title7}
      {title8}
      {title9}
      {title10}
      {title11}
      {title12}
      {title13}
      {title14}
      {title15}
      {title16}
      {title17}
      {title18}
      {title19}
    </View>
  )
  const chooseBlock = (
    <>
      <Text style={[styles.regionTitle, { color: colors[themeColor].comment }]}>
        Choose a region{' '}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setBottomSheetContent('RealEstateInfo')
            bottomSheetModalRef.current?.present()
          }}
        >
          <Ionicons
            name="information-circle-outline"
            color={colors[themeColor].text}
            size={width * 0.045}
          />
        </TouchableOpacity>
      </Text>
    </>
  )
  const regionBlock = (
    <>
      <Text style={[styles.regionTitle, { color: colors[themeColor].text }]}>
        Tier {region} region{' '}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setBottomSheetContent('RealEstateInfo')
            bottomSheetModalRef.current?.present()
          }}
        >
          <Ionicons
            name="information-circle-outline"
            color={colors[themeColor].text}
            size={width * 0.045}
          />
        </TouchableOpacity>
      </Text>
      {region ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <View
              style={[
                styles.cardColumn,
                { backgroundColor: colors[themeColor].cardColor },
              ]}
            >
              <Text
                style={[
                  styles.regionValue,
                  { color: colors[themeColor].comment },
                ]}
              >
                Property cost
              </Text>
              <Text
                style={[styles.regionValue, { color: colors[themeColor].text }]}
              >
                ${' '}
                {GetMoneyAmount(GetPropertyCost(user.loginDate, region)).value}.
                {
                  GetMoneyAmount(GetPropertyCost(user.loginDate, region))
                    .decimal
                }
                {GetMoneyAmount(GetPropertyCost(user.loginDate, region)).title}
              </Text>
            </View>
            <View
              style={[
                styles.cardColumn,
                { backgroundColor: colors[themeColor].cardColor },
              ]}
            >
              <Text
                style={[
                  styles.regionValue,
                  { color: colors[themeColor].comment },
                ]}
              >
                Income per day
              </Text>
              <Text
                style={[styles.regionValue, { color: colors[themeColor].text }]}
              >
                ${' '}
                {
                  GetMoneyAmount(GetPropertyIncome(user.loginDate, region))
                    .value
                }
                .
                {
                  GetMoneyAmount(GetPropertyIncome(user.loginDate, region))
                    .decimal
                }
                {
                  GetMoneyAmount(GetPropertyIncome(user.loginDate, region))
                    .title
                }
              </Text>
            </View>
            <View
              style={[
                styles.cardColumn,
                { backgroundColor: colors[themeColor].cardColor },
              ]}
            >
              <Text
                style={[
                  styles.regionValue,
                  { color: colors[themeColor].comment },
                ]}
              >
                Your ptoperties
              </Text>
              <Text
                style={[styles.regionValue, { color: colors[themeColor].text }]}
              >
                {/* TODO count user properties */}
                {user.realEstate?.find((r: any) => r.region === region)
                  ?.amount || 0}
                /{rules.realEstate.amount[region - 1]}
              </Text>
            </View>
          </View>
          <FlatList
            data={[...Array(rules.realEstate.amount[region - 1])]}
            scrollEnabled={false}
            renderItem={RenderPropertyItem}
            numColumns={7}
            style={{ marginVertical: 10 }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  )
  function RenderPropertyItem({ item, index }: any) {
    const isUserProperty: boolean =
      (user.realEstate.find((r: any) => r.region === region)?.amount || 0) >
      index

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setBottomSheetContent('RealEstateTransaction')
          setUserProperty(isUserProperty)
          bottomSheetModalRef.current?.present()
        }}
        style={{
          width: width * 0.1,
          height: width * 0.1,
          backgroundColor: colors[themeColor].infoBg,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          margin: 5,
        }}
      >
        <Ionicons
          name="home-outline"
          size={width * 0.08}
          color={
            isUserProperty
              ? colors[themeColor].infoText
              : colors[themeColor].cardColor
          }
        />
      </TouchableOpacity>
    )
  }

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          { backgroundColor: colors[themeColor].bgColor },
        ]}
      >
        <HeaderDrawer title="Real estate" />
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.container,
              { backgroundColor: colors[themeColor].bgColor },
            ]}
          >
            {mapBlock}
            {region ? regionBlock : chooseBlock}
          </View>
        </ScrollView>
      </View>
      {/* BottomSheet */}
      <BottomModalBlock
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        dismiss={() => bottomSheetModalRef.current?.dismiss()}
        content={bottomSheetContent}
        onClose={() => bottomSheetModalRef.current?.dismiss()}
        userProperty={userProperty}
        region={region}
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
  cardColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: width * 0.3,
    marginHorizontal: (width * 0.1) / 6,
    paddingVertical: width * 0.03,
  },
  regionTitle: {
    fontSize: width * 0.07,
    marginVertical: 10,
  },
  regionValue: {
    fontSize: width * 0.035,
  },
  regionComment: {
    fontSize: width * 0.04,
  },
})
