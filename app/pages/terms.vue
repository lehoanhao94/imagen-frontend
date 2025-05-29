<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Service - Imagen',
  description: 'Terms and conditions for using Imagen services',
  ogTitle: 'Terms of Service - Imagen',
  ogDescription: 'Terms and conditions for using Imagen services'
})
</script>

<template>
  <UPage>
    <div class="mt-30 w-20 h-20 mx-auto animate__animated animate__zoomInDown">
      <BaseLogo
        id="main-logo"
        :loading="false"
        :class="{ 'logo-loading animate__pulse': false }"
        class="animate__animated animate__infinite"
      />
    </div>
    <UPageHero
      title="Terms of Service"
      description="Terms and conditions for using Imagen services"
    />
    <UPageSection>
      <div class="prose dark:prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Imagen services, you accept and agree to be
          bound by the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use Imagen services for personal,
          non-commercial transitory viewing only. This is the grant of a
          license, not a transfer of title.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          The materials on Imagen's services are provided on an 'as is' basis.
          Imagen makes no warranties, expressed or implied, and hereby disclaims
          all other warranties.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall Imagen or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit)
          arising out of the use or inability to use the materials on Imagen's
          services.
        </p>

        <h2>5. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account and password and for restricting access to your account.
        </p>

        <h2>6. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us at legal@imagen.ai
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>
