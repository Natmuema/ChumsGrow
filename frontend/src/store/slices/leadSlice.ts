import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lead {
  id: string;
  phone_number: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  source: string;
  status: 'new' | 'contacted' | 'engaged' | 'qualified' | 'converted' | 'lost';
  score: number;
  total_messages: number;
  last_interaction?: string;
  created_at: string;
}

interface LeadState {
  leads: Lead[];
  selectedLead: Lead | null;
  filters: {
    status?: string;
    source?: string;
    minScore?: number;
  };
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

const initialState: LeadState = {
  leads: [],
  selectedLead: null,
  filters: {},
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<{ leads: Lead[]; total: number }>) => {
      state.leads = action.payload.leads;
      state.totalCount = action.payload.total;
    },
    setSelectedLead: (state, action: PayloadAction<Lead | null>) => {
      state.selectedLead = action.payload;
    },
    updateLead: (state, action: PayloadAction<Partial<Lead> & { id: string }>) => {
      const index = state.leads.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = { ...state.leads[index], ...action.payload };
      }
      if (state.selectedLead?.id === action.payload.id) {
        state.selectedLead = { ...state.selectedLead, ...action.payload };
      }
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLeads,
  setSelectedLead,
  updateLead,
  setFilters,
  setCurrentPage,
  setLoading,
  setError,
} = leadSlice.actions;

export default leadSlice.reducer;