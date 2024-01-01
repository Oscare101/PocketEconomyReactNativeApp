import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../constants/interfaces'

const initialState: User = {
  name: '',
  loginDate: '',
  cash: 0,
  stocks: [],
  history: [],
  deposits: [],
  dividendsHistory: [],
  realEstate: [],
  realEstateHistory: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      return action.payload
    },
  },
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
