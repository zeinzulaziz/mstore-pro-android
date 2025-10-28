/** @format */

import * as React from 'react';
import {useEffect, useCallback} from 'react';
import {Animated, FlatList, RefreshControl, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Config, withTheme, AppConfig, Constants} from '@common';
import * as LayoutRedux from '@redux/LayoutRedux';

import Header from './Header';
import ListItem from './ListItem';
import {PostList, IDCard} from '@components';
import Categories from './Categories';
import styles from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HorizonList = React.memo(
  ({
    theme: {colors: text} = {},
    showCategoriesScreen,
    onViewProductScreen,
    onShowAll,
    language,
    listHeaderComponentExtra,
  }) => {
    const dispatch = useDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const scrollAnimation = new Animated.Value(0);

    const initializing = useSelector(state => state.layouts.initializing);
    const layout = useSelector(state => state.layouts.layout);
    const isFetching = useSelector(state => state.layouts.isFetching);

    const isConnected = useSelector(state => state.netInfo.isConnected);

    const fetchAllProductsLayout = useCallback(() => {
      LayoutRedux.actions.fetchAllProductsLayout(dispatch, layout);
    }, [dispatch, layout]);

    useEffect(() => {
      if (!initializing) {
        fetchAll();
      }
    }, [fetchAll, initializing]);

    const fetchAll = useCallback(() => {
      if (isConnected) {
        fetchAllProductsLayout();
      }
    }, [fetchAllProductsLayout, isConnected]);

    const onScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              y: scrollAnimation,
            },
          },
        },
      ],
      {useNativeDriver: true},
    );

    const {layoutVerticalLayout} = AppConfig;

    return (
      <AnimatedFlatList
        data={layout}
        keyExtractor={(item, index) => `h_${index}`}
        renderItem={({item, index}) => {
          return (
            <ListItem
              key={`hList-${index}`}
              item={item}
              index={index}
              language={language}
              showCategoriesScreen={showCategoriesScreen}
              onViewProductScreen={onViewProductScreen}
              onShowAll={onShowAll}
            />
          );
        }}
        ListHeaderComponent={() => (
          <>
            {!Config.Layout.HideHomeLogo && <Header />}
            {typeof listHeaderComponentExtra === 'function'
              ? listHeaderComponentExtra()
              : listHeaderComponentExtra || null}
          </>
        )}
        ListFooterComponent={() => (
          <>
            {typeof layoutVerticalLayout !== 'undefined' && layoutVerticalLayout.layout === 'circleCategory' && (
              <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                {/* <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333'}}>
                  Categories
                </Text> */}
                {/* <Categories
                  items={language.lang === Constants.Languages.en ? Config.HomeCategories : Config.HomeCategories_AR}
                  onPress={(category) => {
                    // Handle category press
                    console.log('Category pressed:', category);
                  }}
                  config={{column: 1}}
                /> */}
              </View>
            )}
            {typeof layoutVerticalLayout !== 'undefined' && layoutVerticalLayout.layout !== 'circleCategory' && (
              <PostList
                parentLayout={layoutVerticalLayout.layout}
                headerLabel="Categories"
                onViewProductScreen={onViewProductScreen}
              />
            )}
            
            {/* ID Card Section */}
            <IDCard 
              onPress={() => {
                console.log('ID Card pressed');
                // Navigate to profile or member details
              }}
            />
          </>
        )}
        scrollEventThrottle={1}
        refreshing={isFetching}
        contentContainerStyle={styles.mainList}
        {...{onScroll}}
        refreshControl={
          <RefreshControl
            tintColor={text}
            refreshing={isFetching}
            progressViewOffset={30}
            onRefresh={fetchAll}
          />
        }
      />
    );
  },
);

export default withTheme(HorizonList);
