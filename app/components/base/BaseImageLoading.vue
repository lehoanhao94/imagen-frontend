<template>
  <a
    class="card"
    href="#"
  >
    <p>
      Generating image...
    </p>
  </a>
</template>

<style lang="css" scoped>
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0turn;
  inherits: false;
}

.card {
  animation: 2s gradient-angle infinite linear;
  border: 2px solid transparent;
  background-image: linear-gradient(#584827, #2d230f),
    conic-gradient(
      from var(--gradient-angle),
      #584827 0%,
      #c7a03c 37%,
      #f9de90 30%,
      #c7a03c 33%,
      #584827 40%,
      #584827 50%,
      #c7a03c 77%,
      #f9de90 80%,
      #c7a03c 83%,
      #584827 90%
    );
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
}

@keyframes gradient-angle {
  to {
    --gradient-angle: 1turn;
  }
}

.card {
  display: grid;
  max-width: 240px;
  padding: 20px;
  text-decoration: none;
  color: currentColor;
  border-radius: 20px;
  place-content: center;
  place-items: center;
  aspect-ratio: 1/1;
  row-gap: 16px;
}

.card h2 {
  font-family: "Comfortaa", sans-serif;
  font-size: 18px;
  font-weight: 700;
  font-style: normal;
  font-optical-sizing: auto;
}

.card p {
  font-size: 12px;
}
</style>
