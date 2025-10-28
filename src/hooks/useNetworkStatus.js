import {useState, useEffect, useRef} from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [networkError, setNetworkError] = useState(false);
  const previousStatus = useRef({isConnected: true, isInternetReachable: true});

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newIsConnected = state.isConnected;
      const newIsInternetReachable = state.isInternetReachable;
      
      console.log('🔍 Network status:', {
        isConnected: newIsConnected,
        isInternetReachable: newIsInternetReachable,
        wasConnected: previousStatus.current.isConnected,
        wasInternetReachable: previousStatus.current.isInternetReachable
      });
      
      // Check if we just came back online
      const justCameOnline = 
        (!previousStatus.current.isConnected && newIsConnected) ||
        (!previousStatus.current.isInternetReachable && newIsInternetReachable);
      
      if (justCameOnline) {
        console.log('🌐 Network status changed: Internet is back!');
        setWasOffline(true);
        setRefreshKey(prev => prev + 1); // Force re-render
        setNetworkError(false); // Clear any previous errors
        // Reset after a short delay to allow components to react
        setTimeout(() => setWasOffline(false), 3000); // Increased delay
      }
      
      // Check if we just went offline
      const justWentOffline = 
        (previousStatus.current.isConnected && !newIsConnected) ||
        (previousStatus.current.isInternetReachable && !newIsInternetReachable);
      
      if (justWentOffline) {
        console.log('📵 Network status changed: Internet is offline!');
        setWasOffline(false);
        setNetworkError(true);
      }
      
      setIsConnected(newIsConnected);
      setIsInternetReachable(newIsInternetReachable);
      
      // Update previous status
      previousStatus.current = {
        isConnected: newIsConnected,
        isInternetReachable: newIsInternetReachable
      };
    });

    return () => unsubscribe();
  }, []);

  return {
    isConnected,
    isInternetReachable,
    isOffline: !isConnected || !isInternetReachable,
    justCameOnline: wasOffline,
    refreshKey,
    networkError,
    setNetworkError
  };
};

export default useNetworkStatus;
