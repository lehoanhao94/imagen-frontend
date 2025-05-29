<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy - Imagen',
  description: 'Learn how we protect your privacy and handle your data',
  ogTitle: 'Privacy Policy - Imagen',
  ogDescription: 'Learn how we protect your privacy and handle your data'
})
</script>

<template>
  <UPage>
    <div
      class="mt-30 w-20 h-20 mx-auto animate__animated animate__zoomInDown"
    >
      <BaseLogo
        id="main-logo"
        :loading="false"
        :class="{ 'logo-loading animate__pulse': false }"
        class="animate__animated animate__infinite"
      />
    </div>
    <UPageHero
      title="Privacy Policy"
      description="Learn how we protect your privacy and handle your data"
    />
    <UPageSection>
      <div class="prose dark:prose-invert max-w-none">
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, use our services, or contact us for support.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, process transactions, and communicate with you.
        </p>

        <h2>Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          policy.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information against unauthorized access, alteration, disclosure, or
          destruction.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at privacy@imagen.ai
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>
