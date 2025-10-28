/** @format */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, ActivityIndicator} from 'react-native';
import {withTheme, Fonts} from '@common';
import CacheService from '@services/CacheService';

const {width} = Dimensions.get('window');

const AnnouncementTicker = ({theme = {}, endpoint}) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const translateX = useRef(new Animated.Value(width)).current;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const url = `${endpoint}/wp-json/mytheme/v1/announcement`;
      const json = await CacheService.fetchWithCache(
        'announcement_cache',
        url,
        { ttlMs: 6 * 60 * 60 * 1000 }
      );
      let message = '';
      if (typeof json === 'string') {
        message = json;
      } else if (Array.isArray(json)) {
        message = json
          .map(item =>
            typeof item === 'string'
              ? item
              : item?.message || item?.title || ''
          )
          .filter(Boolean)
          .join(' • ');
      } else if (json && typeof json === 'object') {
        message = json.textarea || json.text || json.message || json.title || '';
      }
      if (message && message.trim().length > 0) {
        // Decode unicode escape sequences
        const decodedMessage = message.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
          return String.fromCharCode(parseInt(code, 16));
        });
        setText(decodedMessage.trim());
      }
    } catch (e) {
      // keep previous message on error
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!text) return;
    translateX.setValue(width);
    const looping = Animated.loop(
      Animated.timing(translateX, {
        toValue: -width * 2,
        duration: 25000,
        useNativeDriver: true,
      }),
      {resetBeforeIteration: true},
    );
    looping.start();
    return () => looping.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (loading && !text) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background || '#fff'}]}> 
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

  if (!text) return null;

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background || '#fff'}]}> 
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            color: theme.colors.text,
            transform: [{translateX}],
          },
        ]}>
        {text}   {text}   {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    position: 'absolute',
    left: 0,
    fontSize: 13,
    fontWeight: '500',
    width: width * 3,
    fontFamily: Fonts.medium,
  },
});

export default withTheme(AnnouncementTicker);


