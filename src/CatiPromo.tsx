import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Anton';

const {fontFamily} = loadFont();

const ORANGE = '#FF5A00';
const WHITE = '#FFFFFF';
const BLACK = '#050505';
const YELLOW = '#F7B500';

// ---- Escenas (frames @30fps) ----
const D_HOOK = 75;
const D_DELIVERY = 60;
const D_PIZZA = 80;
const D_CTA = 120;
const D_END = 45;
export const TOTAL_FRAMES = D_HOOK + D_DELIVERY + D_PIZZA * 3 + D_CTA + D_END; // 540 = 18 s

const PHONE = '3868 456233';

// ---- Helpers ----
const usePop = (delay = 0, damping = 9, stiffness = 150) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.8}});
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Halftone: React.FC<{corner: 'tl' | 'br' | 'tr' | 'bl'}> = ({corner}) => {
  const pos: Record<string, React.CSSProperties> = {
    tl: {top: 0, left: 0},
    tr: {top: 0, right: 0},
    bl: {bottom: 0, left: 0},
    br: {bottom: 0, right: 0},
  };
  const origin = {tl: '0% 0%', tr: '100% 0%', bl: '0% 100%', br: '100% 100%'}[corner];
  return (
    <div
      style={{
        position: 'absolute',
        width: 520,
        height: 520,
        ...pos[corner],
        backgroundImage: `radial-gradient(${ORANGE} 32%, transparent 36%)`,
        backgroundSize: '22px 22px',
        WebkitMaskImage: `radial-gradient(circle at ${origin}, #000 0%, transparent 70%)`,
        maskImage: `radial-gradient(circle at ${origin}, #000 0%, transparent 70%)`,
        opacity: 0.9,
      }}
    />
  );
};

const Rays: React.FC<{size: number; speed?: number}> = ({size, speed = 0.6}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `repeating-conic-gradient(${ORANGE} 0deg 8deg, transparent 8deg 20deg)`,
        transform: `rotate(${frame * speed}deg)`,
        WebkitMaskImage: 'radial-gradient(circle, #000 25%, transparent 68%)',
        maskImage: 'radial-gradient(circle, #000 25%, transparent 68%)',
        opacity: 0.85,
      }}
    />
  );
};

const Word: React.FC<{
  text: string;
  color?: string;
  size: number;
  delay: number;
  from?: 'scale' | 'left' | 'right' | 'bottom';
  skew?: number;
}> = ({text, color = WHITE, size, delay, from = 'scale', skew = -8}) => {
  const p = usePop(delay, 11, 170);
  const op = interpolate(p, [0, 0.25], [0, 1], clamp);
  let transform = '';
  if (from === 'scale') transform = `scale(${interpolate(p, [0, 1], [2.6, 1])}) rotate(${interpolate(p, [0, 1], [-6, 0])}deg)`;
  if (from === 'left') transform = `translateX(${interpolate(p, [0, 1], [-900, 0])}px)`;
  if (from === 'right') transform = `translateX(${interpolate(p, [0, 1], [900, 0])}px)`;
  if (from === 'bottom') transform = `translateY(${interpolate(p, [0, 1], [500, 0])}px)`;
  return (
    <div
      style={{
        fontFamily,
        fontSize: size,
        lineHeight: 0.95,
        color,
        textTransform: 'uppercase',
        opacity: op,
        transform: `${transform} skewX(${skew}deg)`,
        textShadow: `0 8px 0 rgba(0,0,0,0.55)`,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const Mascot: React.FC<{size: number; delay?: number}> = ({size, delay = 0}) => {
  const frame = useCurrentFrame();
  const p = usePop(delay, 7, 120);
  const bounce = Math.sin((frame - delay) * 0.3) * 10;
  return (
    <Img
      src={staticFile('mascota.jpg')}
      style={{
        width: size,
        transform: `scale(${interpolate(p, [0, 1], [0.2, 1])}) rotate(${interpolate(p, [0, 1], [-20, 0]) + Math.sin(frame * 0.2) * 2}deg) translateY(${bounce}px)`,
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
        WebkitMaskImage: 'radial-gradient(ellipse at center, #000 62%, transparent 76%)',
        maskImage: 'radial-gradient(ellipse at center, #000 62%, transparent 76%)',
      }}
    />
  );
};

const Sparks: React.FC<{delay: number}> = ({delay}) => {
  const p = usePop(delay, 12, 200);
  const line = (rot: number, x: number, y: number): React.CSSProperties => ({
    position: 'absolute',
    left: x,
    top: y,
    width: 70,
    height: 12,
    borderRadius: 6,
    background: ORANGE,
    transform: `rotate(${rot}deg) scaleX(${p})`,
  });
  return (
    <>
      <div style={line(-30, 40, 520)} />
      <div style={line(0, 20, 600)} />
      <div style={line(30, 40, 680)} />
      <div style={line(30, 960, 520)} />
      <div style={line(0, 990, 600)} />
      <div style={line(-30, 960, 680)} />
    </>
  );
};

const DeliveryBand: React.FC<{delay: number; bottom?: number}> = ({delay, bottom = 150}) => {
  const p = usePop(delay, 12, 140);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 36,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px)`,
      }}
    >
      <Img src={staticFile('moto.jpg')} style={{width: 190, mixBlendMode: 'screen'}} />
      <div style={{fontFamily, textTransform: 'uppercase', lineHeight: 0.95, transform: 'skewX(-8deg)'}}>
        <div style={{fontSize: 84, color: WHITE}}>Delivery</div>
        <div style={{fontSize: 84, color: ORANGE}}>sin cargo</div>
      </div>
    </div>
  );
};

const Brand: React.FC<{size?: number; delay?: number}> = ({size = 80, delay = 0}) => {
  const p = usePop(delay, 12, 160);
  return (
    <div
      style={{
        fontFamily,
        fontSize: size,
        transform: `scale(${p}) skewX(-8deg)`,
        textShadow: '0 6px 0 rgba(0,0,0,0.5)',
      }}
    >
      <span style={{color: WHITE}}>CATI</span>
      <span style={{color: ORANGE}}>PIZZA</span>
    </div>
  );
};

// Barrido naranja de transición (entra al final de la escena, sale al comienzo de la siguiente)
const Wipe: React.FC<{duration: number; first?: boolean}> = ({duration, first}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [0, 12], [-20, 125], clamp);
  const inn = interpolate(frame, [duration - 7, duration], [-150, -20], clamp);
  const left = frame >= duration - 7 ? inn : first ? 200 : out;
  return (
    <div
      style={{
        position: 'absolute',
        top: -50,
        bottom: -50,
        width: '145%',
        left: `${left}%`,
        background: ORANGE,
        transform: 'skewX(-14deg)',
        zIndex: 50,
        boxShadow: '-30px 0 0 #fff',
      }}
    />
  );
};

const Scene: React.FC<{duration: number; first?: boolean; last?: boolean; bg?: string; children: React.ReactNode}> = ({
  duration,
  first,
  last,
  bg = BLACK,
  children,
}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
    {children}
    {!last && <Wipe duration={duration} first={first} />}
    {last && !first && <Wipe duration={duration + 100} />}
  </AbsoluteFill>
);

// ---- Escena 1: gancho ----
const Hook: React.FC = () => (
  <Scene duration={D_HOOK} first>
    <Halftone corner="tl" />
    <Halftone corner="br" />
    <div style={{position: 'absolute', top: 1180, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Rays size={1500} />
    </div>
    <div style={{position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
      <Word text="Ya estamos" size={170} delay={4} from="left" />
      <Word text="Tomando" size={230} color={ORANGE} delay={13} from="right" />
      <Word text="Pedidos" size={230} delay={22} from="scale" />
    </div>
    <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Mascot size={820} delay={28} />
    </div>
  </Scene>
);

// ---- Escena 2: delivery ----
const Delivery: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [8, 40], [-700, 0], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <Scene duration={D_DELIVERY}>
      <Halftone corner="tr" />
      <Halftone corner="bl" />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: interpolate(frame, [4, 28], [-400, 40 + i * 30], clamp),
            top: 1050 + i * 70,
            width: 380 - i * 40,
            height: 10,
            borderRadius: 5,
            background: ORANGE,
            opacity: 0.8,
          }}
        />
      ))}
      <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Word text="Delivery" size={300} delay={4} from="left" />
        <Word text="Sin cargo" size={260} color={ORANGE} delay={12} from="right" />
      </div>
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateX(${x}px)`}}>
        <Img src={staticFile('moto.jpg')} style={{width: 640, mixBlendMode: 'screen'}} />
      </div>
      <div style={{position: 'absolute', bottom: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Brand size={110} delay={26} />
      </div>
    </Scene>
  );
};

// ---- Escenas de pizza ----
const PizzaScene: React.FC<{
  img: string;
  a: string;
  b: string;
  from: 'left' | 'right' | 'bottom';
  flip?: boolean;
}> = ({img, a, b, from, flip}) => {
  const frame = useCurrentFrame();
  const p = usePop(6, 10, 90);
  const ring = interpolate(frame, [4, 30], [0, 1], clamp);
  const R = 480;
  const C = 2 * Math.PI * R;
  const rot = interpolate(p, [0, 1], [flip ? 40 : -40, 0]) + frame * (flip ? -0.12 : 0.12);
  const scale = interpolate(p, [0, 1], [0.2, 1]) * (1 + frame * 0.0007);
  return (
    <Scene duration={D_PIZZA}>
      <Halftone corner="tl" />
      <Halftone corner="br" />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Brand size={64} delay={2} />
      </div>
      <div style={{position: 'absolute', top: 240, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', gap: 14}}>
          <Word text={a} size={210} delay={3} from={from} />
          <Word text={b} size={210} color={ORANGE} delay={7} from={from === 'left' ? 'right' : 'left'} />
        </div>
      </div>
      <Sparks delay={14} />
      {/* aro pincelado */}
      <svg style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 1080}} viewBox="0 0 1080 1080">
        <circle
          cx="540"
          cy="540"
          r={R}
          fill="none"
          stroke={ORANGE}
          strokeWidth="26"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ring)}
          transform="rotate(-100 540 540)"
        />
        <circle cx="540" cy="540" r={R + 30} fill="none" stroke={ORANGE} strokeWidth="6" strokeDasharray={`${C * 0.35} ${C}`} strokeDashoffset={-C * ring * 0.5} opacity={0.8} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 1080, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Img
          src={staticFile(img)}
          style={{
            width: 880,
            height: 880,
            borderRadius: '50%',
            objectFit: 'cover',
            transform: `scale(${scale * 1.06}) rotate(${rot}deg)`,
            clipPath: 'circle(46% at 50% 50%)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          }}
        />
      </div>
      <DeliveryBand delay={22} bottom={130} />
    </Scene>
  );
};

// ---- Escena CTA ----
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePop(24, 8, 130);
  const pulse = 1 + Math.sin(frame * 0.35) * 0.025;
  const tag = usePop(44, 12, 150);
  return (
    <Scene duration={D_CTA}>
      <Halftone corner="tr" />
      <Halftone corner="bl" />
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Rays size={1400} speed={-0.5} />
      </div>
      <div style={{position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Word text="Pedí por" size={200} delay={3} from="left" />
        <Word text="WhatsApp" size={260} color={ORANGE} delay={10} from="scale" />
      </div>
      <div style={{position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Mascot size={560} delay={14} />
      </div>
      <div style={{position: 'absolute', top: 1370, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            transform: `scale(${interpolate(p, [0, 1], [0.3, 1]) * pulse})`,
            opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
            borderRadius: 36,
            overflow: 'hidden',
            border: `8px solid ${ORANGE}`,
            background: BLACK,
            boxShadow: `0 0 80px rgba(255,90,0,0.55)`,
          }}
        >
          <Img src={staticFile('whatsapp.jpg')} style={{width: 920, display: 'block'}} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 240,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          fontFamily,
          fontSize: 52,
          color: WHITE,
          textTransform: 'uppercase',
          opacity: tag,
          transform: `translateY(${interpolate(tag, [0, 1], [60, 0])}px)`,
        }}
      >
        <span>Pizzas <span style={{color: ORANGE}}>caseras</span></span>
        <span style={{color: ORANGE}}>★</span>
        <span>Abundantes</span>
        <span style={{color: ORANGE}}>★</span>
        <span>Bien <span style={{color: ORANGE}}>cargadas</span></span>
      </div>
    </Scene>
  );
};

// ---- Cierre ----
const End: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={D_END} last>
      <Halftone corner="tl" />
      <Halftone corner="br" />
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Rays size={1500} />
      </div>
      <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Mascot size={780} delay={2} />
      </div>
      <div style={{position: 'absolute', top: 1060, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Brand size={230} delay={8} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1330,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily,
          fontSize: 100,
          color: WHITE,
          opacity: interpolate(frame, [16, 24], [0, 1], clamp),
          letterSpacing: 4,
        }}
      >
        {PHONE}
      </div>
      <DeliveryBand delay={20} bottom={200} />
    </Scene>
  );
};

export const CatiPromo: React.FC = () => {
  let t = 0;
  const at = (d: number) => {
    const from = t;
    t += d;
    return from;
  };
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Sequence from={at(D_HOOK)} durationInFrames={D_HOOK}><Hook /></Sequence>
      <Sequence from={at(D_DELIVERY)} durationInFrames={D_DELIVERY}><Delivery /></Sequence>
      <Sequence from={at(D_PIZZA)} durationInFrames={D_PIZZA}><PizzaScene img="salchipizza.jpg" a="Salchi" b="Pizza" from="left" /></Sequence>
      <Sequence from={at(D_PIZZA)} durationInFrames={D_PIZZA}><PizzaScene img="calabrezza.jpg" a="Cala" b="Brezza" from="bottom" flip /></Sequence>
      <Sequence from={at(D_PIZZA)} durationInFrames={D_PIZZA}><PizzaScene img="choclo.jpg" a="C/" b="Choclo" from="right" /></Sequence>
      <Sequence from={at(D_CTA)} durationInFrames={D_CTA}><CTA /></Sequence>
      <Sequence from={at(D_END)} durationInFrames={D_END}><End /></Sequence>
    </AbsoluteFill>
  );
};

