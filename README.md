# Foodie - Food Delivery App

A fully responsive food delivery landing page built with React TypeScript.

## Features

- ✨ Fully responsive design (mobile, tablet, desktop)
- 🛒 Interactive shopping cart with add/remove items
- 🎨 Modern UI with smooth animations
- 📱 Mobile-first approach
- 🍔 Popular dishes showcase
- 💳 Checkout functionality
- 🔍 Search functionality

## Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: Below 480px

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Technologies Used

- React 18
- TypeScript
- Lucide React (for icons)
- CSS3 with Flexbox and Grid
- Mobile-first responsive design

## Project Structure

```
src/
├── FoodDeliveryApp.tsx    # Main component
├── FoodDeliveryApp.css    # Responsive styles
├── App.tsx                # Root component
├── App.css                # App styles
├── index.tsx              # Entry point
└── index.css              # Global styles
```

## Key Features

### Header
- Sticky navigation
- Responsive mobile menu
- Cart button with item count badge

### Hero Section
- Eye-catching headline
- Search functionality
- Call-to-action buttons
- Hero image

### Popular Dishes
- Grid layout (responsive)
- Hover effects
- Card-based design

### Shopping Cart
- Slide-in cart sidebar
- Add/remove items
- Quantity controls
- Subtotal calculation
- Checkout button

### Promo Section
- Special offer display
- Promotional content
- Call-to-action

## Responsive Features

### Mobile (< 768px)
- Hamburger menu
- Stacked hero layout
- Single column dish grid
- Full-width cart drawer
- Touch-friendly buttons

### Tablet (768px - 1024px)
- Adjusted grid columns
- Optimized spacing
- Balanced layouts

### Desktop (> 1024px)
- Multi-column grids
- Side-by-side layouts
- Full navigation menu
- Floating cart sidebar

## Customization

### Colors
Main brand color: `#FF6B35` (Orange)
You can customize colors in `FoodDeliveryApp.css`:

```css
.btn-primary {
  background: #FF6B35; /* Change to your brand color */
}
```

### Images
Replace placeholder images with your own:
- Update Unsplash URLs in `FoodDeliveryApp.tsx`
- Or use local images from `/public/images/`

### Menu Items
Edit the `menuItems` array in `FoodDeliveryApp.tsx`:

```typescript
const menuItems: MenuItem[] = [
  { id: 1, name: 'Your Item', price: 9.99, image: 'path/to/image' },
  // Add more items
];
```

## Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images
- Smooth animations (60fps)
- Lazy loading ready
- Minimal re-renders

## License

MIT License - feel free to use for personal or commercial projects.

## Author

Built with ❤️ for modern food delivery experiences.
