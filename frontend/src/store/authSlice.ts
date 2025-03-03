import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register, verifyCode, login } from '@/lib/auth';
import axiosInstance from '@/lib/axios';

type initialState = {
    user : null | any;
    token : string | null;
    isLoading : boolean;
    isLoadingGoogle : boolean;
    error : string | null;
    success : string | null
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
        console.log(formData, 'formDAta')
        const response = await axiosInstance.post(`/user/register`, formData)
      console.log(response, 'response')
      if(response.data.success === false){
        return rejectWithValue(response.data.message)
      }
      return response.data.data;
    } catch (error : any) {
        console.log(error, "error")
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resendCode = createAsyncThunk(
  'auth/resendCode',
  async ({email} : {email : string}, { rejectWithValue }) => {
    try {
        console.log(email, 'formDAta')
        const response = await axiosInstance.post(`/user/resend-code`, {email})
      console.log(response, 'response')
      if(response.data.success === false){
        return rejectWithValue(response.data.message)
      }
      return response.data.data;
    } catch (error : any) {
        console.log(error, "error")
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyUserCode = createAsyncThunk(
  'auth/verifyUserCode',
  async (data: { email: string; code: string }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/user/verify-code`, data);
        if(response.data.success === false){
            return rejectWithValue(response.data.message)
          }
          return response.data.data;
    } catch (error : any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData: FormData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/user/login`, formData);
        if(response.data.success === false){
            return rejectWithValue(response.data.message)
          }
          return response.data.data;
    } catch (error : any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const googleContinue = createAsyncThunk(
  'auth/continueWithGoogle',
  async ({user }  : {user : any}, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/user/google`, user);
        if(response.data.success === false){
            return rejectWithValue(response.data.message)
          }
          return response.data.data;
    } catch (error : any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('user_token') || null,
    isLoading: false,
    error: null,
    success : null,
    isLoadingGoogle : false,
  } as initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user_token');
    },
    setToken :(state, action) => {
      state.token = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.user = action.payload;
        state.success = 'User registered'
        // localStorage.setItem("user_token", action.payload.token)

      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null
    })
      .addCase(googleContinue.pending, (state) => {
        state.isLoadingGoogle = true
        state.error = null;
        state.success = null
      })
      .addCase(googleContinue.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token
        state.success = 'User registered'
        localStorage.setItem("user_token", action.payload.token)
        state.isLoadingGoogle = false
      })
      .addCase(googleContinue.rejected, (state, action) => {
       
        state.error = action.payload as string;
        state.isLoadingGoogle = false
        state.success = null
    })
    .addCase(verifyUserCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null
    })
    .addCase(verifyUserCode.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload, 'action.payload')
        state.user = action.payload.user;
        state.token = action.payload.token
        state.success = "User Verified"
        localStorage.setItem("user_token", action.payload.token)
      })
      .addCase(verifyUserCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
    })
    .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user
        state.success = "Login successfull"
        localStorage.setItem('user_token', action.payload.token);
    })
    .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.success = null
        state.error = action.payload as string;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
