"use client";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function SkillCard({ skill }) {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring قوی‌تر و responsive‌تر
  const smoothX = useSpring(mouseX, { stiffness: 400, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 400, damping: 20 });

  // Tilt شدیدتر
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  const glowX = useTransform(smoothX, [-0.5, 0.5], ["10%", "90%"]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ["10%", "90%"]);

  const background = useMotionTemplate`
    radial-gradient(
      400px circle at ${glowX} ${glowY},
      rgba(124,58,237,0.2),
      transparent 5%
    )
  `;

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // دقیق‌تر نسبت به مرکز
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        rotateX,
        rotateY,
        background,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.1 }}
      className="
        relative
        w-40 h-28
        cursor-pointer
        rounded-2xl
        border border-white/10
        bg-[#151a24]
        flex flex-col items-center justify-center gap-2
        overflow-hidden
        shadow-lg shadow-primary/20
      "
    >
      {/* Neon Pulse */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(46,196,182,0.25), transparent 100%)",
        }}
        initial={{ scale: 0 }}
        whileHover={{ scale: 1.8, opacity: 0.7 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      />

      {/* Icon */}
      <motion.div
        style={{ transform: "translateZ(100px)" }}
        animate={{ y: [0, -10, 0], rotate: [0, 8, -12, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative w-12 h-12"
      >
        <Image
          src={skill.icon}
          fill
          alt={skill.title}
          className="object-contain"
        />
      </motion.div>

      {/* Title */}
      <motion.h3
        style={{ transform: "translateZ(100px)" }}
        className="text-sm font-medium text-white/90 tracking-wide"
      >
        {skill.title}
      </motion.h3>

      {/* Light sweep */}
      <motion.div
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-2xl skew-x-12"
      />
    </motion.div>
  );
}
