import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Company } from '../constants/interfaces'

const initialState: Company[] = []

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    updateCompanies: (state, action: PayloadAction<Company[]>) => {
      state.splice(0, state.length, ...action.payload)
    },
  },
})

export const { updateCompanies } = companiesSlice.actions
export default companiesSlice.reducer
