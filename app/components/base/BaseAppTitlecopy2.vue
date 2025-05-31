<script setup lang="ts">
// Using $t() directly in the template
</script>

<template>
  <h1 class="font-bold gradient-text">
    {{ $t('appName') }}
  </h1>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Caveat|Righteous&display=swap");

h1 {
  font-family: "Righteous", cursive;
}
/* Tutorial on https://fossheim.io/writing/posts/css-text-gradient. */

.gradient-text {
  /* Create the gradient. */
  background-image: linear-gradient(
    45deg,
    #f6339a 16.666%,
    #e16541 16.666%,
    #e16541 33.333%,
    #f18f43 33.333%,
    #f18f43 50%,
    #8b9862 50%,
    #8b9862 66.666%,
    #476098 66.666%,
    #476098 83.333%,
    #a7489b 83.333%
  );

  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Animate the text when loading the element. */
  /* This animates it on page load and when hovering out. */
  animation: rainbow-text-simple-animation-rev 0.75s ease forwards;
}

.gradient-text:hover {
  animation: rainbow-text-simple-animation 0.5s ease-in forwards;
}

/* Move the background and make it smaller. */
/* Animation shown when entering the page and after the hover animation. */
@keyframes rainbow-text-simple-animation-rev {
  0% {
    background-size: 650%;
  }
  40% {
    background-size: 650%;
  }
  100% {
    background-size: 100%;
  }
}

/* Move the background and make it larger. */
/* Animation shown when hovering over the text. */
@keyframes rainbow-text-simple-animation {
  0% {
    background-size: 100%;
  }
  80% {
    background-size: 650%;
  }
  100% {
    background-size: 650%;
  }
}

/* Style the rest of the page. */
body {
  background-color: #fdf1f0;
}

header {
  margin-top: 1em;
  margin-top: calc(50vh - 3em);
}

h1 {
  text-align: center;
  cursor: pointer;
}
</style>
