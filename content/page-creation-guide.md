# Guide: Creating New Pages

This guide explains how to create new pages in the Imagen frontend application for AI Agents and developers.

## Overview

The Imagen frontend is built with Nuxt 3 and uses a file-based routing system. Pages are located in the `/app/pages/` directory.

## Page Creation Template

### 1. Basic Page Structure

All pages should follow this basic template:

```vue
<script setup lang="ts">
// Optional: Add authentication check if needed
// const { $auth } = useNuxtApp()
// if (!$auth.user) {
//   throw createError({
//     statusCode: 401,
//     statusMessage: 'Unauthorized'
//   })
// }

// SEO Configuration
useSeoMeta({
  title: 'Page Title - Imagen',
  description: 'Page description for SEO',
  ogTitle: 'Page Title - Imagen',
  ogDescription: 'Page description for SEO'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Page Title"
      description="Page description"
    />
    <UPageSection>
      <!-- Page content goes here -->
    </UPageSection>
  </UPage>
</template>
```

### 2. Directory Structure

- **Simple pages**: Create directly in `/app/pages/` as `.vue` files
  - Example: `/app/pages/pricing.vue` → Route: `/pricing`
  
- **Nested pages**: Create directories with `index.vue` files
  - Example: `/app/pages/profile/index.vue` → Route: `/profile`
  - Additional files: `/app/pages/profile/settings.vue` → Route: `/profile/settings`

### 3. Layout Configuration

By default, pages use the `default` layout. To specify a different layout:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'layoutName' // Options: 'default', 'auth', 'docs'
})
</script>
```

Available layouts:
- **default**: Main site layout with header and footer
- **auth**: Authentication pages layout
- **docs**: Documentation layout with sidebar

### 4. Adding Navigation Links

To add pages to the main navigation, edit `/app/utils/links.ts`:

```typescript
export const navLinks: NavigationMenuItem[] = [
  // ... existing links
  {
    label: 'New Page',
    icon: 'i-lucide-icon-name',
    to: '/new-page'
  }
]
```

### 5. Adding Footer Links

To add pages to the footer, edit `/app/app.config.ts`:

```typescript
footer: {
  links: [
    // ... existing links
    {
      'label': 'New Page',
      'to': '/new-page',
      'aria-label': 'New Page Description'
    }
  ]
}
```

### 6. SEO Best Practices

Always include SEO meta tags:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Descriptive Title - Imagen',
  description: 'Clear description under 160 characters',
  ogTitle: 'Descriptive Title - Imagen',
  ogDescription: 'Clear description under 160 characters'
})
</script>
```

### 7. Page Components

Use Nuxt UI components for consistency:

- `<UPage>`: Page container
- `<UPageHero>`: Page header section
- `<UPageSection>`: Content sections
- `<UButton>`: Buttons
- `<ULink>`: Links
- `<UAlert>`: Alerts/notifications

### 8. Authentication Requirements

For protected pages, add authentication checks:

```vue
<script setup lang="ts">
// Example authentication check
// const { $auth } = useNuxtApp()
// if (!$auth.user) {
//   throw createError({
//     statusCode: 401,
//     statusMessage: 'Unauthorized'
//   })
// }
</script>
```

## Quick Checklist

When creating a new page:

- [ ] Create `.vue` file in appropriate `/app/pages/` location
- [ ] Use default layout (or specify different layout if needed)
- [ ] Add SEO meta tags with `useSeoMeta()`
- [ ] Use `<UPage>`, `<UPageHero>`, and `<UPageSection>` structure
- [ ] Add navigation links if the page should be in menu
- [ ] Add footer links if appropriate (privacy, terms, etc.)
- [ ] Update auth page references if relevant
- [ ] Test the page loads correctly

## Example Pages

Reference these existing pages for examples:
- `/app/pages/about.vue` - Content-driven page
- `/app/pages/pricing.vue` - Simple static page
- `/app/pages/profile/index.vue` - Nested page with form
- `/app/pages/auth/login.vue` - Authentication page with different layout

## Common Patterns

### Static Information Page
```vue
<template>
  <UPage>
    <UPageHero title="Page Title" description="Page description" />
    <UPageSection>
      <div class="prose dark:prose-invert max-w-none">
        <!-- Content with proper typography -->
      </div>
    </UPageSection>
  </UPage>
</template>
```

### Form Page
```vue
<template>
  <UPage>
    <UPageHero title="Form Title" description="Form description" />
    <UPageSection>
      <div class="max-w-2xl mx-auto">
        <!-- Form content -->
      </div>
    </UPageSection>
  </UPage>
</template>
```

This guide should be sufficient for AI Agents to create new pages following the established patterns in the Imagen frontend application.