/** @format */

import { createActions, handleActions } from 'redux-actions';
import { WooWorker } from 'api-ecommerce';
import { Config } from '@common';
import { request } from '../Omni';

const types = {
  BRANDS_FETCHING: 'BRANDS_FETCHING',
  BRANDS_SUCCESS: 'BRANDS_SUCCESS',
  BRANDS_FAILURE: 'BRANDS_FAILURE',
};

export const { brandsFetching, brandsSuccess, brandsFailure } = createActions(
  types.BRANDS_FETCHING,
  types.BRANDS_SUCCESS,
  types.BRANDS_FAILURE,
);

export const actions = {
  fetchBrands: () => async dispatch => {
    console.log('🔄 Starting fresh brands fetch...');
    dispatch(brandsFetching());
    
    try {
      // Use WooCommerce Store API endpoint for brands (no auth required)
      const url = `${Config.WooCommerce.url}wp-json/wc/store/v1/products/brands`;
      
      console.log('Config.WooCommerce.url:', Config.WooCommerce.url);
      console.log('Config.WooCommerce.consumerKey:', Config.WooCommerce.consumerKey);
      console.log('Config.WooCommerce.consumerSecret:', Config.WooCommerce.consumerSecret);
      
      console.log('Fetching brands from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`WooCommerce Store API error! status: ${response.status}`);
      }
      
      const json = await response.json();

      console.log('WooCommerce Brands API Response:', json);
      console.log('First brand raw data:', json[0]);
      console.log('First brand image:', json[0]?.image);

      if (json === undefined || !Array.isArray(json)) {
        dispatch(brandsFailure("Can't get brands data from server"));
      } else if (json.code) {
        dispatch(brandsFailure(json.message));
      } else {
        // Transform WooCommerce Store API brands data
        const transformedBrands = json.map(brand => {
          console.log('Processing WooCommerce Store API brand:', brand.name, 'ID:', brand.id);
          console.log('Brand image data:', brand.image);
          
          return {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            description: brand.description || '',
            count: brand.count || 0,
            link: brand.permalink,
            image: brand.image, // Keep original image object from Store API
            // Store original data for debugging
            _original: brand
          };
        });
        
        console.log('Transformed brands:', transformedBrands);
        dispatch(brandsSuccess(transformedBrands));
      }
    } catch (error) {
      console.error('Error fetching brands from WooCommerce API:', error);
      dispatch(brandsFailure(error.message || "Failed to fetch brands"));
    }
  },
};

const defaultState = { list: [], isFetching: false, error: null };

export const reducer = handleActions(
  {
    [brandsFetching]: state => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    [brandsSuccess]: (state, { payload }) => ({
      ...state,
      list: payload,
      isFetching: false,
      error: null,
    }),
    [brandsFailure]: (state, { payload }) => ({
      ...state,
      isFetching: false,
      error: payload,
    }),
  },
  defaultState,
);
