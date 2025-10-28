/** @format */

import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {withTheme} from '@common';

const FlashSaleCountdown = ({theme, style, isActive: propIsActive, skipFetch = false}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFlashSaleStatus = useCallback(async () => {
    // Skip fetching if propIsActive is provided (used by FlashSaleHeader)
    if (skipFetch && propIsActive !== undefined) {
      console.log('FlashSaleCountdown: Using propIsActive =', propIsActive);
      setIsActive(propIsActive);
      setLoading(false);

      // If active, fetch time data only
      if (propIsActive) {
        console.log('FlashSaleCountdown: Fetching time data...');
        try {
          const response = await fetch('https://doseofbeauty.id/wp-json/flash-sale/v1/status');
          if (response.ok) {
            const data = await response.json();
            console.log('FlashSaleCountdown: API response =', data);

            if (data.active && data.ends_at) {
              const serverTime = new Date(data.server_time);
              const endTime = new Date(data.ends_at);
              const timeDiff = endTime.getTime() - serverTime.getTime();

              console.log('FlashSaleCountdown: Time calculation - Server:', serverTime, 'End:', endTime, 'Diff:', timeDiff);

              if (timeDiff > 0) {
                setTimeLeft(timeDiff);
                console.log('FlashSaleCountdown: Time left set to:', timeDiff);
              } else {
                console.log('FlashSaleCountdown: Time diff <= 0, flash sale ended');
                setTimeLeft(null);
              }
            } else {
              console.log('FlashSaleCountdown: API says not active or no end_time');
              setTimeLeft(null);
            }
          } else {
            console.log('FlashSaleCountdown: API response not ok');
            setTimeLeft(null);
          }
        } catch (error) {
          console.log('FlashSaleCountdown: Error fetching time:', error);
          setTimeLeft(null);
        }
      } else {
        console.log('FlashSaleCountdown: Not fetching time because propIsActive is false');
      }
      return;
    }

    // Original fetch logic (when used independently)
    try {
      const response = await fetch('https://doseofbeauty.id/wp-json/flash-sale/v1/status');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.active && data.ends_at) {
        setIsActive(true);
        const serverTime = new Date(data.server_time);
        const endTime = new Date(data.ends_at);
        const timeDiff = endTime.getTime() - serverTime.getTime();

        if (timeDiff > 0) {
          setTimeLeft(timeDiff);
        } else {
          setIsActive(false);
          setTimeLeft(null);
        }
      } else {
        setIsActive(false);
        setTimeLeft(null);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsActive(false);
      setTimeLeft(null);
    }
  }, [skipFetch, propIsActive]);

  useEffect(() => {
    fetchFlashSaleStatus();

    // Refresh every 30 seconds
    const interval = setInterval(fetchFlashSaleStatus, 30000);

    return () => clearInterval(interval);
  }, [fetchFlashSaleStatus]);

  useEffect(() => {
    if (!isActive || !timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1000) {
          setIsActive(false);
          return null;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const formatTime = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return null;

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  // For debugging - always show a simple indicator first
  // console.log('FlashSaleCountdown render state:', { loading, isActive, timeLeft });
  
  // Always show something for debugging
  if (loading) {
    return (
      <View style={[styles.container, styles.inactiveContainer, style]}>
        <Text style={[styles.timeText, styles.inactiveText]}>⏳</Text>
      </View>
    );
  }

  if (!isActive) {
    // console.log('Flash sale is not active');
    // Return null to avoid taking up space when flash sale is not active
    // But only if we're fetching independently (not when propIsActive is used)
    if (!skipFetch) {
      return null;
    }
    // When skipFetch is true, let the parent component handle visibility
  }

  const time = formatTime(timeLeft);

  if (!timeLeft) {
    console.log('FlashSaleCountdown: No timeLeft, timeLeft =', timeLeft, 'skipFetch =', skipFetch);
    // Return null to avoid taking up space when flash sale is not active
    // But only if we're fetching independently (not when propIsActive is used)
    if (!skipFetch) {
      return null;
    }
    // When skipFetch is true, show loading state instead
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.timeText}>⏰</Text>
      </View>
    );
  }

  if (!time) {
    console.log('FlashSaleCountdown: No time from formatTime, timeLeft =', timeLeft);
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.timeText}>⏰</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.timeBlock}>
        <Text style={styles.timeText}>
          {time.hours}
        </Text>
      </View>
      <Text style={styles.separator}>:</Text>
      <View style={styles.timeBlock}>
        <Text style={styles.timeText}>
          {time.minutes}
        </Text>
      </View>
      <Text style={styles.separator}>:</Text>
      <View style={styles.timeBlock}>
        <Text style={styles.timeText}>
          {time.seconds}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  inactiveContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  timeBlock: {
    alignItems: 'center',
    minWidth: 25,
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  inactiveText: {
    fontSize: 16,
    color: '#999',
  },
  labelText: {
    fontSize: 7,
    textAlign: 'center',
    marginTop: 1,
    color: '#fff',
  },
  separator: {
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 2,
    color: '#fff',
  },
});

export default withTheme(FlashSaleCountdown);
