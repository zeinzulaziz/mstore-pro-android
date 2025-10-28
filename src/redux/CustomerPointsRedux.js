/** @format */

import CustomerPointsAPI from '../services/CustomerPointsAPI';

const types = {
  FETCH_CUSTOMER_POINTS: 'FETCH_CUSTOMER_POINTS',
  FETCH_CUSTOMER_POINTS_SUCCESS: 'FETCH_CUSTOMER_POINTS_SUCCESS',
  FETCH_CUSTOMER_POINTS_FAILURE: 'FETCH_CUSTOMER_POINTS_FAILURE',
  CLEAR_CUSTOMER_POINTS: 'CLEAR_CUSTOMER_POINTS',
};

export const actions = {
  fetchCustomerPoints: (userId) => {
    return async (dispatch) => {
      dispatch({ type: types.FETCH_CUSTOMER_POINTS, userId });
      
      try {
        const result = await CustomerPointsAPI.getCustomerPointsWithRetry(userId);
        
        if (result.success) {
          dispatch({
            type: types.FETCH_CUSTOMER_POINTS_SUCCESS,
            data: result.data,
            userId: userId,
          });
        } else {
          dispatch({
            type: types.FETCH_CUSTOMER_POINTS_FAILURE,
            error: result.error,
            userId: userId,
          });
        }
      } catch (error) {
        dispatch({
          type: types.FETCH_CUSTOMER_POINTS_FAILURE,
          error: error.message,
          userId: userId,
        });
      }
    };
  },

  clearCustomerPoints: () => {
    return { type: types.CLEAR_CUSTOMER_POINTS };
  },
};

// API Response: {"success": true, "user_id": 32, "name": "Zeon Aziz", "id_member": "25092622334840882", "qr_code_url": "https://doseofbeauty.id/qr_code/qr_25092622334840882.png", "points": 0, "log_url": "https://doseofbeauty.id/wp-admin/admin.php?page=member-points-log&id=25092622334840882"}
const initialState = {
  points: 0,
  user_id: null,
  name: null,
  id_member: null,
  qr_code_url: null,
  log_url: null,
  isFetching: false,
  error: null,
  lastUpdated: null,
};

export const reducer = (state = initialState, action) => {
  const { type, data, error, userId } = action;

  switch (type) {
    case types.FETCH_CUSTOMER_POINTS:
      return {
        ...state,
        isFetching: true,
        error: null,
        user_id: userId,
      };

    case types.FETCH_CUSTOMER_POINTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        points: data.points || 0,
        user_id: data.user_id || userId,
        name: data.name || null,
        id_member: data.id_member || null,
        qr_code_url: data.qr_code_url || null,
        log_url: data.log_url || null,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case types.FETCH_CUSTOMER_POINTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: error,
        user_id: userId,
      };

    case types.CLEAR_CUSTOMER_POINTS:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
