import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Log } from '../constants/interfaces'

const initialState: Log[] = []

const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    updateLog: (state, action: PayloadAction<Log[]>) => {
      state.splice(0, state.length, ...action.payload)
    },
  },
})

export const { updateLog } = logSlice.actions
export default logSlice.reducer
