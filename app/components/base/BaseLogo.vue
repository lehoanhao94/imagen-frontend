<template>
  <div class="circulate">
    <div class="circle mx-auto">
      <div class="wave _one" />
      <div class="wave _two" />
      <div class="wave _three" />
      <div class="reflection" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.circulate .circle {
  width: 90px;
  height: 90px;
  border-radius: 100%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: white;
  /* Enhanced shadow for crystal ball effect */
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 0 120px rgba(142, 45, 226, 0.2),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg,
    rgba(35, 52, 93, 0.9),
    rgba(146, 22, 100, 0.9));
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
  /* Glass effect */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  /* Add subtle glow */
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
  /* Add depth with a subtle 3D transform */
  transform: perspective(800px) rotateX(10deg);
  transition: transform 0.3s ease;

  &:hover {
    transform: perspective(800px) rotateX(5deg) scale(1.02);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 20%,
      transparent 60%
    );
    border-radius: 100%;
    z-index: 2;
    pointer-events: none;
  }
}

.circulate .wave {
  opacity: 0.4;
  position: absolute;
  top: 3%;
  left: 50%;
  background: rgba(15, 16, 35, 0.56);
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -155px;
  transform-origin: 50% 48%;
  border-radius: 43%;
  animation: humming 2.5s infinite linear;
  /* Add glow to waves */
  filter: blur(1px);
}

.circulate .wave._three {
  animation: humming 5000ms infinite linear;
  opacity: 0.5;
  filter: blur(2px);
}

.circulate .wave._two {
  animation: humming 9000ms infinite linear;
  opacity: 0.8;
  background: rgba(15, 16, 35, 0.7);
  filter: blur(0.5px);
}

.circulate .box:after {
  content: "";
  display: block;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
  transform: translate3d(0, 0, 0);
}

/* Light reflection effect */
.circulate .reflection {
  position: absolute;
  width: 30%;
  height: 15%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  top: 15%;
  left: 15%;
  transform: rotate(-40deg);
  filter: blur(2px);
  animation: moveReflection 8s infinite ease-in-out;
  z-index: 3;
}

.circulate .title {
  position: absolute;
  left: 0;
  top: 20px;
  width: 100%;
  z-index: 1;
  line-height: 30px;
  text-align: center;
  transform: translate3d(0, 0, 0);
  color: white;
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  letter-spacing: 0.4em;
  font-size: 24px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  text-indent: 0.3em;
}

@keyframes humming {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes moveReflection {
  0%, 100% {
    opacity: 0.7;
    transform: rotate(-40deg) translateY(0);
  }
  50% {
    opacity: 0.9;
    transform: rotate(-35deg) translateY(5px);
  }
}
</style>
