/*
 * HAPTIC FEEDBACK - IMPLEMENTATION EXAMPLES
 * These are real examples from your portfolio components
 *
 * EXAMPLE 1: Simple Button Click (Hero Social Icons)
 *
 * <motion.div
 *   onMouseEnter={() => setHoveredIcon('email')}
 *   onMouseLeave={() => setHoveredIcon(null)}
 *   onClick={() => triggerHaptic('medium')}  // ← Feel the click!
 *   onTouchStart={() => triggerHaptic('light')}  // ← Feel touch on mobile!
 *   className="cursor-pointer"
 * >
 *   <Mail size={26} />
 * </motion.div>
 */

/*
 * EXAMPLE 2: Form Input with Focus Feedback (Contact)
 *
 * <motion.input
 *   type="text"
 *   id="name"
 *   onFocus={() => triggerHaptic('selection')}  // ← Feel when field is active
 *   onChange={handleChange}
 *   placeholder="Your Name"
 * />
 */

/*
 * EXAMPLE 3: Conditional Haptic Feedback (Poetry Like Button)
 *
 * <motion.button
 *   onClick={() => {
 *     // Different feedback depending on action
 *     triggerHaptic(liked.includes(poemIndex) ? 'light' : 'medium');
 *     toggleLike(poemIndex);
 *   }}
 *   onTouchStart={() => triggerHaptic('selection')}
 * >
 *   <Heart size={18} />
 *   Like
 * </motion.button>
 */

/*
 * EXAMPLE 4: Success/Error Patterns (Contact Form)
 *
 * const handleSubmit = async (e: React.FormEvent) => {
 *   e.preventDefault();
 *   setStatus('submitting');
 *   triggerHaptic('medium');  // ← Feel the submit start
 *
 *   try {
 *     const response = await fetch(API_URL, { // config // });
 *
 *     if (response.ok) {
 *       setStatus('success');
 *       triggerHaptic('success');  // ← [10,50,10]ms - Double tap feel
 *       setFormData({ name: '', email: '', message: '' });
 *     } else {
 *       setStatus('error');
 *       triggerHaptic('error');  // ← [20,100,20,100,20]ms - Alert pattern
 *     }
 *   } catch (error) {
 *     triggerHaptic('error');  // ← Triple pulse for errors
 *   }
 * };
 */

/*
 * EXAMPLE 5: Navigation with Haptic (Navbar Items)
 *
 * const scrollToSection = (section: string) => {
 *   triggerHaptic('selection');  // ← Subtle navigation feedback
 *
 *   // Navigate to section...
 *   setTimeout(() => {
 *     const element = document.getElementById(section.toLowerCase());
 *     if (element) {
 *       element.scrollIntoView({ behavior: 'smooth' });
 *     }
 *   }, 300);
 * };
 *
 * Usage:
 * {navItems.map((item) => (
 *   <motion.button
 *     onClick={() => scrollToSection(item)}
 *     onTouchStart={() => triggerHaptic('selection')}
 *   >
 *     {item}
 *   </motion.button>
 * ))}
 */

/*
 * EXAMPLE 6: Card Interaction (Poetry Poem Cards)
 *
 * <motion.div
 *   onClick={() => {
 *     triggerHaptic('medium');  // ← Feel the card open
 *     openPoem(poemIndex);
 *   }}
 *   onTouchStart={() => triggerHaptic('light')}  // ← Pre-feedback on touch
 *   className="cursor-pointer"
 *   whileHover={{ scale: 1.15 }}
 * >
 *   <Quote className="quote-icon" />
 *   <h4>{poem.title}</h4>
 *   <p>{getSnippet(poem.lines)}</p>
 *
 *   <motion.button
 *     onClick={(e) => {
 *       e.stopPropagation();
 *       triggerHaptic(liked.includes(poemIndex) ? 'light' : 'medium');
 *       toggleLike(poemIndex);
 *     }}
 *     onTouchStart={(e) => {
 *       e.stopPropagation();
 *       triggerHaptic('selection');
 *     }}
 *   >
 *     <Heart size={18} />
 *     Like
 *   </motion.button>
 * </motion.div>
 */

/*
 * EXAMPLE 7: Hover Feedback (Skills Badges)
 *
 * <motion.div
 *   whileHover={{ scale: 1.1 }}  // Visual feedback
 *   onHoverStart={() => triggerHaptic('light')}  // ← Tactile feedback
 *   onTouchStart={() => triggerHaptic('selection')}  // Mobile equivalent
 *   className="px-3 py-2 bg-muted rounded-md cursor-pointer"
 * >
 *   {skill}
 * </motion.div>
 */

/*
 * EXAMPLE 8: Theme Toggle (Navbar)
 *
 * <motion.button
 *   whileHover={{ scale: 1.1, rotate: 180 }}
 *   whileTap={{ scale: 0.9 }}
 *   onClick={() => {
 *     toggleDarkMode();
 *     triggerHaptic('medium');  // ← Feel the toggle
 *   }}
 *   onTouchStart={() => triggerHaptic('selection')}
 * >
 *   {darkMode ? <Sun size={20} /> : <Moon size={20} />}
 * </motion.button>
 */

/*
 * EXAMPLE 9: Modal Actions (Poetry Full View)
 *
 * Close button:
 * <motion.button
 *   onClick={() => {
 *     triggerHaptic('medium');  // ← Feel close action
 *     closePoem();
 *   }}
 *   onTouchStart={() => triggerHaptic('light')}
 *   whileHover={{ scale: 1.08, rotate: 90 }}
 *   whileTap={{ scale: 0.92 }}
 * >
 *   <X size={20} />
 * </motion.button>
 *
 * Share button:
 * <motion.button
 *   onClick={() => {
 *     triggerHaptic('medium');  // ← Feel share start
 *     sharePoem(selectedPoem);
 *   }}
 *   onTouchStart={() => triggerHaptic('light')}
 *   whileHover={{ scale: 1.06 }}
 *   whileTap={{ scale: 0.94 }}
 * >
 *   <Share2 size={18} />
 *   Share link
 * </motion.button>
 */

/*
 * EXAMPLE 10: List/Menu Toggle (Mobile Menu)
 *
 * <button 
 *   onClick={() => {
 *     setIsMobileMenuOpen(!isMobileMenuOpen);
 *     triggerHaptic('light');  // ← Feel menu open/close
 *   }}
 *   onTouchStart={() => triggerHaptic('selection')}
 * >
 *   {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
 * </button>
 */
