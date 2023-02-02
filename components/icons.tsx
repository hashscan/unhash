import React from 'react'

export const ProfileIcon = ({ color = 'var(--text-secondary)' }: { color?: string }) => (
  <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g strokeLinecap="round" strokeWidth="1.5" stroke={color} fill="none" strokeLinejoin="round">
      <path d="M17.763,18.91l-0.35,-0.879c-0.177,-0.446 -0.452,-0.846 -0.804,-1.172l-0.064,-0.059c-0.554,-0.514 -1.282,-0.8 -2.038,-0.8h-5.014c-0.756,0 -1.484,0.286 -2.039,0.799l-0.064,0.06c-0.352,0.326 -0.626,0.726 -0.804,1.172l-0.35,0.879"></path>
      <path d="M14.4749,7.44713c1.36684,1.36684 1.36684,3.58291 0,4.94975c-1.36684,1.36684 -3.58291,1.36684 -4.94975,1.77636e-15c-1.36684,-1.36684 -1.36684,-3.58291 -1.77636e-15,-4.94975c1.36684,-1.36684 3.58291,-1.36684 4.94975,-8.88178e-16"></path>
      <path d="M18.364,5.63604c3.51472,3.51472 3.51472,9.2132 0,12.7279c-3.51472,3.51472 -9.2132,3.51472 -12.7279,0c-3.51472,-3.51472 -3.51472,-9.2132 -1.77636e-15,-12.7279c3.51472,-3.51472 9.2132,-3.51472 12.7279,-1.77636e-15"></path>
    </g>
    <path fill="none" d="M0,0h24v24h-24Z"></path>
  </svg>
)

export const LogoutIcon = () => (
  <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g strokeLinecap="round" strokeWidth="1.5" stroke="var(--primary)" fill="none" strokeLinejoin="round">
      <path d="M6 15v3l3.37508e-14 4.52987e-07c2.50178e-07 1.65685 1.34315 3 3 3h9l-1.31134e-07-3.55271e-15c1.65685 7.24234e-08 3-1.34315 3-3v-12 0c0-1.65685-1.34315-3-3-3h-9l-1.31134e-07 3.10862e-15c-1.65685 7.24234e-08-3 1.34315-3 3 0 0 0 8.88178e-16 0 8.88178e-16v3"></path>
      <polyline points="12,15 15,12 12,9"></polyline>
      <line x1="3" x2="15" y1="12" y2="12"></line>
    </g>
    <path fill="none" d="M0 0h24v24h-24Z"></path>
  </svg>
)

export const ProgressBar = ({
  color = 'var(--text-primary)',
  height = '40px',
  width = '40px'
}: Partial<{ color: string; height: string | number; width: string | number }>) => {
  return (
    <svg x="0px" y="0px" width={width} height={height} viewBox="0 0 50 50" xmlSpace="preserve">
      <path
        fill={color}
        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}

export const BackIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="4" fill="var(--color-slate-6)" />
    <path d="M13.2929 23.2929C12.9024 23.6834 12.9024 24.3166 13.2929 24.7071L19.6569 31.0711C20.0474 31.4616 20.6805 31.4616 21.0711 31.0711C21.4616 30.6805 21.4616 30.0474 21.0711 29.6569L15.4142 24L21.0711 18.3431C21.4616 17.9526 21.4616 17.3195 21.0711 16.9289C20.6805 16.5384 20.0474 16.5384 19.6569 16.9289L13.2929 23.2929ZM33 25C33.5523 25 34 24.5523 34 24C34 23.4477 33.5523 23 33 23V25ZM14 25H33V23H14V25Z"
      fill="var(--color-slate-f)"
    />
  </svg>
)

export const EthereumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 784.37 1277.39">
    <g id="Layer_x0020_1">
      <metadata id="CorelCorpID_0Corel-Layer" />
      <g id="_1421394342400">
        <g>
          <polygon fill="var(--color-slate-f)" fill-rule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 " />
          <polygon fill="var(--color-slate-f)" fill-rule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 " />
          <polygon fill="var(--color-slate-f)" fill-rule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 " />
          <polygon fill="var(--color-slate-f)" fill-rule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 " />
          <polygon fill="var(--color-slate-f)" fill-rule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 " />
          <polygon fill="var(--color-slate-f)" fill-rule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 " />
        </g>
      </g>
    </g>
  </svg>
)