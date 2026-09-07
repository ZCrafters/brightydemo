"use client";

import { cn } from "../../lib/cn";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

// Port dari ui-layouts `carousel` (MIT) ke JSX + Tailwind v3 + tema Glow Brighty:
// - Hilangkan varian `dark:`, sintaks v4 (`focus:outline-hidden` → `outline-none`, `z-3` → `z-[3]`)
// - Aksen memakai token Brighty (primary/accent/line)
// - Tanpa ThumbsSlider (tak dipakai di demo ini)

// ============= CONTEXT =============
const CarouselContext = createContext(undefined);

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component");
  }
  return context;
};

// ============= UTILITIES =============
const TWEEN_FACTOR_BASE = 0.52;
const numberWithinRange = (number, min, max) => Math.min(Math.max(number, min), max);

// ============= MAIN CAROUSEL COMPONENT =============
export const Carousel = forwardRef(
  ({ children, options = {}, plugins = [], className, isScale = false, dir, ...props }, ref) => {
    const carouselId = useId();
    const [slidesArr, setSlidesArr] = useState([]);

    const orientation = options.axis === "y" ? "vertical" : "horizontal";
    const direction = options.direction ?? dir;

    const [emblaRef, emblaApi] = useEmblaCarousel(
      { ...options, axis: orientation === "vertical" ? "y" : "x", direction },
      plugins
    );
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
      containScroll: "keepSnaps",
      dragFree: true,
      axis: orientation === "vertical" ? "y" : "x",
      direction,
    });

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [snapCount, setSnapCount] = useState(0);

    const onPrevButtonClick = useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

    const onDotButtonClick = useCallback(
      (index) => {
        emblaApi?.scrollTo(index);
      },
      [emblaApi]
    );

    const onThumbClick = useCallback(
      (index) => {
        if (!emblaApi || !emblaThumbsApi) return;
        emblaApi.scrollTo(index);
      },
      [emblaApi, emblaThumbsApi]
    );

    const handleKeyDown = useCallback(
      (event) => {
        if (!emblaApi) return;
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            if (orientation === "horizontal") {
              direction === "rtl" ? onNextButtonClick() : onPrevButtonClick();
            }
            break;
          case "ArrowRight":
            event.preventDefault();
            if (orientation === "horizontal") {
              direction === "rtl" ? onPrevButtonClick() : onNextButtonClick();
            }
            break;
          case "ArrowUp":
            event.preventDefault();
            if (orientation === "vertical") onPrevButtonClick();
            break;
          case "ArrowDown":
            event.preventDefault();
            if (orientation === "vertical") onNextButtonClick();
            break;
          default:
            break;
        }
      },
      [emblaApi, orientation, direction, onPrevButtonClick, onNextButtonClick]
    );

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
      emblaThumbsApi?.scrollTo(emblaApi.selectedScrollSnap());
    }, [emblaApi, emblaThumbsApi]);

    const onScroll = useCallback((api) => {
      const progress = Math.max(0, Math.min(1, api.scrollProgress()));
      setScrollProgress(progress * 100);
    }, []);

    const tweenFactor = useRef(0);
    const tweenNodes = useRef([]);

    const setTweenNodes = useCallback(
      (api) => {
        if (!isScale) return;
        tweenNodes.current = api
          .slideNodes()
          .map((slideNode) => slideNode.querySelector(".slider_content"));
      },
      [isScale]
    );

    const setTweenFactor = useCallback(
      (api) => {
        if (!isScale) return;
        tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
      },
      [isScale]
    );

    const tweenScale = useCallback(
      (api, eventName) => {
        if (!isScale) return;
        const engine = api.internalEngine();
        const progress = api.scrollProgress();
        const slidesInView = api.slidesInView();
        const isScrollEvent = eventName === "scroll";

        api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
          let diffToTarget = scrollSnap - progress;
          const slidesInSnap = engine.slideRegistry[snapIndex];

          slidesInSnap.forEach((slideIndex) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem) => {
                const target = loopItem.target();
                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);
                  if (sign === -1) diffToTarget = scrollSnap - (1 + progress);
                  if (sign === 1) diffToTarget = scrollSnap + (1 - progress);
                }
              });
            }

            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const scale = numberWithinRange(tweenValue, 0, 1).toString();
            const tweenNode = tweenNodes.current[slideIndex];
            if (tweenNode) tweenNode.style.transform = `scale(${scale})`;
          });
        });
      },
      [isScale]
    );

    useEffect(() => {
      if (!emblaApi) return;
      setScrollSnaps(emblaApi.scrollSnapList());
      setSnapCount(emblaApi.scrollSnapList().length);
      onSelect();
      onScroll(emblaApi);

      emblaApi.on("reInit", onSelect).on("select", onSelect).on("reInit", onScroll).on("scroll", onScroll);

      if (isScale) {
        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenScale(emblaApi);
        emblaApi
          .on("reInit", setTweenNodes)
          .on("reInit", setTweenFactor)
          .on("reInit", tweenScale)
          .on("scroll", tweenScale);
      }
    }, [emblaApi, onSelect, onScroll, isScale, setTweenNodes, setTweenFactor, tweenScale]);

    return (
      <CarouselContext.Provider
        value={{
          emblaApi,
          emblaThumbsApi,
          emblaRef,
          emblaThumbsRef,
          prevBtnDisabled,
          nextBtnDisabled,
          onPrevButtonClick,
          onNextButtonClick,
          selectedIndex,
          scrollSnaps,
          onDotButtonClick,
          scrollProgress,
          selectedSnap: selectedIndex,
          snapCount,
          isScale,
          slidesArr,
          setSlidesArr,
          onThumbClick,
          carouselId,
          orientation,
          direction,
          handleKeyDown,
        }}
      >
        <div
          ref={ref}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative w-full focus:outline-none", className)}
          dir={direction}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";

// ============= SLIDER CONTAINER =============
export const SliderContainer = forwardRef(({ className, viewportClassName, children, ...props }, ref) => {
  const { emblaRef, orientation } = useCarousel();

  return (
    <div ref={emblaRef} className={cn("overflow-hidden", viewportClassName)} data-cursor="drag" {...props}>
      <div
        ref={ref}
        className={cn("flex", orientation === "vertical" ? "flex-col" : "flex-row", className)}
        style={{ touchAction: "pan-y pinch-zoom" }}
      >
        {children}
      </div>
    </div>
  );
});

SliderContainer.displayName = "SliderContainer";

// ============= SLIDER ITEM =============
export const Slider = forwardRef(({ children, className, thumbnailSrc, ...props }, ref) => {
  const { isScale, setSlidesArr } = useCarousel();

  useEffect(() => {
    if (thumbnailSrc) {
      setSlidesArr((prev) => (prev.includes(thumbnailSrc) ? prev : [...prev, thumbnailSrc]));
    }
  }, [thumbnailSrc, setSlidesArr]);

  return (
    <div ref={ref} className={cn("min-w-0 shrink-0 grow-0", className)} {...props}>
      {isScale ? <div className="slider_content">{children}</div> : children}
    </div>
  );
});

Slider.displayName = "Slider";

// ============= NAVIGATION BUTTONS =============
export const SliderPrevButton = forwardRef(({ children, className, ...props }, ref) => {
  const { onPrevButtonClick, prevBtnDisabled } = useCarousel();

  return (
    <button
      ref={ref}
      type="button"
      onClick={onPrevButtonClick}
      disabled={prevBtnDisabled}
      className={cn("", className)}
      {...props}
    >
      {children}
    </button>
  );
});

SliderPrevButton.displayName = "SliderPrevButton";

export const SliderNextButton = forwardRef(({ children, className, ...props }, ref) => {
  const { onNextButtonClick, nextBtnDisabled } = useCarousel();

  return (
    <button
      ref={ref}
      type="button"
      onClick={onNextButtonClick}
      disabled={nextBtnDisabled}
      className={cn("", className)}
      {...props}
    >
      {children}
    </button>
  );
});

SliderNextButton.displayName = "SliderNextButton";

// ============= PROGRESS BAR =============
export const SliderProgress = forwardRef(({ className, ...props }, ref) => {
  const { scrollProgress } = useCarousel();

  return (
    <div
      ref={ref}
      className={cn("relative h-1.5 w-72 max-w-full overflow-hidden rounded-full bg-line", className)}
      {...props}
    >
      <div
        className="absolute bottom-0 left-[-100%] top-0 w-full bg-accent transition-transform"
        style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
      />
    </div>
  );
});

SliderProgress.displayName = "SliderProgress";

// ============= SNAP DISPLAY (counter "3 / 10") =============
export const SliderSnapDisplay = forwardRef(({ className, ...props }, ref) => {
  const { selectedSnap, snapCount } = useCarousel();
  const prevSnapRef = useRef(selectedSnap);
  const direction = selectedSnap > prevSnapRef.current ? 1 : -1;

  useEffect(() => {
    prevSnapRef.current = selectedSnap;
  }, [selectedSnap]);

  return (
    <div ref={ref} className={cn("flex items-center gap-1 overflow-hidden", className)} {...props}>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSnap}
          custom={direction}
          initial={{ y: direction * 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction * -14, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {selectedSnap + 1}
        </motion.div>
      </AnimatePresence>
      <span className="text-muted">/ {snapCount}</span>
    </div>
  );
});

SliderSnapDisplay.displayName = "SliderSnapDisplay";

// ============= DOT BUTTONS =============
export const SliderDotButton = forwardRef(({ className, activeClass, ...props }, ref) => {
  const { selectedIndex, scrollSnaps, orientation, onDotButtonClick, carouselId } = useCarousel();

  return (
    <div ref={ref} className={cn("flex gap-2", className)} {...props}>
      {scrollSnaps.map((_, index) => (
        <button
          key={`${carouselId}-dot-${index}`}
          type="button"
          onClick={() => onDotButtonClick(index)}
          aria-label={`Ke slide ${index + 1}`}
          className={cn("relative m-0 inline-flex p-0", orientation === "vertical" ? "h-6 w-1" : "h-1 w-6")}
        >
          <div className={cn("rounded-full bg-ink/15", orientation === "vertical" ? "h-6 w-1" : "h-1 w-6")} />
          {index === selectedIndex && (
            <motion.div
              layoutId={`hover-${carouselId}`}
              transition={{ layout: { duration: 0.4, ease: "easeInOut", delay: 0.04 } }}
              className={cn(
                "absolute left-0 top-0 z-[3] h-full w-full rounded-full bg-accent",
                orientation === "vertical" ? "h-6 w-1" : "h-1 w-6",
                activeClass
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
});

SliderDotButton.displayName = "SliderDotButton";

// ============= CAROUSEL INDICATORS =============
export const CarouselIndicator = forwardRef(({ className, index, ...props }, ref) => {
  const { selectedIndex, onDotButtonClick } = useCarousel();
  const isActive = selectedIndex === index;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onDotButtonClick(index)}
      className={cn(
        "h-1.5 w-6 rounded-full transition-colors",
        isActive ? "bg-accent" : "bg-ink/20",
        className
      )}
      aria-label={`Ke slide ${index + 1}`}
      {...props}
    >
      <span className="sr-only">Slide {index + 1}</span>
    </button>
  );
});

CarouselIndicator.displayName = "CarouselIndicator";
