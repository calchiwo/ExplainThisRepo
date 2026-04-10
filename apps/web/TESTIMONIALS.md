# Testimonials Component Documentation

## Overview

The Testimonials component (`components/testimonials.tsx`) displays an infinite horizontal scrolling carousel of embedded tweets. It's designed as a social proof section for the homepage and renders real Twitter/X embeds with automatic looping animation.

## Features

- **Infinite Scrolling Animation**: Seamless horizontal scroll that loops continuously without jumping or flickering
- **Responsive Design**: Adapts to all screen sizes (desktop: 3-5 cards, tablet: 2-3 cards, mobile: 1-2 cards)
- **Pause on Hover**: Animation pauses when user hovers over the carousel (desktop only)
- **Reduced Motion Support**: Respects user's `prefers-reduced-motion` OS setting for accessibility
- **Real Twitter Embeds**: Uses official Twitter/X embed script for authenticity and engagement stats
- **Performance Optimized**: Uses requestAnimationFrame for smooth 60fps animations
- **Dark Theme Support**: Automatically adapts to theme with proper gradient edge fading

## Adding/Updating Tweets

### Step 1: Get Tweet URLs

1. Navigate to the tweet you want to add on Twitter/X
2. Copy the full URL (e.g., `https://x.com/i/status/2012857527596368113`)

### Step 2: Update the TWEET_URLS Array

Open `components/testimonials.tsx` and locate the `TWEET_URLS` array at the top of the file:

```typescript
const TWEET_URLS = [
  'https://x.com/i/status/2012857527596368113',
  'https://x.com/i/status/2011027691047465031',
  // Add more URLs here...
]
```

### Step 3: Save and Test

- Add or remove tweet URLs as needed
- The component will automatically update with your changes
- No additional configuration needed

## How It Works

### Infinite Looping Implementation

The component achieves seamless infinite scrolling by:

1. **Duplication**: The tweet list is rendered twice in the DOM (original + duplicate)
2. **Continuous Scroll**: A `requestAnimationFrame` loop increments the horizontal scroll position
3. **Seamless Reset**: When scroll reaches the duplicated section, it resets to position 0
4. **User Detection**: Hover and reduced-motion states prevent animation to improve UX

```typescript
// The scroll container has this structure:
// [Original Tweets 1-15] [Duplicated Tweets 1-15]
//
// Animation flow:
// Scroll 0 → Scroll Width/2 → Reset to 0 (seamless)
```

### Performance Considerations

- **requestAnimationFrame**: Syncs with browser's refresh rate for smooth motion
- **CSS `transform: translateX`**: Uses GPU acceleration (note: we use `scrollLeft` instead for simplicity)
- **Lazy Loading**: Twitter script loads tweets on-demand
- **No Jank**: Scroll position reset happens during the duplicate section for invisible transitions

## Customization

### Scroll Speed

To adjust animation speed, modify the scroll increment in `testimonials.tsx`:

```typescript
const scroll = () => {
  if (!isHovering) {
    scrollPosition += 1  // Increase for faster, decrease for slower
    // ...
  }
}
```

Recommended values:
- `scrollPosition += 0.5`: Very slow (comfortable for reading)
- `scrollPosition += 1`: Default (medium speed)
- `scrollPosition += 2`: Fast (quick scanning)

### Card Styling

Cards are styled in the `TweetCard` component with Tailwind classes:

```typescript
className="h-full rounded-xl border border-border bg-card p-6 hover:shadow-md transition-all duration-300 hover:border-primary/50 cursor-pointer"
```

Customize colors, padding, shadows, and borders here.

### Spacing

Adjust gap between cards:

```typescript
<div className="flex gap-6 overflow-x-auto">  // Change `gap-6` to desired spacing
```

## Responsive Breakpoints

The component uses Tailwind's responsive design:

- **Mobile**: `w-full` (full width, 1-2 cards visible)
- **Tablet**: `sm:w-96` (384px cards, 2-3 visible)
- **Desktop**: `sm:w-96` (384px cards, 3-5 visible depending on screen)

To adjust card widths, modify the `TweetCard` className:

```typescript
className="group flex-shrink-0 w-full sm:w-96"
// Change `w-full` for mobile, `sm:w-96` for larger screens
```

## Accessibility Features

### Reduced Motion

Automatically respects the user's operating system preference for reduced motion:

```typescript
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
```

When enabled, the carousel won't animate at all.

### Keyboard Navigation

- Tab through tweets to navigate
- Enter or Space to open tweet in new tab (handled by Next.js Link component)

### Screen Readers

Each tweet card is a clickable link with proper `rel="noopener noreferrer"` for security.

## Browser Support

- Chrome/Edge: Full support with smooth scrolling
- Firefox: Full support
- Safari: Full support (uses `-webkit-overflow-scrolling: touch`)
- Mobile browsers: Full support with touch support

## Troubleshooting

### Tweets Not Loading

1. **Check Twitter Script**: Ensure the Twitter widget script is loaded in `layout.tsx`:
   ```typescript
   <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
   ```

2. **Network**: Check browser console for 404 errors loading the widget script

3. **Tweet URL Format**: Ensure URLs match format: `https://x.com/i/status/{ID}`

### Animation Stuttering

1. Check browser DevTools Performance tab for frame drops
2. Reduce scroll increment value (change `scrollPosition += 1` to `scrollPosition += 0.5`)
3. Check for heavy re-renders elsewhere on page

### Overflow/Scroll Overflow Issues

If you see unwanted scrollbars:

1. Ensure `.scrollbar-hide` class is applied (it is by default)
2. Check for conflicting CSS in parent containers
3. Add `overflow: hidden` to parent if needed

## Integration with Homepage

The Testimonials section is positioned in `app/page.tsx` between:
- **Before**: MoreFeatures section
- **After**: Install section

To move it to a different position, simply reorder the components in `page.tsx`.

## Future Enhancements

Potential improvements:

- Add pause button for manual control
- Implement pagination/dots navigation
- Add filters by topic or author
- Integrate with Twitter API for dynamic loading
- Add video/media support for rich tweets
- Implement analytics tracking for clicks

## Support

For issues or questions:

1. Check the browser console for JavaScript errors
2. Verify Twitter script is loading: Network tab → `widgets.js`
3. Ensure all dependencies are installed: `npm install` or `pnpm install`

---

**Last Updated**: 2026-04-10  
**Component Version**: 1.0  
**Dependencies**: React, Next.js, Tailwind CSS
