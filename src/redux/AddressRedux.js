/** @format */

import { Config } from '@common';
// import { warn } from '@app/Omni'
import { WooWorker } from 'api-ecommerce';
import _ from 'lodash';

const types = {
  ADD_ADDRESS: 'ADD_ADDRESS',
  REMOVE_ADDRESS: 'REMOVE_ADDRESS',
  SELECTED_ADDRESS: 'SELECTED_ADDRESS',
  INIT_ADDRESSES: 'INIT_ADDRESSES',
  UPDATE_SELECTED_ADDRESS: 'UPDATE_SELECTED_ADDRESS',
  CACHE_LOCATION_DATA: 'CACHE_LOCATION_DATA',
  GET_CACHED_LOCATION: 'GET_CACHED_LOCATION',
};

export const actions = {
  addAddress: (dispatch, address) => {
    dispatch({ type: types.ADD_ADDRESS, address });
  },

  removeAddress: (dispatch, index) => {
    dispatch({ type: types.REMOVE_ADDRESS, index });
  },

  selectAddress: (dispatch, address) => {
    dispatch({ type: types.SELECTED_ADDRESS, address });
  },
  initAddresses: (dispatch, customerInfo) => {
    const address = {
      email: customerInfo.email,
      first_name: customerInfo.first_name,
      last_name: customerInfo.last_name,
      address_1: customerInfo.billing ? customerInfo.billing.address_1 : '',
      state: customerInfo.billing ? customerInfo.billing.state : '',
      postcode: customerInfo.billing ? customerInfo.billing.postcode : '',
      country: customerInfo.billing ? customerInfo.billing.country : '',
      phone: customerInfo.billing ? customerInfo.billing.phone : '',
      city: customerInfo.billing ? customerInfo.billing.city : '',
      note: '',
    };
    dispatch({ type: types.INIT_ADDRESSES, address });
  },
  updateSelectedAddress: (dispatch, address) => {
    dispatch({ type: types.UPDATE_SELECTED_ADDRESS, address });
  },
  
  // Cache location data (coordinates + address details)
  cacheLocationData: (dispatch, locationData) => {
    dispatch({ type: types.CACHE_LOCATION_DATA, locationData });
  },
  
  // Get cached location data
  getCachedLocation: (dispatch) => {
    dispatch({ type: types.GET_CACHED_LOCATION });
  },
};

const initialState = {
  list: [],
  reload: false,
  cachedLocation: null, // Store cached location data
};

export const reducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case types.ADD_ADDRESS: {
      state.list.push(action.address);
      return {
        ...state,
        reload: !state.reload,
      };
    }
    case types.REMOVE_ADDRESS: {
      state.list.splice(action.index, 1);
      return {
        ...state,
        reload: !state.reload,
      };
    }
    case types.SELECTED_ADDRESS: {
      return {
        ...state,
        reload: !state.reload,
        selectedAddress: action.address,
      };
    }
    case types.INIT_ADDRESSES: {
      return {
        ...state,
        reload: !state.reload,
        selectedAddress: action.address,
        list: [action.address],
      };
    }
    case types.UPDATE_SELECTED_ADDRESS: {
      const list = state.list || [];
      let index = -1;
      list.forEach((item, i) => {
        if (_.isEqual(item, state.selectedAddress)) {
          index = i;
        }
      });
      if (index > -1) {
        list.splice(index, 1);
      }
      list.push(action.address);
      return {
        ...state,
        reload: !state.reload,
        list,
        selectedAddress: action.address,
      };
    }
    case types.CACHE_LOCATION_DATA: {
      return {
        ...state,
        cachedLocation: action.locationData,
        reload: !state.reload,
      };
    }
    case types.GET_CACHED_LOCATION: {
      return {
        ...state,
        reload: !state.reload,
      };
    }
    default: {
      return state;
    }
  }
};
