import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const interfaceSizeSlice = createSlice({
  name: 'interfaceSize',
  initialState: 1,
  reducers: {
    updateInterfaceSize: (state, action: PayloadAction<number>) => {
      return action.payload
    },
  },
})

export const { updateInterfaceSize } = interfaceSizeSlice.actions
export default interfaceSizeSlice.reducer
