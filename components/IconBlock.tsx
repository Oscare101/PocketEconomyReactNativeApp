import {
  Map1Dark,
  Map2Dark,
  Map3Dark,
  Map4Dark,
  Map5Dark,
  Map6Dark,
  Map7Dark,
  Map8Dark,
  Map9Dark,
  Map10Dark,
  Map11Dark,
  Map12Dark,
  Map13Dark,
  Map14Dark,
  Map15Dark,
  Map16Dark,
  Map17Dark,
  Map18Dark,
  Map19Dark,
  MapEmptyDark,
  MapEmptyLight,
  //
  Map1Light,
  Map2Light,
  Map3Light,
  Map4Light,
  Map5Light,
  Map6Light,
  Map7Light,
  Map8Light,
  Map9Light,
  Map10Light,
  Map11Light,
  Map12Light,
  Map13Light,
  Map14Light,
  Map15Light,
  Map16Light,
  Map17Light,
  Map18Light,
  Map19Light,
} from '../constants/icons'

export default function IconBlock(props: any) {
  const maps: any = {
    dark: {
      0: (
        <MapEmptyDark width={props.width} height={(props.width * 278) / 266} />
      ),
      1: <Map1Dark width={props.width} height={(props.width * 278) / 266} />,
      2: <Map2Dark width={props.width} height={(props.width * 278) / 266} />,
      3: <Map3Dark width={props.width} height={(props.width * 278) / 266} />,
      4: <Map4Dark width={props.width} height={(props.width * 278) / 266} />,
      5: <Map5Dark width={props.width} height={(props.width * 278) / 266} />,
      6: <Map6Dark width={props.width} height={(props.width * 278) / 266} />,
      7: <Map7Dark width={props.width} height={(props.width * 278) / 266} />,
      8: <Map8Dark width={props.width} height={(props.width * 278) / 266} />,
      9: <Map9Dark width={props.width} height={(props.width * 278) / 266} />,
      10: <Map10Dark width={props.width} height={(props.width * 278) / 266} />,
      11: <Map11Dark width={props.width} height={(props.width * 278) / 266} />,
      12: <Map12Dark width={props.width} height={(props.width * 278) / 266} />,
      13: <Map13Dark width={props.width} height={(props.width * 278) / 266} />,
      14: <Map14Dark width={props.width} height={(props.width * 278) / 266} />,
      15: <Map15Dark width={props.width} height={(props.width * 278) / 266} />,
      16: <Map16Dark width={props.width} height={(props.width * 278) / 266} />,
      17: <Map17Dark width={props.width} height={(props.width * 278) / 266} />,
      18: <Map18Dark width={props.width} height={(props.width * 278) / 266} />,
      19: <Map19Dark width={props.width} height={(props.width * 278) / 266} />,
    },
    light: {
      0: (
        <MapEmptyLight width={props.width} height={(props.width * 278) / 266} />
      ),
      1: <Map1Light width={props.width} height={(props.width * 278) / 266} />,
      2: <Map2Light width={props.width} height={(props.width * 278) / 266} />,
      3: <Map3Light width={props.width} height={(props.width * 278) / 266} />,
      4: <Map4Light width={props.width} height={(props.width * 278) / 266} />,
      5: <Map5Light width={props.width} height={(props.width * 278) / 266} />,
      6: <Map6Light width={props.width} height={(props.width * 278) / 266} />,
      7: <Map7Light width={props.width} height={(props.width * 278) / 266} />,
      8: <Map8Light width={props.width} height={(props.width * 278) / 266} />,
      9: <Map9Light width={props.width} height={(props.width * 278) / 266} />,
      10: <Map10Light width={props.width} height={(props.width * 278) / 266} />,
      11: <Map11Light width={props.width} height={(props.width * 278) / 266} />,
      12: <Map12Light width={props.width} height={(props.width * 278) / 266} />,
      13: <Map13Light width={props.width} height={(props.width * 278) / 266} />,
      14: <Map14Light width={props.width} height={(props.width * 278) / 266} />,
      15: <Map15Light width={props.width} height={(props.width * 278) / 266} />,
      16: <Map16Light width={props.width} height={(props.width * 278) / 266} />,
      17: <Map17Light width={props.width} height={(props.width * 278) / 266} />,
      18: <Map18Light width={props.width} height={(props.width * 278) / 266} />,
      19: <Map19Light width={props.width} height={(props.width * 278) / 266} />,
    },
  }

  return <>{maps[props.theme][props.type]}</>
}
