# 🤚 Phalange Detector - XR Text Input Prototype

A revolutionary text input concept for XR/VR devices that uses finger segments (phalanges) as dynamic keypads controlled by thumb gestures.


## 💡 The Concept

Current XR text input methods are cumbersome - requiring virtual keyboards or air-typing. This prototype explores a new paradigm:

- **Open palms** serve as dynamic keyboards
- **12 finger segments** (3 phalanges × 4 fingers) act as buttons
- **Thumbs** are used to "press" these segments
- **Natural hand position** allows for fast, eyes-free typing

## 🔬 Research Context

This addresses a key bottleneck preventing XR adoption: efficient text input. The phalange-based approach could enable:
- Rapid text input without looking away from XR content
- No external hardware required
- Muscle memory development for blind typing
- Expandable to palm areas and gesture modifiers

## 🛠️ Technology Stack

- **Hand Tracking**: Google MediaPipe for real-time hand landmark detection
- **Computer Vision**: JavaScript/Canvas for proximity detection and visualization
- **Web Technologies**: HTML5, WebRTC for camera access
- **Deployment**: GitHub Pages with HTTPS for mobile compatibility

## 📱 Mobile Testing

Optimized for iPhone Safari testing:
- Front-facing camera hand tracking
- Touch-friendly interface
- Haptic feedback on target detection
- Performance optimizations for mobile processors
- Visual proximity indicators

## 🎯 Current Features

- [x] Real-time hand landmark detection
- [x] Phalange segment visualization
- [x] Thumb-to-segment proximity detection
- [x] Mobile-optimized interface
- [x] Visual feedback system
- [ ] Letter mapping to segments
- [ ] Touch gesture recognition
- [ ] Text input functionality
- [ ] Palm area expansion
- [ ] Gesture modifiers (caps, numbers, symbols)

## 📊 Testing Instructions

1. **Open the demo** on your mobile device
2. **Grant camera permission** when prompted
3. **Hold your hand** 12-18 inches from front camera
4. **Open palm facing camera** with fingers spread
5. **Move your thumb** close to different finger segments
6. **Watch for yellow highlighting** when segments are targeted

### Visual Guide:
- 🟢 **Green dots**: Hand landmarks detected
- 🔵 **Blue rectangles**: Phalange "buttons" 
- 🔴 **Red circle**: Your thumb position
- 🟡 **Yellow highlight**: Target detected!

## 🔮 Future Development

### Phase 1: Enhanced Detection
- Improved gesture recognition algorithms
- Better proximity thresholds
- Multiple hand support

### Phase 2: Text Input System
- Letter-to-phalange mapping
- Word prediction integration
- Typing speed optimization

### Phase 3: Advanced Features
- Palm area button expansion
- Swipe gestures for navigation
- Modifier gestures (shift, ctrl, etc.)
- Custom keyboard layouts

### Phase 4: XR Integration
- Unity/Unreal Engine plugins
- Vision Pro compatibility
- Meta Quest integration
- Haptic feedback systems

## 🧪 Experiment Results

*Document your testing results here as you iterate*

### Usability Findings:
- [ ] Most accessible phalange segments
- [ ] Optimal hand-to-camera distance
- [ ] Lighting condition requirements
- [ ] User fatigue factors

### Technical Performance:
- [ ] Detection accuracy rates
- [ ] False positive/negative analysis
- [ ] Battery usage on mobile
- [ ] Processing latency measurements

## 🤝 Contributing

This is an experimental prototype exploring a novel XR input paradigm. Feedback and suggestions welcome!

### Areas for Contribution:
- Algorithm improvements for gesture detection
- UI/UX enhancements for mobile testing
- Performance optimizations
- Integration with existing XR frameworks

## 📄 License

MIT License - Feel free to experiment and build upon this concept

## 🔗 Related Research

- [Facebook Reality Labs Hand Tracking Research](https://research.facebook.com/publications/)
- [DigitSpace: Thumb-to-finger interfaces](https://dl.acm.org/doi/10.1145/2984511.2984546)
- [MediaPipe Hand Tracking Documentation](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)

---

**Built with** ❤️ **for the future of XR interaction**

*This prototype represents early-stage research into novel XR input methods. The goal is to validate the core interaction concept before developing production-ready implementations.*
