# PalmKeys-Web

Turn your hand into a virtual keyboard using hand pose detection! PalmKeys-Web is a progressive web app that transforms each non-thumb phalanx of your hands into virtual keys that can be "pressed" by your thumbs.

## Features

- Real-time hand tracking using MediaPipe Hands
- Virtual key press detection based on 3D distance between thumb and phalanges
- Visual feedback with Canvas overlay
- Works in Safari on iPad Pro (landscape mode)
- PWA support for home screen installation
- Demo mode for testing without camera

## Requirements

- Node.js 18+
- pnpm
- iPad Pro with Safari (for actual use)
- Any modern browser (for development)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Usage

1. Grant camera permissions when prompted
2. Position your iPad ~0.8m away in landscape mode
3. Your hands should be clearly visible in the front camera
4. Touch phalanges with your thumbs to trigger virtual key presses
5. View press events in the console log

## Demo Mode

Append `?demo=true` to the URL to run with prerecorded hand tracking data.

## Technical Notes

- Assumes ~0.8m hand-to-camera distance (1 px ≈ 0.5 mm)
- Press detection threshold: 8mm between thumb tip and phalanx
- Runs at 30 fps max for thermal management
- Requires HTTPS for camera access

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. Builds the app with `pnpm build`
2. Generates the PWA icon
3. Deploys to GitHub Pages
4. Enables HTTPS automatically

You can access the deployed version at: https://[your-username].github.io/palmkeys-web/

## TODO

- [ ] Character/key mapping
- [ ] N-gram language model
- [ ] Haptic feedback
- [ ] Customizable press zones
- [ ] Hand size calibration
