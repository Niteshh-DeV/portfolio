/**
 * Custom hook for haptic feedback on mobile devices
 * Supports modern mobile browsers with Vibration API
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

const hapticPatterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  error: [20, 100, 20, 100, 20],
  selection: 5,
};

export const useHaptic = () => {
  const isHapticSupported = (): boolean => {
    return 'vibrate' in navigator;
  };

  const triggerHaptic = (pattern: HapticPattern = 'light') => {
    if (!isHapticSupported()) return;

    try {
      const vibrationPattern = hapticPatterns[pattern];
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      // Silently fail if vibration is not supported or blocked
      console.debug('Haptic feedback not available:', error);
    }
  };

  const cancelHaptic = () => {
    if (isHapticSupported()) {
      navigator.vibrate(0);
    }
  };

  return {
    triggerHaptic,
    cancelHaptic,
    isHapticSupported: isHapticSupported(),
  };
};

// Standalone function for use without hooks
export const haptic = (pattern: HapticPattern = 'light') => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(hapticPatterns[pattern]);
    } catch (error) {
      console.debug('Haptic feedback not available:', error);
    }
  }
};
