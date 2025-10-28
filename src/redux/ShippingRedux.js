import BiteshipAPI from '@services/BiteshipAPI';

const initialState = {
  shippingRates: [],
  selectedShippingMethod: null,
  isLoading: false,
  error: null,
  couriers: [],
  originAddress: null,
  destinationAddress: null,
};

// Action Types
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_SHIPPING_RATES = 'SET_SHIPPING_RATES';
const SET_SELECTED_SHIPPING_METHOD = 'SET_SELECTED_SHIPPING_METHOD';
const SET_COURIERS = 'SET_COURIERS';
const SET_ORIGIN_ADDRESS = 'SET_ORIGIN_ADDRESS';
const SET_DESTINATION_ADDRESS = 'SET_DESTINATION_ADDRESS';
const CLEAR_SHIPPING_DATA = 'CLEAR_SHIPPING_DATA';

// Action Creators
export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const setShippingRates = (rates) => ({
  type: SET_SHIPPING_RATES,
  payload: rates,
});

export const setSelectedShippingMethod = (method) => ({
  type: SET_SELECTED_SHIPPING_METHOD,
  payload: method,
});

export const setCouriers = (couriers) => ({
  type: SET_COURIERS,
  payload: couriers,
});

export const setOriginAddress = (address) => ({
  type: SET_ORIGIN_ADDRESS,
  payload: address,
});

export const setDestinationAddress = (address) => ({
  type: SET_DESTINATION_ADDRESS,
  payload: address,
});

export const clearShippingData = () => ({
  type: CLEAR_SHIPPING_DATA,
});

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case SET_SHIPPING_RATES:
      return {
        ...state,
        shippingRates: action.payload,
        isLoading: false,
        error: null,
      };
    case SET_SELECTED_SHIPPING_METHOD:
      return {
        ...state,
        selectedShippingMethod: action.payload,
      };
    case SET_COURIERS:
      return {
        ...state,
        couriers: action.payload,
      };
    case SET_ORIGIN_ADDRESS:
      return {
        ...state,
        originAddress: action.payload,
      };
    case SET_DESTINATION_ADDRESS:
      return {
        ...state,
        destinationAddress: action.payload,
      };
    case CLEAR_SHIPPING_DATA:
      return {
        ...state,
        shippingRates: [],
        selectedShippingMethod: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Async thunks
export const fetchShippingRates = (origin, destination, items, courier = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const rates = await BiteshipAPI.getShippingRates(origin, destination, items, courier);
    dispatch(setShippingRates(rates.pricing || []));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchCouriers = () => async (dispatch) => {
  try {
    const couriers = await BiteshipAPI.getCouriers();
    dispatch(setCouriers(couriers.couriers || []));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createShippingOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await BiteshipAPI.createOrder(orderData);
    return result;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const trackShippingOrder = (waybillId, courierCode) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await BiteshipAPI.trackOrder(waybillId, courierCode);
    return result;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default reducer;
