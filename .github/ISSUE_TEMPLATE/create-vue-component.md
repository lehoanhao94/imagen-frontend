---
name: 🧩 Create New Vue Component
about: AI Agent task to create new Nuxt Vue components
title: '[Component] Create [COMPONENT_NAME] component'
labels: ['component', 'ai-agent', 'vue', 'nuxt']
assignees: ''
---

## 🎯 AI Agent Task

Create a new Vue component following project conventions and best practices.

## 📋 Component Specification

**Component Name:** <!-- e.g., BaseButton, AIToolCard, ProfileAvatar -->
**Location:** <!-- e.g., app/components/base/, app/components/ai-tool/ -->
**Type:** <!-- Base/Feature/Layout/Page -->
**Priority:** <!-- High/Medium/Low -->

## 🔧 Component Requirements

### Functionality
- [ ] **Purpose:** <!-- Brief description of component functionality -->
- [ ] **Props:** <!-- List expected props with types -->
- [ ] **Events:** <!-- List emitted events -->
- [ ] **Slots:** <!-- List available slots -->

### UI/UX
- [ ] **Responsive:** Mobile-first design
- [ ] **Accessibility:** ARIA labels, keyboard navigation
- [ ] **Theme:** Support light/dark mode
- [ ] **Animation:** Follow project animation preferences

## 🛠️ AI Agent Instructions

### 1. Component Structure
```vue
<template>
  <!-- Use semantic HTML -->
  <!-- Follow project UI patterns -->
  <!-- Include proper ARIA attributes -->
</template>

<script setup lang="ts">
// TypeScript interfaces for props
// Composables (useI18n, useColorMode, etc.)
// Component logic
</script>

<style scoped>
/* Tailwind CSS classes preferred */
/* Custom CSS only when necessary */
</style>
```

### 2. Naming Conventions
- **File:** PascalCase (e.g., `BaseButton.vue`)
- **Component:** PascalCase in template
- **Props:** camelCase
- **Events:** kebab-case
- **CSS Classes:** Follow Tailwind/project conventions

### 3. Project Integration
- [ ] Use existing UI components (UButton, UCard, etc.)
- [ ] Follow component directory structure
- [ ] Implement i18n for user-facing text
- [ ] Use project composables and utilities
- [ ] Match existing component patterns

### 4. Required Features
- [ ] **TypeScript:** Proper type definitions
- [ ] **Internationalization:** Use `$t()` for text
- [ ] **Responsiveness:** Mobile-first approach
- [ ] **Accessibility:** WCAG compliance
- [ ] **Performance:** Optimized rendering

## 📁 File Structure

```
app/components/[category]/
├── ComponentName.vue
└── [category]/
    └── ComponentSubComponent.vue (if needed)
```

**Categories:**
- `base/` - Reusable UI components
- `ai-tool/` - AI functionality components  
- `layout/` - Layout-specific components
- `landing/` - Landing page components
- `profile/` - User profile components
- `buy-credits/` - Payment/credits components

## 🎨 Design Guidelines

### Styling
- **Primary:** Tailwind CSS classes
- **Colors:** Use project color palette
- **Spacing:** Follow project spacing scale
- **Typography:** Use project font system
- **Shadows:** Apply project shadow effects

### Animation
- **Duration:** 0.5s delay, 1s duration (user preference)
- **Easing:** Smooth transitions
- **Loading:** Follow project loading patterns
- **Hover:** Subtle interactive effects

## ✅ AI Agent Checklist

### Development
- [ ] Create component file in correct directory
- [ ] Implement TypeScript interfaces
- [ ] Add proper prop validation
- [ ] Include event emissions
- [ ] Add slot definitions
- [ ] Implement responsive design
- [ ] Add accessibility features
- [ ] Include i18n support

### Testing
- [ ] Component renders correctly
- [ ] Props work as expected
- [ ] Events emit properly
- [ ] Responsive on all devices
- [ ] Accessible with screen readers
- [ ] Theme switching works
- [ ] No console errors/warnings

### Documentation
- [ ] Add JSDoc comments
- [ ] Document props and events
- [ ] Include usage examples
- [ ] Add component to relevant index

## 📋 Expected Output

### Component File
```vue
<!-- Well-structured Vue component -->
<!-- Following project conventions -->
<!-- With proper TypeScript support -->
```

### Integration
- Component properly integrated into project
- Follows existing patterns and conventions
- Ready for immediate use
- Documented and tested

## 🚀 AI Agent Notes

- **Reuse:** Check existing components before creating new ones
- **Consistency:** Follow established project patterns
- **Performance:** Optimize for fast rendering
- **Maintainability:** Write clean, readable code
- **Future-proof:** Consider extensibility and reusability

## 📖 Reference

**Existing Components:** Check `app/components/` for patterns
**UI Library:** Project uses Nuxt UI components
**Styling:** Tailwind CSS + custom project styles
**State:** Pinia for global state management
**Router:** Nuxt auto-routing system
