# Requirements Document

## Introduction

Redesign the AuralEdge e-commerce homepage to pixel-match a specific design reference image. The site is a Next.js 15 application using Tailwind CSS 4, Poppins font, and a dark theme with orange/amber gradient accents. The redesign covers all visible homepage sections: Hero, Best Value carousel, Highlight Product, Collection grid, Testimonials, and CTA. All existing functionality (cart, navigation, Strapi CMS data) must be preserved while updating the visual presentation to match the reference.

## Glossary

- **Homepage**: The main landing page of the AuralEdge e-commerce site rendered at the root route (`/`)
- **Hero_Section**: The top-most visual section containing the dramatic "AURALEDGE" heading, central silhouette figure, product info cards, and call-to-action elements
- **Navbar**: The fixed navigation header containing logo, navigation links, search bar, and cart icon
- **BestValue_Carousel**: A horizontally navigable product carousel section with large faded "BEST VALUE" background text
- **Collection_Grid**: A responsive grid of product cards with images, feature chips, pricing, and buy buttons
- **Testimonials_Section**: A section displaying customer reviews with star ratings, quotes, and user avatars
- **CTA_Section**: A call-to-action banner with descriptive text and an "Explore Collection" button
- **Highlight_Section**: A section showcasing a featured product with detailed description and imagery
- **Silhouette_Figure**: The central hero image (`/assets/silueta.png`) depicting a person with orange/amber glow and concentric circles
- **Logo_Image**: The brand logo image (`/assets/logo.jpg`) displayed in the Navbar
- **Product_Card**: A UI component displaying a product's image, name, features, price, and purchase action
- **Avatar_Stack**: A group of overlapping circular avatars representing customer count
- **Design_Reference**: The target visual composition the homepage must replicate
- **Cart_Drawer**: The slide-out panel showing items added to the shopping cart
- **Feature_Chip**: A small pill-shaped label displaying a product feature attribute

## Requirements

### Requirement 1: Navbar Visual Layout

**User Story:** As a visitor, I want to see a polished navigation bar with the AuralEdge logo image, navigation links, search bar, and cart icon, so that I can easily navigate the site.

#### Acceptance Criteria

1. THE Navbar SHALL display the Logo_Image (`/assets/logo.jpg`) alongside the "AURALEDGE" brand text, where the logo image includes an accessible alt attribute describing the brand
2. THE Navbar SHALL render navigation links in the following order: Home, Feature, Highlight Product, Collection, Testimonials
3. THE Navbar SHALL include a search input field with placeholder text "Are you looking for...", a maximum input length of 100 characters, and a gradient-styled search button adjacent to the input
4. THE Navbar SHALL display a cart icon button that opens the Cart_Drawer when clicked, and WHEN the cart contains one or more items, THE Navbar SHALL display a badge on the cart icon showing the current item count
5. WHILE the page is scrolled past 20 pixels, THE Navbar SHALL apply a background with at least 90% opacity, a backdrop blur effect, and a visible bottom border to distinguish it from page content
6. WHEN a navigation link's corresponding section is the lowest section whose top edge is within 120 pixels above the current scroll position, THE Navbar SHALL highlight that link with a gradient underline indicator
7. WHILE the viewport width is below the large breakpoint (1024px), THE Navbar SHALL collapse navigation links behind a hamburger menu button, and WHEN the hamburger menu button is clicked, THE Navbar SHALL toggle visibility of the navigation links in a vertical dropdown panel

### Requirement 2: Hero Section Layout

**User Story:** As a visitor, I want to see a dramatic hero section with the AURALEDGE heading, central silhouette figure, and product information cards, so that I am immediately engaged by the brand.

#### Acceptance Criteria

1. THE Hero_Section SHALL display "AURALEDGE" as a gradient heading at the top of the section, rendered as the largest text element within the section (minimum font size of 60px, scaling up to 180px based on viewport width)
2. THE Hero_Section SHALL render the Silhouette_Figure (`/assets/silueta.png`) as the central visual element with an orange/amber glow effect and a concentric circle overlay positioned around the head area of the figure
3. THE Hero_Section SHALL display a left-positioned card containing the heading "Experience Sound Without Limits", a descriptive tagline paragraph (maximum 200 characters), a "Shop Now" button that triggers Add to Cart for the featured product, a "5.0" numeric rating with 5 filled star icons, and an Avatar_Stack of at least 3 circular avatars with a "Customer Ratings" label
4. THE Hero_Section SHALL display a right-positioned card containing the featured product name, product image, battery life statistic displaying "{batteryHours}+ Hours Battery Life" (defaulting to "40+" when product data is unavailable), noise cancellation statistic displaying "{noiseCancelling}% Noise Cancellation Accuracy" (defaulting to "99%" when product data is unavailable), and a "See Product" button linking to the product highlight section
5. THE Hero_Section SHALL display an "Explore Collection" button at the bottom center of the section, linking to the collection section
6. THE Hero_Section SHALL display a "30K+ Satisfied Customers Worldwide" indicator with an Avatar_Stack of at least 3 circular avatars at the bottom right of the section
7. WHILE the viewport width is below the large breakpoint (1024px), THE Hero_Section SHALL stack all cards and elements vertically in a single-column layout instead of using absolute positioning

### Requirement 3: Best Value Carousel Section

**User Story:** As a visitor, I want to browse featured products in a carousel format, so that I can discover highlighted value products easily.

#### Acceptance Criteria

1. THE BestValue_Carousel SHALL display large faded "BEST VALUE" text in the background behind the carousel content with a font size scaling from 48px to 120px based on viewport width and an opacity of approximately 10%
2. THE BestValue_Carousel SHALL render left and right navigation arrow buttons with gradient backgrounds, each button at least 46px in width and height with rounded corners
3. WHEN the next arrow button is clicked, THE BestValue_Carousel SHALL advance to the next product slide, wrapping to the first slide after the last
4. WHEN the previous arrow button is clicked, THE BestValue_Carousel SHALL return to the previous product slide, wrapping to the last slide when at the first
5. THE BestValue_Carousel SHALL display each Product_Card with: product image (minimum height 180px), product name, description, Feature_Chips, price formatted as "$X.YY" with dollars in large text and cents in superscript, and an "Add To Cart" button
6. WHEN a product has a badge attribute, THE BestValue_Carousel SHALL display the badge as a gradient pill positioned in the top-right corner of the product card
7. THE BestValue_Carousel SHALL auto-advance to the next slide every 5 seconds when more than one product exists
8. IF only one product exists, THEN THE BestValue_Carousel SHALL display that product without navigation arrows or auto-advance behavior

### Requirement 4: Highlight Product Section

**User Story:** As a visitor, I want to see a detailed highlight of a featured product, so that I can understand its value proposition before exploring the collection.

#### Acceptance Criteria

1. THE Highlight_Section SHALL display a "Highlight Product" badge label with gradient background styling and pill shape
2. THE Highlight_Section SHALL display the heading "Hear Every Detail. Feel Every Beat." with a minimum font size of 30px scaling up to 48px based on viewport width
3. THE Highlight_Section SHALL display a descriptive paragraph about the product experience with a maximum width of 480px and muted text color
4. THE Highlight_Section SHALL include an "Explore Collection" button with a gradient background and arrow icon (↗) that navigates to the collection section when clicked
5. THE Highlight_Section SHALL render the featured product image in a rounded container (22px border radius) with a minimum height of 400px, a radial gradient overlay, and a glow box-shadow effect
6. WHILE the viewport width is at or above the large breakpoint (1024px), THE Highlight_Section SHALL display content and image side by side in a two-column grid layout

### Requirement 5: Collection Grid Section

**User Story:** As a visitor, I want to browse all available products in a grid layout, so that I can find and purchase headphones that match my preferences.

#### Acceptance Criteria

1. THE Collection_Grid SHALL display the heading "Discover Our Collection" with the word "Collection" rendered in gradient text, followed by a descriptive subtitle paragraph
2. THE Collection_Grid SHALL render products in a responsive grid layout using auto-fit columns with a minimum card width of 240 pixels and a maximum of 1fr, so that cards reflow automatically based on viewport width
3. THE Collection_Grid SHALL display each Product_Card with: product image (fixed height of 200 pixels with overflow hidden), product name, subtitle, Feature_Chips (displayed as a horizontally-wrapping set of small labeled badges representing product attributes such as "40h Battery" or "Hi-Res Audio"), price formatted as "$X.YY" with dollars in large text and cents in superscript, and a "Buy Now" button that adds the product to the cart
4. WHEN a product has a tag attribute, THE Collection_Grid SHALL display the tag as a label positioned in the top-left corner of the product image area with a rounded-full pill shape and a semi-transparent panel background
5. WHEN a Product_Card is hovered, THE Collection_Grid SHALL translate the card upward by 6 pixels and change the card border color to orange at 40% opacity, with a transition duration of 200 milliseconds
6. THE Collection_Grid SHALL include a "View All Collection" outlined button centered below the product grid that navigates to the collection section anchor
7. IF the products list is empty, THEN THE Collection_Grid SHALL render the section heading and subtitle without displaying any product cards or error states

### Requirement 6: Testimonials Section

**User Story:** As a visitor, I want to read customer testimonials, so that I can gain confidence in the product quality before purchasing.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL display the heading "Loved by Thousands" with "Thousands" rendered in gradient text, followed by a descriptive subtitle paragraph
2. THE Testimonials_Section SHALL render testimonial cards in a responsive grid using a minimum card width of 280 pixels that auto-fits available columns to the container width
3. THE Testimonials_Section SHALL display each testimonial card with: a star rating on a 1-to-5 scale rendered in amber color (rounded to the nearest whole star), quoted review text, user avatar (circular, 44×44 pixels), user name, and user role
4. IF a testimonial has no avatar image available, THEN THE Testimonials_Section SHALL display a circular gradient placeholder in place of the avatar
5. THE Testimonials_Section SHALL display a minimum of 3 and a maximum of 12 testimonial cards in the grid
6. THE Testimonials_Section SHALL include a "Read More Reviews" outlined button centered below the testimonials grid that navigates to the testimonials section anchor

### Requirement 7: CTA Section

**User Story:** As a visitor, I want to see a compelling call-to-action banner, so that I am motivated to explore the product collection.

#### Acceptance Criteria

1. THE CTA_Section SHALL display the heading "Hear Every Detail. Feel Every Beat." on a red gradient background within a container with a maximum width of 1280px and rounded corners of 28px
2. THE CTA_Section SHALL display a descriptive paragraph about the sound experience with a maximum width of 400px and semi-transparent text color (opacity approximately 85%)
3. THE CTA_Section SHALL include an "Explore Collection" button with dark background styling and an arrow icon (↗) that navigates to the collection section (#collection) when clicked
4. THE CTA_Section SHALL render a radial glow visual element (warm-toned radial gradient) occupying the right column of the banner with a minimum height of 220px on small viewports and 300px on viewports at or above the large breakpoint (1024px)
5. WHEN the viewport width is below the large breakpoint (1024px), THE CTA_Section SHALL stack the text content above the radial glow element in a single-column layout

### Requirement 8: Dark Theme and Visual Styling

**User Story:** As a visitor, I want the homepage to have a cohesive dark theme with orange/amber gradient accents, so that the visual experience feels premium and immersive.

#### Acceptance Criteria

1. THE Homepage SHALL use `#0a0705` as the base background color with at least one radial gradient overlay using orange-spectrum colors (hues between `#ff3d00` and `#ffb020`) at an opacity no greater than 0.20
2. THE Homepage SHALL apply the Poppins font family (weights 400 through 900) as the primary typeface for all text elements, loaded via `next/font/google` with `display: swap` to prevent invisible text during font load
3. THE Homepage SHALL use the gradient palette `#ff7a18`, `#ff3d00`, and `#ffb020` for accent elements including buttons, badges, and highlighted text, applied as CSS linear-gradient or background-clip text fills
4. THE Homepage SHALL render card surfaces with semi-transparent gradient backgrounds (maximum opacity 0.14 for orange tones) and a visible border using `rgba(255, 140, 40, 0.14)` with a minimum border width of 1px
5. THE Homepage SHALL apply a glow box-shadow effect using `rgba(255, 80, 0, 0.35)` with a minimum blur radius of 30px to at least one prominent visual element per viewport-visible section (Hero, Best Value, or CTA)
6. WHEN the Homepage is rendered, THE Homepage SHALL maintain a minimum contrast ratio of 4.5:1 between body text (`#f4ede6`) and the base background color (`#0a0705`), and a minimum of 3:1 for large text and UI accent elements against their adjacent backgrounds
7. IF the Poppins font fails to load, THEN THE Homepage SHALL fall back to `system-ui, sans-serif` without layout shift or invisible text persisting beyond the font swap period

### Requirement 9: Responsive Layout

**User Story:** As a visitor on any device, I want the homepage to adapt gracefully to different screen sizes, so that I have a consistent experience on mobile, tablet, and desktop.

#### Acceptance Criteria

1. WHILE the viewport width is below 1024 pixels, THE Hero_Section SHALL stack the left card, central figure, and right card vertically in a single-column layout
2. WHILE the viewport width is below 1024 pixels, THE Navbar SHALL collapse navigation links into a mobile menu accessible via a hamburger button that toggles a vertical dropdown panel
3. THE Collection_Grid SHALL reflow product cards from multi-column to single-column as viewport width decreases below 480 pixels (single card fills full width)
4. THE CTA_Section SHALL stack the text content and visual element vertically on viewports below 1024 pixels
5. THE BestValue_Carousel product card SHALL switch from a three-column grid (image | info | price) to a stacked single-column layout on viewports below 768 pixels

### Requirement 10: Preserve Existing Functionality

**User Story:** As a returning user, I want all existing cart and navigation functionality to continue working after the redesign, so that my shopping experience is uninterrupted.

#### Acceptance Criteria

1. WHEN the "Shop Now" or "Add To Cart" button is clicked, THE Homepage SHALL add the corresponding product to the Cart_Drawer and automatically open the Cart_Drawer to display the newly added item
2. WHEN a navigation link is clicked, THE Homepage SHALL smooth-scroll to the corresponding section (Home, Feature, Highlight Product, Collection, Testimonials) using the defined section anchor IDs
3. WHEN the Homepage loads and the Strapi CMS is reachable, THE Homepage SHALL fetch and display product data from the Strapi CMS
4. IF the Strapi CMS is unreachable or returns no product data, THEN THE Homepage SHALL fall back to displaying the built-in mock data set without showing an error to the user
5. WHEN the cart icon in the Navbar is clicked, THE Homepage SHALL open the Cart_Drawer displaying all current cart items with their names, quantities, and unit prices, and the computed total price
6. THE Homepage SHALL persist cart contents to localStorage so that items are retained across page reloads and browser sessions
7. THE Homepage SHALL maintain the auto-advance carousel behavior in the BestValue_Carousel, cycling to the next slide every 5 seconds when more than one product is present

### Requirement 11: Silhouette Figure Integration

**User Story:** As a brand stakeholder, I want the hero section to prominently feature the silhouette image with a distinctive orange glow effect, so that the visual identity matches the approved design reference.

#### Acceptance Criteria

1. THE Hero_Section SHALL render the `/assets/silueta.png` image as the central figure within the hero container, displayed at a minimum height of 360px on viewports below 1024px and a minimum height of 520px on viewports of 1024px and above
2. THE Hero_Section SHALL apply a radial gradient glow in orange/amber tones (using color values within the #FF7A18 to #FFBE3C range) behind the Silhouette_Figure, with the glow origin positioned at approximately 50% horizontal and 46% vertical within the figure container
3. THE Hero_Section SHALL display at least one concentric circle decoration positioned at approximately 50% horizontal and 44% vertical of the figure container (the head area of the Silhouette_Figure), using a visible circular border of at least 8px width in amber tone with an outer box-shadow glow of at least 40px spread
4. THE Silhouette_Figure SHALL be horizontally centered within the hero figure container using auto margins or equivalent centering, and scaled proportionally to the container dimensions while preserving its aspect ratio
5. IF the `/assets/silueta.png` image fails to load, THEN THE Hero_Section SHALL still render the figure container with its background gradient and glow effect visible, maintaining the layout dimensions

### Requirement 12: Logo Integration in Navbar

**User Story:** As a brand stakeholder, I want the official logo image displayed in the navigation bar, so that the brand identity is clearly visible across all pages.

#### Acceptance Criteria

1. THE Navbar SHALL render the `/assets/logo.jpg` image at a fixed height of 30 pixels with automatic width scaling to preserve the original aspect ratio
2. THE Navbar SHALL position the Logo_Image immediately to the left of the "AURALEDGE" brand text, vertically centered within the brand link, with a gap of 8 pixels between the image and the text
3. THE Navbar SHALL apply a border-radius of 50% (fully circular clip) to the Logo_Image
4. THE Navbar SHALL provide an alt attribute with the value "AURALEDGE logo" on the Logo_Image for accessibility
5. IF the `/assets/logo.jpg` image fails to load, THEN THE Navbar SHALL continue to display the "AURALEDGE" brand text without layout shift
