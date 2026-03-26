"use client"

import styles from "./AssistantContainer.module.css"

type AssistantAvatarProps = {
  hovered: boolean
}

export default function AssistantAvatar({ hovered }: AssistantAvatarProps) {
  return (
    <div className={styles.avatarShell} data-hovered={hovered}>
      <svg className={styles.avatarSvg} viewBox="0 0 180 220" role="img" aria-label="Virtual assistant avatar">
        <defs>
          <linearGradient id="assistantCore" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#dff8ff" />
            <stop offset="100%" stopColor="#91d9ff" />
          </linearGradient>
          <linearGradient id="assistantTrim" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#6cbaff" />
            <stop offset="100%" stopColor="#2d6fff" />
          </linearGradient>
          <radialGradient id="assistantGlass" cx="35%" cy="20%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
          </radialGradient>
        </defs>

        <ellipse className={styles.avatarShadow} cx="90" cy="193" rx="41" ry="13" />

        <g className={styles.avatarFloat}>
          <circle className={styles.avatarRingOuter} cx="90" cy="94" r="72" />
          <circle className={styles.avatarRingInner} cx="90" cy="94" r="58" />
          <path
            className={styles.avatarAura}
            d="M90 22c33 0 60 26 60 59 0 21-11 39-28 49-6 3-11 8-14 14l-4 8c-3 7-13 7-16 0l-4-8c-3-6-8-11-14-14-17-10-28-28-28-49 0-33 27-59 60-59Z"
          />
          <rect className={styles.avatarHead} x="42" y="30" width="96" height="88" rx="36" />
          <rect className={styles.avatarFace} x="54" y="44" width="72" height="54" rx="24" />
          <rect className={styles.avatarGlass} x="56" y="46" width="68" height="18" rx="9" />
          <rect className={styles.avatarAntennaStem} x="86" y="12" width="8" height="20" rx="4" />
          <circle className={styles.avatarAntennaOrb} cx="90" cy="10" r="8" />
          <circle className={styles.avatarAntennaGlow} cx="90" cy="10" r="14" />

          <g className={styles.avatarBlink}>
            <ellipse className={styles.avatarEyeSocket} cx="72" cy="72" rx="12" ry="12" />
            <ellipse className={styles.avatarEyeSocket} cx="108" cy="72" rx="12" ry="12" />
            <g className={styles.avatarPupils}>
              <circle className={styles.avatarPupil} cx="72" cy="72" r="5" />
              <circle className={styles.avatarPupil} cx="108" cy="72" r="5" />
            </g>
          </g>

          <rect className={styles.avatarMouth} x="72" y="88" width="36" height="6" rx="3" />
          <circle className={styles.avatarCheek} cx="59" cy="87" r="5" />
          <circle className={styles.avatarCheek} cx="121" cy="87" r="5" />
          <path className={styles.avatarNeck} d="M78 118h24v18H78z" />
          <path
            className={styles.avatarBody}
            d="M54 134c0-14 12-26 26-26h20c14 0 26 12 26 26v28c0 18-16 32-36 32s-36-14-36-32v-28Z"
          />
          <path
            className={styles.avatarPanel}
            d="M70 132h40c8 0 14 6 14 14v16c0 12-10 22-22 22h-24c-12 0-22-10-22-22v-16c0-8 6-14 14-14Z"
          />
          <circle className={styles.avatarButton} cx="90" cy="148" r="6" />
          <rect className={styles.avatarButton} x="74" y="164" width="32" height="6" rx="3" />
          <g className={styles.avatarSignalBars}>
            <rect x="79" y="142" width="4" height="18" rx="2" />
            <rect x="88" y="138" width="4" height="22" rx="2" />
            <rect x="97" y="146" width="4" height="14" rx="2" />
          </g>
          <path className={styles.avatarArm} d="M58 142c-12 6-18 14-18 24 0 6 3 10 8 10 4 0 7-2 10-6l10-16-10-12Z" />
          <path className={styles.avatarArm} d="M122 142c12 6 18 14 18 24 0 6-3 10-8 10-4 0-7-2-10-6l-10-16 10-12Z" />
          <circle className={styles.avatarSpark} cx="36" cy="66" r="3" />
          <circle className={styles.avatarSpark} cx="142" cy="48" r="2.5" />
          <circle className={styles.avatarSpark} cx="136" cy="122" r="2" />
        </g>
      </svg>
    </div>
  )
}
