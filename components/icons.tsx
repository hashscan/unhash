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
