"use client";

import {
  useEffect,
  useRef,
} from "react";

type CursorGridProps = {
  className?: string;
};

type Point = {
  x: number;
  y: number;
  life: number;
  strength: number;
};

export default function CursorGrid({
  className = "",
}: CursorGridProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
    down: false,
  });

  const pointsRef =
    useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      devicePixelRatio =
        Math.min(window.devicePixelRatio || 1, 2);

      canvas.width =
        width * devicePixelRatio;

      canvas.height =
        height * devicePixelRatio;

      context.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
      );
    };

    const createPoint = (
      x: number,
      y: number,
      strength = 1
    ) => {
      pointsRef.current.push({
        x,
        y,
        life: 1,
        strength,
      });

      if (pointsRef.current.length > 180) {
        pointsRef.current.splice(
          0,
          pointsRef.current.length - 180
        );
      }
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      const rect =
        canvas.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      const previous =
        mouseRef.current;

      const distance = Math.hypot(
        x - previous.x,
        y - previous.y
      );

      mouseRef.current = {
        x,
        y,
        active: true,
        down: previous.down,
      };

      if (distance > 5) {
        createPoint(
          x,
          y,
          previous.down ? 1.5 : 0.8
        );
      }
    };

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      const rect =
        canvas.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      mouseRef.current = {
        x,
        y,
        active: true,
        down: true,
      };

      /*
       * Initial click pulse.
       */
      for (let index = 0; index < 18; index += 1) {
        const angle =
          (Math.PI * 2 * index) / 18;

        const radius =
          10 + Math.random() * 20;

        createPoint(
          x + Math.cos(angle) * radius,
          y + Math.sin(angle) * radius,
          1.8
        );
      }
    };

    const handlePointerUp = () => {
      mouseRef.current.down = false;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.down = false;
    };

    const draw = () => {
      context.clearRect(
        0,
        0,
        width,
        height
      );

      const mouse =
        mouseRef.current;

      /*
       * Very subtle always-on particle field.
       */
      const time =
        performance.now() * 0.00025;

      for (
        let index = 0;
        index < 65;
        index += 1
      ) {
        const x =
          ((index * 173.7) +
            Math.sin(time + index) * 18) %
          width;

        const y =
          ((index * 97.3) +
            Math.cos(time * 0.8 + index) * 14) %
          height;

        const normalizedX =
          x < 0 ? x + width : x;

        const normalizedY =
          y < 0 ? y + height : y;

        const distance = Math.hypot(
          normalizedX - mouse.x,
          normalizedY - mouse.y
        );

        const influence =
          mouse.active
            ? Math.max(
                0,
                1 - distance / 180
              )
            : 0;

        const size =
          0.7 + influence * 1.8;

        const opacity =
          0.08 + influence * 0.42;

        context.beginPath();

        context.arc(
          normalizedX,
          normalizedY,
          size,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          `rgba(238, 228, 211, ${opacity})`;

        context.fill();
      }

      /*
       * Cursor-reactive points/trail.
       */
      pointsRef.current =
        pointsRef.current.filter(
          (point) => {
            point.life -= 0.018;
            return point.life > 0;
          }
        );

      for (const point of pointsRef.current) {
        const alpha =
          point.life *
          point.strength *
          0.42;

        const radius =
          1.5 +
          (1 - point.life) * 5;

        context.beginPath();

        context.arc(
          point.x,
          point.y,
          radius,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          `rgba(232, 218, 194, ${alpha})`;

        context.fill();
      }

      /*
       * Cursor glow.
       */
      if (mouse.active) {
        const gradient =
          context.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            mouse.down ? 180 : 130
          );

        gradient.addColorStop(
          0,
          "rgba(238, 224, 201, 0.13)"
        );

        gradient.addColorStop(
          0.35,
          "rgba(218, 200, 172, 0.055)"
        );

        gradient.addColorStop(
          1,
          "rgba(218, 200, 172, 0)"
        );

        context.fillStyle =
          gradient;

        context.fillRect(
          mouse.x - 190,
          mouse.y - 190,
          380,
          380
        );
      }

      animationFrame =
        requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    canvas.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      canvas.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}