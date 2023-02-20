import React, { cloneElement, ComponentPropsWithoutRef, ReactElement } from 'react'

export const Logout = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g
        strokeLinecap="round"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinejoin="round"
      >
        <path d="M6 15v3l3.37508e-14 4.52987e-07c2.50178e-07 1.65685 1.34315 3 3 3h9l-1.31134e-07-3.55271e-15c1.65685 7.24234e-08 3-1.34315 3-3v-12 0c0-1.65685-1.34315-3-3-3h-9l-1.31134e-07 3.10862e-15c-1.65685 7.24234e-08-3 1.34315-3 3 0 0 0 8.88178e-16 0 8.88178e-16v3"></path>
        <polyline points="12,15 15,12 12,9"></polyline>
        <line x1="3" x2="15" y1="12" y2="12"></line>
      </g>
      <path fill="none" d="M0 0h24v24h-24Z"></path>
    </svg>
  </BaseIcon>
)

export const EthereumIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    version="1.1"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    image-rendering="optimizeQuality"
    fill-rule="evenodd"
    clip-rule="evenodd"
    viewBox="0 0 784.37 1277.39"
  >
    <g id="Layer_x0020_1">
      <metadata id="CorelCorpID_0Corel-Layer" />
      <g id="_1421394342400">
        <g>
          <polygon
            fill="currentColor"
            fill-rule="nonzero"
            points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
          />
          <polygon
            fill="currentColor"
            fill-rule="nonzero"
            points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
          />
          <polygon
            fill="currentColor"
            fill-rule="nonzero"
            points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
          />
          <polygon
            fill="currentColor"
            fill-rule="nonzero"
            points="392.07,1277.38 392.07,956.52 -0,724.89 "
          />
          <polygon
            fill="currentColor"
            fill-rule="nonzero"
            points="392.07,882.29 784.13,650.54 392.07,472.33 "
          />
          <polygon
            fill="currentColor"
            fill-rule="nonzero"
            points="0,650.54 392.07,882.29 392.07,472.33 "
          />
        </g>
      </g>
    </g>
  </svg>
)

export const Gas = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M10.0047 9.26921H10.2714C11.0078 9.26921 11.6047 9.86617 11.6047 10.6025V12.1359C11.6047 12.7987 12.142 13.3359 12.8047 13.3359C13.4675 13.3359 14.0047 12.7995 14.0047 12.1367V5.22059C14.0047 4.86697 13.7758 4.56227 13.5258 4.31223L10.6714 1.33594M4.00472 2.00254H8.00472C8.7411 2.00254 9.33805 2.59949 9.33805 3.33587V14.0015H2.67139V3.33587C2.67139 2.59949 3.26834 2.00254 4.00472 2.00254ZM14.0047 5.33587C14.0047 6.07225 13.4078 6.66921 12.6714 6.66921C11.935 6.66921 11.3381 6.07225 11.3381 5.33587C11.3381 4.59949 11.935 4.00254 12.6714 4.00254C13.4078 4.00254 14.0047 4.59949 14.0047 5.33587Z"
      stroke="currentColor"
    ></path>
    <line x1="4" y1="9.99414" x2="8" y2="9.99414" stroke="currentColor"></line>
    <line x1="4" y1="11.9941" x2="8" y2="11.9941" stroke="currentColor"></line>
    <path d="M4 8.16113H8" stroke="currentColor"></path>
  </svg>
)

export const LoaderSpinner = ({
  animationSpeed = '0.5s',
  ...props
}: BaseIconProps & { animationSpeed?: string }) => (
  <BaseIcon {...props} baseSize={50}>
    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur={animationSpeed}
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </BaseIcon>
)

export const ProgressBar = LoaderSpinner

export const InfoCircle = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={20}>
    <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 15V11M11 7H11.01M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </BaseIcon>
)

export const Profile = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </BaseIcon>
)

export const Description = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 12H17M3 6H21M3 18H21"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </BaseIcon>
)

export const Globe = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5013 19.2616 15.9228 15.708 16 12C15.9228 8.29203 14.5013 4.73835 12 2M12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2M2 12C2 6.47715 6.47715 2 12 2"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </BaseIcon>
)

export const Twitter = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </BaseIcon>
)

export interface CheckFilledIconProps extends BaseIconProps {
  fillColor?: string
}

export const CheckFilled = (props: CheckFilledIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={props.fillColor} />
      <polyline
        points="8.444 12.339 10.611 14.506 10.597 14.492 15.486 9.603"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
      <rect width="24" height="24" fill="none" />
    </svg>
  </BaseIcon>
)

export const ArrowDown = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Path" transform="translate(-0.000000, -0.000000)">
          <polygon points="0 0 24.0000001 0 24.0000001 24.0000001 0 24.0000001"></polygon>
          <path
            d="M2.46966992,6.96966994 C2.73593649,6.70340338 3.15260017,6.67919733 3.44621167,6.89705179 L3.5303301,6.96966994 L12.0000001,15.4390001 L20.46967,6.96966994 C20.7359366,6.70340338 21.1526002,6.67919733 21.4462117,6.89705179 L21.5303302,6.96966994 C21.7965967,7.23593651 21.8208028,7.65260019 21.6029483,7.94621169 L21.5303302,8.03033012 L12.5303301,17.0303302 C12.2640636,17.2965967 11.8473999,17.3208028 11.5537884,17.1029483 L11.46967,17.0303302 L2.46966992,8.03033012 C2.1767767,7.7374369 2.1767767,7.26256316 2.46966992,6.96966994 Z"
            fill="currentColor"
            fill-rule="nonzero"
          ></path>
        </g>
      </g>
    </svg>
  </BaseIcon>
)

// facing right
export const Chevron = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
)

// facing right
export const Tool = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.6314 7.63137C15.2353 7.23535 15.0373 7.03735 14.9631 6.80902C14.8979 6.60817 14.8979 6.39183 14.9631 6.19098C15.0373 5.96265 15.2353 5.76465 15.6314 5.36863L18.4697 2.53026C17.7165 2.18962 16.8804 2 16 2C12.6863 2 9.99998 4.68629 9.99998 8C9.99998 8.49104 10.059 8.9683 10.1702 9.42509C10.2894 9.91424 10.349 10.1588 10.3384 10.3133C10.3273 10.4751 10.3032 10.5612 10.2286 10.7051C10.1574 10.8426 10.0208 10.9791 9.7478 11.2522L3.49998 17.5C2.67156 18.3284 2.67156 19.6716 3.49998 20.5C4.32841 21.3284 5.67156 21.3284 6.49998 20.5L12.7478 14.2522C13.0208 13.9791 13.1574 13.8426 13.2949 13.7714C13.4388 13.6968 13.5249 13.6727 13.6867 13.6616C13.8412 13.651 14.0857 13.7106 14.5749 13.8297C15.0317 13.941 15.5089 14 16 14C19.3137 14 22 11.3137 22 8C22 7.11959 21.8104 6.28347 21.4697 5.53026L18.6314 8.36863C18.2353 8.76465 18.0373 8.96265 17.809 9.03684C17.6082 9.1021 17.3918 9.1021 17.191 9.03684C16.9626 8.96265 16.7646 8.76465 16.3686 8.36863L15.6314 7.63137Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
)

/*
 * <BaseIcon />
 */

type BaseIconPropsInternal = ComponentPropsWithoutRef<'svg'> & {
  children: ReactElement
  baseSize: number
  size?: number | string
  color?: string
}

export type BaseIconProps = Partial<BaseIconPropsInternal>

/*
 * All icons can use this helper component internally
 * It provides color and size customization as well as className and all other attrs
 */
const BaseIcon = ({ children, color, size, baseSize, ...rest }: BaseIconPropsInternal) => {
  const sz = size || baseSize

  const colorProp = color !== undefined ? { style: { color } } : {}
  return cloneElement(children, { width: sz, height: sz, ...colorProp, ...rest })
}
