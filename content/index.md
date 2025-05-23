---
seo:
  title: Image Generation API Documentation
  description: Powerful AI Image Generation API - Create stunning images from text prompts and transform existing images with state-of-the-art AI models.
---

::u-page-hero
---
orientation: horizontal
---
  :::prose-pre
  ---
  code: |
    curl -X POST https://api.imagen.ai/v1/text-to-image \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_API_KEY" \
      -d '{
        "prompt": "A beautiful sunset over mountains",
        "model": "imagen-v2",
        "width": 1024,
        "height": 1024,
        "steps": 30
      }'
  filename: Terminal
  ---
  ```bash
  curl -X POST https://api.imagen.ai/v1/text-to-image \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -d '{
      "prompt": "A beautiful sunset over mountains",
      "model": "imagen-v2",
      "width": 1024,
      "height": 1024,
      "steps": 30
    }'
  ```
  :::

#title
Build amazing apps with Image Generation API

#description
Generate stunning images from text prompts, transform existing images, and create variations with our powerful AI image generation API. Built for developers, designed for scale.

#links
  :::u-button
  ---
  size: xl
  to: /getting-started
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-lucide-image
  size: xl
  target: _blank
  to: https://imagen.ai/playground
  variant: subtle
  ---
  Try in Playground
  :::
::

::u-page-section
#title
Powerful Image Generation API

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /api-reference
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore API Reference
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-type
  to: /api-reference/text-to-image
  ---
  #title
  Text to Image

  #description
  Generate stunning images from text prompts using state-of-the-art AI models.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-image
  to: /api-reference/image-to-image
  ---
  #title
  Image to Image

  #description
  Transform existing images with AI-powered modifications and style transfers.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-shuffle
  to: /api-reference/variations
  ---
  #title
  Image Variations

  #description
  Create multiple variations of an existing image with different styles.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-cpu
  to: /api-reference/models
  ---
  #title
  Multiple Models

  #description
  Choose from various AI models optimized for different use cases and styles.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-zap
  to: /getting-started/quickstart
  ---
  #title
  Fast & Reliable

  #description
  High-performance API with 99.9% uptime and sub-second response times.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-shield-check
  to: /getting-started/authentication
  ---
  #title
  Secure

  #description
  Enterprise-grade security with API key authentication and rate limiting.
  :::
::

::u-page-section
  :::u-page-c-t-a
  ---
  links:
    - label: Get API Key
      to: https://imagen.ai/dashboard/api-keys
      target: _blank
      icon: i-lucide-key
      color: primary
    - label: View Pricing
      to: https://imagen.ai/pricing
      trailingIcon: i-lucide-arrow-right
      target: _blank
      color: neutral
      variant: subtle
  description: Start generating images today with our free tier. No credit card required to get started.
  title: Ready to start creating amazing images?
  variant: subtle
  ---
  :::
::
