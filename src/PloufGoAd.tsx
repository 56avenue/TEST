import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Plouf & Go — vertical animated ad (9:16, 1080x1920)
// UGC concept #3 "Débutante rassurée" reworked as a motion-graphics promo.
// 100% code-generated, no external assets, no paid API.
// ─────────────────────────────────────────────────────────────────────────────

export const ploufGoSchema = z.object({
  phone: z.string(),
  city: z.string(),
  brand: z.string(),
});

// Palette (mer / Bluefin)
const SEA_DEEP = "#082730";
const SEA_MID = "#0d3b46";
const AQUA = "#22c7d6";
const AQUA_BRIGHT = "#63e2ec";
const CREAM = "#f4f1ea";
const CORAL = "#ff6b3d";

// Animated sea-wave layers at the bottom of the frame.
const Waves: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const shift = (speed: number) => (frame * speed) % width;
  const wave = (
    fill: string,
    opacity: number,
    amp: number,
    y: number,
    speed: number,
  ) => {
    const x = -shift(speed);
    return (
      <svg
        viewBox="0 0 1080 300"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 0,
          bottom: y,
          width: "200%",
          height: 320,
          transform: `translateX(${x}px)`,
          opacity,
        }}
      >
        <path
          d={`M0,${150} C270,${150 - amp} 540,${150 + amp} 810,${150 - amp} C1080,${150 - amp * 1.6} 1350,${150 + amp} 1620,${150 - amp} L2160,150 L2160,300 L0,300 Z`}
          fill={fill}
        />
      </svg>
    );
  };
  return (
    <AbsoluteFill>
      {wave(SEA_MID, 0.6, 26, -40, 1.1)}
      {wave(AQUA, 0.22, 34, -80, 1.8)}
      {wave(AQUA_BRIGHT, 0.14, 22, -10, 2.6)}
    </AbsoluteFill>
  );
};

// Stylised SUP board + paddle, drawn with SVG.
const Board: React.FC<{ progress: number }> = ({ progress }) => {
  const y = interpolate(progress, [0, 1], [420, 0]);
  const rot = interpolate(progress, [0, 1], [8, -14]);
  const op = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "46%",
        transform: `translate(-50%, -50%) translateY(${y}px) rotate(${rot}deg)`,
        opacity: op,
      }}
    >
      <svg width="360" height="820" viewBox="0 0 360 820">
        <defs>
          <linearGradient id="deck" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={AQUA_BRIGHT} />
            <stop offset="1" stopColor={AQUA} />
          </linearGradient>
        </defs>
        {/* board body */}
        <path
          d="M180 8 C250 90 268 250 268 470 C268 660 235 780 180 812 C125 780 92 660 92 470 C92 250 110 90 180 8 Z"
          fill="url(#deck)"
          stroke="#0a2a33"
          strokeWidth="6"
        />
        {/* grip pad */}
        <path
          d="M180 150 C222 210 236 330 236 470 C236 620 214 705 180 735 C146 705 124 620 124 470 C124 330 138 210 180 150 Z"
          fill="#0d3b46"
          opacity="0.85"
        />
        {/* arrow logo */}
        <path
          d="M150 300 L210 300 L182 260 Z"
          fill={AQUA_BRIGHT}
        />
        {/* paddle */}
        <g transform="rotate(18 300 400)">
          <rect x="296" y="60" width="12" height="620" rx="6" fill="#0a2a33" />
          <path
            d="M302 690 C280 700 280 760 302 774 C324 760 324 700 302 690 Z"
            fill="#0a2a33"
          />
        </g>
      </svg>
    </div>
  );
};

// Reusable animated line of text.
const Line: React.FC<{
  children: React.ReactNode;
  delay: number;
  size: number;
  color?: string;
  weight?: number;
  spacing?: number;
}> = ({ children, delay, size, color = CREAM, weight = 800, spacing = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const y = interpolate(p, [0, 1], [40, 0]);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${y}px)`,
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: weight,
        fontSize: size,
        letterSpacing: spacing,
        color,
        lineHeight: 1.05,
        textAlign: "center",
        textWrap: "balance",
        padding: "0 70px",
      }}
    >
      {children}
    </div>
  );
};

// Fade a whole scene in and out over its window.
const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const PloufGoAd: React.FC<z.infer<typeof ploufGoSchema>> = ({
  phone,
  city,
  brand,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // slow ambient zoom on the background
  const bgScale = interpolate(frame, [0, durationInFrames], [1.06, 1.14]);

  return (
    <AbsoluteFill style={{ backgroundColor: SEA_DEEP }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale})`,
          background: `radial-gradient(120% 90% at 50% 12%, ${SEA_MID} 0%, ${SEA_DEEP} 62%)`,
        }}
      />
      <Waves />
      {/* soft top vignette for text legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 34%)",
        }}
      />

      {/* Scene 1 — Hook (0–4s) */}
      <Sequence from={0} durationInFrames={120}>
        <Scene>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <Line delay={4} size={92} weight={900}>
              J'avais jamais
              <br />
              fait de paddle…
            </Line>
            <Line delay={26} size={40} color={AQUA_BRIGHT} weight={700}>
              (et un peu peur de tomber)
            </Line>
          </div>
        </Scene>
      </Sequence>

      {/* Scene 2 — Reassurance (4–8s) */}
      <Sequence from={120} durationInFrames={120}>
        <Scene>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <Line delay={4} size={58} weight={700}>
              …et en fait
            </Line>
            <Line delay={20} size={128} color={AQUA_BRIGHT} weight={900} spacing={-2}>
              HYPER
              <br />
              STABLE
            </Line>
            <Line delay={40} size={46} weight={700}>
              10 minutes et t'es tranquille 🌊
            </Line>
          </div>
        </Scene>
      </Sequence>

      {/* Scene 3 — Brand + board (8–11s) */}
      <Sequence from={240} durationInFrames={95}>
        <Scene>
          <BoardScene brand={brand} />
        </Scene>
      </Sequence>

      {/* Scene 4 — CTA (11–15s) */}
      <Sequence from={335} durationInFrames={115}>
        <Scene>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 34,
              alignItems: "center",
            }}
          >
            <Line delay={4} size={54} weight={700}>
              Location de paddle
            </Line>
            <Line delay={16} size={70} color={AQUA_BRIGHT} weight={900}>
              {city}
            </Line>
            <PhonePill phone={phone} delay={34} />
            <CtaButton delay={52} />
          </div>
        </Scene>
      </Sequence>
    </AbsoluteFill>
  );
};

const BoardScene: React.FC<{ brand: string }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  return (
    <>
      <Board progress={p} />
      <div
        style={{
          position: "absolute",
          top: "13%",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Line delay={30} size={120} weight={900} spacing={2}>
          {brand.toUpperCase()}
        </Line>
      </div>
      <div style={{ position: "absolute", bottom: "12%", width: "100%" }}>
        <Line delay={46} size={44} color={AQUA_BRIGHT} weight={700}>
          Ta board t'attend
        </Line>
      </div>
    </>
  );
};

const PhonePill: React.FC<{ phone: string; delay: number }> = ({
  phone,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 160 } });
  const scale = interpolate(p, [0, 1], [0.8, 1]);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: CREAM,
        color: SEA_DEEP,
        padding: "22px 46px",
        borderRadius: 999,
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 900,
        fontSize: 58,
        letterSpacing: 1,
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
      }}
    >
      <span style={{ fontSize: 52 }}>📞</span>
      {phone}
    </div>
  );
};

const CtaButton: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 160 } });
  const pulse = 1 + 0.03 * Math.sin((frame - delay) / 6);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${p * pulse})`,
        background: CORAL,
        color: "#fff",
        padding: "26px 60px",
        borderRadius: 20,
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 900,
        fontSize: 56,
        letterSpacing: 1,
        boxShadow: "0 16px 44px rgba(255,107,61,0.45)",
      }}
    >
      Réserve ta board
    </div>
  );
};
