import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../constants/interfaces'

const initialState: User = {
  name: 'Oscare',
  loginDate: '2023-12-21',
  capital: 1000,
  stocks: [],
  history: [],
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
