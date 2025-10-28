/** @format */

import * as React from 'react';
import {useEffect, useMemo, useCallback, useState} from 'react';
import {View, RefreshControl, AppState, TouchableOpacity, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {initializeCache} from '@utils/CacheManager';
import {Constants, withTheme} from '@common';
import {ROUTER} from '@navigation/constants';
import {HorizonList, ModalLayout, PostList, BannerPostsSlider, CustomerSummary, AnnouncementTicker, ApiCategories, BrandFeature, TopHeader} from '@components';
import OfflineSkeleton from '@components/OfflineSkeleton';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import {retryApiCall, safeApiCall, isNetworkError} from '../../utils/apiRetry';
import {Config} from '@common';
import * as CountryRedux from '@redux/CountryRedux';
import * as CategoryRedux from '@redux/CategoryRedux';
import * as CustomerPointsRedux from '@redux/CustomerPointsRedux';

import styles from './styles';

const Home = React.memo(
  ({theme = {}, onViewProductScreen, showCategoriesScreen, onShowAll}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const {isOffline, isConnected, isInternetReachable, justCameOnline, refreshKey, networkError, setNetworkError} = useNetworkStatus();
    
    // Debug log to check theme
    console.log('Home theme:', theme);
    console.log('Home background:', theme?.colors?.background);
  const countryList = useSelector(state => state.countries.list);
  const layoutHome = useSelector(state => state.products.layoutHome);
  const language = useSelector(state => state.language);
  const user = useSelector(state => state.user.user);

    const fetchCategories = useCallback(async () => {
      try {
        console.log('🔄 Fetching categories...');
        await retryApiCall(
          () => CategoryRedux.actions.fetchCategories(dispatch),
          3, // max retries
          1000 // initial delay
        );
        console.log('✅ Categories fetched successfully');
        setNetworkError(false);
      } catch (error) {
        console.log('❌ Error fetching categories:', error.message);
        if (isNetworkError(error)) {
          setNetworkError(true);
        }
      }
    }, [dispatch, setNetworkError]);

  const fetchAllCountries = useCallback(async () => {
    try {
      console.log('🔄 Fetching countries...');
      await retryApiCall(
        () => CountryRedux.actions.fetchAllCountries(dispatch),
        3, // max retries
        1000 // initial delay
      );
      console.log('✅ Countries fetched successfully');
      setNetworkError(false);
    } catch (error) {
      console.log('❌ Error fetching countries:', error.message);
      if (isNetworkError(error)) {
        setNetworkError(true);
      }
    }
  }, [dispatch, setNetworkError]);

  const fetchCustomerPoints = useCallback(async () => {
    if (!user || !user.id) {
      console.log('⚠️ No user ID available for fetching customer points');
      return;
    }

    try {
      console.log('🔄 Fetching customer points for user:', user.id);
      await retryApiCall(
        () => CustomerPointsRedux.actions.fetchCustomerPoints(user.id)(dispatch),
        3, // max retries
        1000 // initial delay
      );
      console.log('✅ Customer points fetched successfully');
      setNetworkError(false);
    } catch (error) {
      console.log('❌ Error fetching customer points:', error.message);
      if (isNetworkError(error)) {
        setNetworkError(true);
      }
    }
  }, [dispatch, setNetworkError, user]);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        console.log('🔄 Manual refresh started...');
        // Clear cache and refresh all data
        await initializeCache();
        
        // Clear caches when manually refreshing
        if (typeof require !== 'undefined') {
          try {
            const BannerPostsSlider = require('../../components/BannerPostsSlider').default;
            if (BannerPostsSlider && BannerPostsSlider.clearCache) {
              BannerPostsSlider.clearCache();
            }
          } catch (e) {
            // Ignore if module not found
          }
          
          try {
            const ApiCategories = require('../../components/ApiCategories').default;
            if (ApiCategories && ApiCategories.clearCache) {
              ApiCategories.clearCache();
            }
          } catch (e) {
            // Ignore if module not found
          }
        }
        
        // Fetch fresh data with retry
        if (isConnected) {
          await Promise.all([
            fetchCategories(),
            fetchAllCountries(),
            fetchCustomerPoints()
          ]);
        }
        
        console.log('✅ Home data refreshed successfully');
        setNetworkError(false);
      } catch (error) {
        console.log('❌ Error refreshing home data:', error.message);
        if (isNetworkError(error)) {
          setNetworkError(true);
        }
    } finally {
      setRefreshing(false);
    }
  }, [isConnected, fetchCategories, fetchAllCountries, fetchCustomerPoints, setNetworkError]);

    const setSelectedCategory = useCallback((category) => {
      CategoryRedux.actions.setSelectedCategory(dispatch, category);
    }, [dispatch]);

    const onForceRefresh = useCallback(async () => {
      console.log('🔄 Force refresh triggered');
      setRefreshing(true);
      setNetworkError(false);
      
      try {
        // Clear cache and force refresh all data
        await initializeCache();
        await Promise.all([
          fetchCategories(),
          fetchAllCountries()
        ]);
        console.log('✅ Force refresh completed successfully');
      } catch (error) {
        console.log('❌ Force refresh failed:', error.message);
        if (isNetworkError(error)) {
          setNetworkError(true);
        }
      } finally {
        setRefreshing(false);
      }
    }, [fetchCategories, fetchAllCountries, setNetworkError]);

    const onViewCategory = useCallback((category) => {
      setSelectedCategory(category);
      navigation.navigate('CategoryScreen');
    }, [navigation, setSelectedCategory]);

    const isHorizontal = useMemo(
      () => layoutHome === Constants.Layout.horizon || layoutHome === 7,
      [layoutHome],
    );

    useEffect(() => {
      // Initialize cache management with error handling
      initializeCache().then((cacheRefreshed) => {
        if (cacheRefreshed) {
          console.log('Cache refreshed on app startup');
        }
      }).catch((error) => {
        console.warn('Cache initialization failed, continuing without cache management:', error);
      });

      if (isConnected) {
        if (!countryList || isEmpty(countryList)) {
          fetchCategories();
          fetchAllCountries();
        }
        fetchCustomerPoints();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, countryList]);

    // Watch for user changes and fetch customer points when user logs in
    useEffect(() => {
      if (user && user.id && isConnected) {
        console.log('👤 User detected, fetching customer points for user:', user.id);
        fetchCustomerPoints();
      } else if (!user) {
        console.log('👤 No user detected, clearing customer points');
        dispatch(CustomerPointsRedux.actions.clearCustomerPoints());
      }
    }, [user, isConnected, fetchCustomerPoints, dispatch]);

    // Background app state listener for auto-refresh
    useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
          console.log('App became active, refreshing data...');
          // Refresh data when app becomes active
          if (isConnected) {
            fetchCategories();
            fetchAllCountries();
          }
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);
      
      return () => {
        subscription?.remove();
      };
    }, [isConnected, fetchCategories, fetchAllCountries]);

    // Auto-refresh when internet comes back
    useEffect(() => {
      if (justCameOnline) {
        console.log('🌐 Internet came back, auto-refreshing data...');
        console.log('🔄 RefreshKey:', refreshKey);
        setRefreshing(true);
        
        // Wait a bit for network to stabilize
        const refreshTimeout = setTimeout(async () => {
          try {
            console.log('🔄 Starting auto-refresh...');
            // Refresh all data with retry
            await Promise.all([
              fetchCategories(),
              fetchAllCountries()
            ]);
            console.log('✅ Auto-refresh completed successfully');
          } catch (error) {
            console.log('❌ Auto-refresh failed:', error.message);
          } finally {
            setRefreshing(false);
          }
        }, 3000); // Wait 3 seconds for network to stabilize
        
        return () => clearTimeout(refreshTimeout);
      }
    }, [justCameOnline, fetchCategories, fetchAllCountries, refreshKey]);

    // Show offline skeleton when no internet
    if (isOffline) {
      return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme?.colors?.background || '#fff'}]} edges={['top']}>
          <TopHeader 
            onSearchPress={(searchText) => navigation.navigate(ROUTER.SEARCH, {searchText})}
            onNotificationPress={() => navigation.navigate('NotificationScreen')}
            onRefreshPress={onRefresh}
          />
          <OfflineSkeleton theme={theme} />
          <ModalLayout />
        </SafeAreaView>
      );
    }

    // Show network error state
    if (networkError && !isOffline) {
      return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme?.colors?.background || '#fff'}]} edges={['top']}>
          <TopHeader 
            onSearchPress={(searchText) => navigation.navigate(ROUTER.SEARCH, {searchText})}
            onNotificationPress={() => navigation.navigate('NotificationScreen')}
            onRefreshPress={onRefresh}
          />
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
            <Text style={{fontSize: 18, marginBottom: 10, textAlign: 'center'}}>
              Network Error
            </Text>
            <Text style={{fontSize: 14, marginBottom: 20, textAlign: 'center', color: '#666'}}>
              Please check your internet connection and try again
            </Text>
            <TouchableOpacity 
              onPress={onRefresh}
              style={{backgroundColor: '#e39c7a', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5}}
            >
              <Text style={{color: 'white', fontWeight: 'bold'}}>Retry</Text>
            </TouchableOpacity>
          </View>
          <ModalLayout />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme?.colors?.background || '#fff'}]} edges={['top']}>
        <TopHeader 
          onSearchPress={(searchText) => navigation.navigate(ROUTER.SEARCH, {searchText})}
          onNotificationPress={() => navigation.navigate('NotificationScreen')}
          onRefreshPress={onRefresh}
        />
        {isHorizontal && (
          <HorizonList
            navigation={navigation}
            language={language}
            onShowAll={onShowAll}
            onViewProductScreen={onViewProductScreen}
            showCategoriesScreen={showCategoriesScreen}
            justCameOnline={justCameOnline}
            refreshKey={refreshKey}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#e39c7a']} // Android
                tintColor="#e39c7a" // iOS
                title="Pull to refresh"
                titleColor="#666"
              />
            }
            listHeaderComponentExtra={() => (
              <>
                <BannerPostsSlider
                  key={`banner-1-${refreshKey}`}
                  endpoint={Config.WooCommerce.url.replace(/\/$/, '')}
                  onPressPost={post =>
                    navigation.navigate('NewsDetailScreen', {post})
                  }
                  style={{paddingTop: 0, marginTop: 0}}
                  justCameOnline={justCameOnline}
                />
                <CustomerSummary navigation={navigation} />
                <AnnouncementTicker endpoint={Config.WooCommerce.url.replace(/\/$/, '')} />
                <ApiCategories
                  key={`categories-${refreshKey}`}
                  navigation={navigation}
                  onShowAll={onShowAll}
                  style={{paddingBottom: 10, paddingLeft: 10, paddingRight: 10}}
                  justCameOnline={justCameOnline}
                />
                <BannerPostsSlider
                  key={`banner-2-${refreshKey}`}
                  endpoint={Config.WooCommerce.url.replace(/\/$/, '')}
                  path={'/wp-json/wp/v2/banner?banner-type=378'}
                  query={'?_embed&per_page=3'}
                  onPressPost={post =>
                    navigation.navigate('NewsDetailScreen', {post})
                  }
                  transparent={true}
                  justCameOnline={justCameOnline}
                  showPartialNext={true}
                />
              </>
            )}
          />
        )}

        {!isHorizontal && (
          <PostList
            navigation={navigation}
            parentLayout={layoutHome}
            onViewProductScreen={onViewProductScreen}
            listHeaderComponentExtra={() => (
              <>
                <BannerPostsSlider
                  key={`banner-3-${refreshKey}`}
                  endpoint={Config.WooCommerce.url.replace(/\/$/, '')}
                  onPressPost={post =>
                    navigation.navigate('NewsDetailScreen', {post})
                  }
                  style={{paddingTop: 0, marginTop: 0}}
                  justCameOnline={justCameOnline}
                />
                <CustomerSummary navigation={navigation} />
                <AnnouncementTicker endpoint={Config.WooCommerce.url.replace(/\/$/, '')} />
                <ApiCategories
                  key={`categories-2-${refreshKey}`}
                  navigation={navigation}
                  onShowAll={onShowAll}
                  style={{marginBottom: 30}}
                  justCameOnline={justCameOnline}
                />
                <BannerPostsSlider
                  key={`banner-4-${refreshKey}`}
                  endpoint={Config.WooCommerce.url.replace(/\/$/, '')}
                  path={'/wp-json/wp/v2/banner?banner-type=378'}
                  query={'?_embed&per_page=3'}
                  onPressPost={post =>
                    navigation.navigate('NewsDetailScreen', {post})
                  }
                  transparent={true}
                  justCameOnline={justCameOnline}
                  showPartialNext={true}
                />
              </>
            )}
          />
        )}
        
        
        <ModalLayout />
      </SafeAreaView>
    );
  },
);

export default withTheme(Home);
