<template>
  <div
    class="card"
    :class="{ active, interacting, loading }"
    ref="card"
    :style="styles"
    :data-number="number"
    :data-subtypes="subtypes"
    :data-supertype="supertype"
    :data-rarity="rarity"
    :data-gallery="gallery"
  >
    <div class="card__translater">
      <button
        class="card__rotator"
        ref="rotator"
        @pointermove="interact"
        @mouseout="interactEnd"
        aria-label="Expand the Pokemon Card; {name}."
      >
        <img
          class="card__back"
          :src="back_img"
          alt="The back of a Pokemon Card, a Pokeball in the center with Pokemon logo above and below"
        />
        <div class="card__front">
          <img
            :src="front_img"
            v-on:load="imageLoader"
            :alt="`Front design of the ${name} Pokemon Card, with the stats and info around the edge`"
          />
          <card-shine :subtypes="subtypes" :supertype="supertype" />
          <card-glare :subtypes="subtypes" :rarity="rarity" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSpring } from "@vueuse/motion";
import { clamp, round } from "@/helpers/Math";
import { ref, onMounted, onUnmounted, watch, reactive } from "vue";
import CardShine from "@/components/card-shine.vue";
import CardGlare from "@/components/card-glare.vue";

const props = defineProps({
  img: String,
  name: String,
  number: Number,
  supertype: String,
  backimg: String,
  subtypes: Array,
  rarity: String,
  gallery: Boolean,
  active: Boolean,
});

let thisCard = ref(null);
let rotator = ref(null);

let springR = { stiffness: 666, damping: 25 };
let springD = { stiffness: 333, damping: 45 };

let springRotate = useSpring({ x: 0, y: 0 }, springR);
let springGlare = useSpring({ x: 50, y: 50, o: 0 }, springR);
let springBackground = useSpring({ x: 50, y: 50 }, springR);

let springRotateDelta = useSpring({ x: 0, y: 0 }, springD);
let springTranslate = useSpring({ x: 0, y: 0 }, springD);
let springScale = useSpring({ s: 1 }, springD);

let firstPop = true;
let interacting = false;
let loading = true;
let debounce;
let back_loading;
let front_loading;
let front_img = "";
let back_img = props.backimg;

// Your methods here...

</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";
@import "../assets/css/cards.scss";
:root {
  --mx: 50%;
  --my: 50%;
  --s: 1;
  --o: 0;
  --tx: 0px;
  --ty: 0px;
  --rx: 0deg;
  --ry: 0deg;
  --pos: 50% 50%;
  --posx: 50%;
  --posy: 50%;
  --hyp: 0;
}

.card {
  --radius: 4.55% / 3.5%;
  --back: #004177;
  --glow: #69d1e9;
  z-index: calc(var(--s) * 100);
  transform: translate3d(0, 0, 0.1px);
  will-change: transform, visibility;
  transform-style: preserve-3d;
  width: 300px;

  &.interacting {
    z-index: calc(var(--s) * 120);
  }

  &.active {
    .card__translater,
    .card__rotator {
      touch-action: none;
    }

    .card__rotator {
      box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow),
        0 0 30px 0px var(--glow);
    }

    .card__rotator:focus {
      box-shadow: 0px 10px 30px 3px black;
    }
  }

  &.loading {
    .card__front {
      opacity: 0;
    }

    .card__back {
      transform: rotateY(0deg);
    }
  }
}

.card__translater,
.card__rotator {
  display: grid;
  perspective: 600px;
  transform-origin: center;
  -webkit-transform-origin: center;
  will-change: transform;
}

.card__translater {
  width: auto;
  position: relative;
  transform: translate3d(var(--tx), var(--ty), 0) scale(var(--s));
  -webkit-transform: translate3d(var(--tx), var(--ty), 0) scale(var(--s));
}

.card__rotator {
  transform: rotateY(var(--rx)) rotateX(var(--ry));
  transform-style: preserve-3d;
  box-shadow: 0px 10px 20px -5px black;
  border-radius: var(--radius);
  outline: none;
  transition: box-shadow 0.4s ease, outline 0.2s ease;
  appearance: none;
  border: none;
  background: top;
  padding: 0;

  &:focus {
    box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow),
      0 0 30px 0px var(--glow);
  }

  * {
    width: 100%;
    display: grid;
    grid-area: 1/1;
    border-radius: var(--radius);
    image-rendering: optimizeQuality;
    transform-style: preserve-3d;
  }

  img {
    outline: 1px solid transparent;
    aspect-ratio: 0.716;
    height: auto;
  }

  .card__back {
    background-color: var(--back);
    transform: rotateY(180deg) translateZ(1px);
    backface-visibility: visible;
  }

  .card__front {
    opacity: 1;
    transition: opacity 0.33s ease-out;
  }
}
</style>
