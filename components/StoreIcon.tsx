import { IslandStoreDark, IslandStoreLight } from '../constants/icons'

export default function StoreIcon(props: any) {
  const stores: any = {
    dark: {
      island: (
        <IslandStoreDark
          width={props.width}
          height={(props.width * 213) / 270}
        />
      ),
    },
    light: {
      island: (
        <IslandStoreLight
          width={props.width}
          height={(props.width * 213) / 270}
        />
      ),
    },
  }

  return <>{stores[props.theme][props.type]}</>
}
