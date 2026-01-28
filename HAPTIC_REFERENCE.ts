/*
 * QUICK REFERENCE GUIDE FOR ADDING HAPTIC FEEDBACK TO NEW COMPONENTS
 *
 * Step 1: Import the hook at the top of your component
 *   import { useHaptic } from '@/hooks/useHaptic';
 *
 * Step 2: Initialize the hook in your component
 *   const { triggerHaptic } = useHaptic();
 *
 * Step 3: Add haptic feedback to interactive elements
 *   Use patterns below based on your component type
 *
 * PATTERN 1: Button Click Feedback
 *   <motion.button
 *     onClick={() => {
 *       triggerHaptic('light');
 *       // ... your action code
 *     }}
 *     onTouchStart={() => triggerHaptic('selection')}
 *   >
 *     Click Me
 *   </motion.button>
 *
 * PATTERN 2: Form Input Focus
 *   <input
 *     onFocus={() => triggerHaptic('selection')}
 *   />
 *
 * PATTERN 3: Hover Feedback (Desktop)
 *   <motion.div
 *     onHoverStart={() => triggerHaptic('light')}
 *     whileHover={{ scale: 1.05 }}
 *   >
 *     Hover over me
 *   </motion.div>
 *
 * PATTERN 4: Success/Error Feedback
 *   <motion.button
 *     onClick={async () => {
 *       try {
 *         await submitForm();
 *         triggerHaptic('success');
 *       } catch (error) {
 *         triggerHaptic('error');
 *       }
 *     }}
 *   >
 *     Submit
 *   </motion.button>
 *
 * PATTERN 5: Card/List Item Interaction
 *   <motion.div
 *     onClick={() => {
 *       triggerHaptic('medium');
 *       handleCardClick();
 *     }}
 *     onTouchStart={() => triggerHaptic('light')}
 *   >
 *     Card Content
 *   </motion.div>
 */

/*
 * HAPTIC PATTERN REFERENCE
 *
 * 'light'     - 10ms pulse - Light interactions, hovers
 * 'medium'    - 20ms pulse - Main button actions, card clicks
 * 'heavy'     - 30ms pulse - Reserved for critical actions
 * 'success'   - [10,50,10] - Form submission success, positive feedback
 * 'error'     - [20,100,20,100,20] - Errors, failed actions
 * 'selection' - 5ms pulse  - Navigation, selection, focus
 *
 * BEST PRACTICES:
 * 1. Use 'selection' for navigation and focus events
 * 2. Use 'light' for hover and subtle interactions
 * 3. Use 'medium' for main action buttons
 * 4. Use 'success'/'error' for form feedback
 * 5. Add onTouchStart handler for mobile, separate from onClick
 * 6. Don't trigger haptics on every mousemove (battery drain)
 * 7. Combine haptics with animations for better UX
 *
 * COMMON PATTERNS BY COMPONENT TYPE:
 *
 * Navigation Button:
 *   triggerHaptic('selection');
 *   navigate('/page');
 *
 * Like/Favorite Button:
 *   triggerHaptic(isLiked ? 'light' : 'medium');
 *   toggleLike();
 *
 * Expand/Collapse:
 *   triggerHaptic('light');
 *   setExpanded(!expanded);
 *
 * Delete/Dangerous Action:
 *   triggerHaptic('medium');
 *   if (confirm('Are you sure?')) {
 *     triggerHaptic('success');
 *     handleDelete();
 *   }
 *
 * Form Field Focus:
 *   triggerHaptic('selection');
 *
 * Modal Open/Close:
 *   Modal Open: triggerHaptic('light')
 *   Modal Close: triggerHaptic('medium')
 *
 * Scroll to Section:
 *   triggerHaptic('selection');
 *   scrollToElement();
 *
 * ACCESSIBILITY NOTE:
 * Haptic feedback enhances but doesn't replace visual feedback.
 * Always ensure your UI is usable without haptics for:
 * - Users with vibration disabled
 * - Desktop users
 * - Users with accessibility needs
 *
 * Combine haptics with:
 * - Visual animations (scale, color change)
 * - Toast notifications
 * - Cursor changes
 * - Sound effects (optional)
 *
 * TESTING CHECKLIST:
 * ✓ Test on actual mobile device (iOS and Android)
 * ✓ Verify haptics disabled gracefully (no errors)
 * ✓ Check browser console for warnings
 * ✓ Test with vibration disabled in settings
 * ✓ Test in low-power/battery saver mode
 * ✓ Verify performance (no jank, smooth animations)
 * ✓ Check that visual feedback works without haptics
 */
