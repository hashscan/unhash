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
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    fillRule="evenodd"
    clipRule="evenodd"
    viewBox="0 0 784.37 1277.39"
  >
    <g id="Layer_x0020_1">
      <metadata id="CorelCorpID_0Corel-Layer" />
      <g id="_1421394342400">
        <g>
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,1277.38 392.07,956.52 -0,724.89 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
            points="392.07,882.29 784.13,650.54 392.07,472.33 "
          />
          <polygon
            fill="currentColor"
            fillRule="nonzero"
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

export const InfoCircle = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={20}>
    <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 15V11M11 7H11.01M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
)

export interface CheckFilledIconProps extends BaseIconProps {
  fillColor?: string
}

export const CheckFilled = ({ fillColor, ...props }: CheckFilledIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={fillColor} />
      <polyline
        points="8.444 12.339 10.611 14.506 10.597 14.492 15.486 9.603"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <rect width="24" height="24" fill="none" />
    </svg>
  </BaseIcon>
)

export const ArrowDown = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Path" transform="translate(-0.000000, -0.000000)">
          <polygon points="0 0 24.0000001 0 24.0000001 24.0000001 0 24.0000001"></polygon>
          <path
            d="M2.46966992,6.96966994 C2.73593649,6.70340338 3.15260017,6.67919733 3.44621167,6.89705179 L3.5303301,6.96966994 L12.0000001,15.4390001 L20.46967,6.96966994 C20.7359366,6.70340338 21.1526002,6.67919733 21.4462117,6.89705179 L21.5303302,6.96966994 C21.7965967,7.23593651 21.8208028,7.65260019 21.6029483,7.94621169 L21.5303302,8.03033012 L12.5303301,17.0303302 C12.2640636,17.2965967 11.8473999,17.3208028 11.5537884,17.1029483 L11.46967,17.0303302 L2.46966992,8.03033012 C2.1767767,7.7374369 2.1767767,7.26256316 2.46966992,6.96966994 Z"
            fill="currentColor"
            fillRule="nonzero"
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

export const CoinSwap = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6L8 4M8 4L6 2M8 4H6C3.79086 4 2 5.79086 2 8M18 18L16 20M16 20L18 22M16 20H18C20.2091 20 22 18.2091 22 16M13.4172 13.4172C14.1994 13.7908 15.0753 14 16 14C19.3137 14 22 11.3137 22 8C22 4.68629 19.3137 2 16 2C12.6863 2 10 4.68629 10 8C10 8.92472 10.2092 9.80057 10.5828 10.5828M14 16C14 19.3137 11.3137 22 8 22C4.68629 22 2 19.3137 2 16C2 12.6863 4.68629 10 8 10C11.3137 10 14 12.6863 14 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
)

export const FaceWink = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M15 9H15.01M8 9H10M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
)

export const Chat = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g
        strokeLinecap="round"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinejoin="round"
      >
        <path d="M15.5,14.5h-7"></path>
        <path d="M8.5,10.5h7"></path>
        <path
          strokeWidth="1.5882"
          d="M4.151,16.396c-0.73,-1.3 -1.151,-2.798 -1.151,-4.396c0,-4.971 4.029,-9 9,-9c4.971,0 9,4.029 9,9c0,4.971 -4.029,9 -9,9c-1.598,0 -3.096,-0.421 -4.396,-1.151l-4.604,1.151l1.151,-4.604Z"
        ></path>
      </g>
      <path fill="none" d="M0,0h24v24h-24v-24Z"></path>
    </svg>
  </BaseIcon>
)

export const Menu = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
      <circle cx="12" cy="5" r="1" fill="currentColor"></circle>
      <circle cx="12" cy="19" r="1" fill="currentColor"></circle>
    </svg>
  </BaseIcon>
)

export const Search = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      shapeRendering="geometricPrecision"
      viewBox="0 0 24 24"
    >
      <path d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zM16 16l4.5 4.5"></path>
    </svg>
  </BaseIcon>
)

export const Checkbox = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={16}>
    <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 7l-5.5 5.5L6 10"
      ></path>
    </svg>
  </BaseIcon>
)

export const RenewClock = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M3.523 9h0a8.992 8.992 0 112.113 9.364"></path>
        <path d="M9 15L12 12 12 7"></path>
        <path d="M7 9L3 9 3 5"></path>
      </g>
      <path fill="none" d="M0 0H24V24H0z"></path>
    </svg>
  </BaseIcon>
)

export const CameraReplace = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <g
        strokeLinecap="round"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinejoin="round"
      >
        <path d="M17,13l-1,1l-1,-1"></path>
        <path d="M15.892,13.892c0.066,-0.288 0.108,-0.584 0.108,-0.892c0,-2.209 -1.791,-4 -4,-4c-0.849,0 -1.633,0.268 -2.281,0.719"></path>
        <path d="M21,9v9c0,1.105 -0.895,2 -2,2h-14c-1.105,0 -2,-0.895 -2,-2v-9c0,-1.105 0.895,-2 2,-2h2l1.462,-2.504c0.179,-0.307 0.508,-0.496 0.864,-0.496h5.304c0.351,0 0.676,0.184 0.857,0.484l1.513,2.516h2c1.105,0 2,0.895 2,2Z"></path>
        <path d="M7,13l1,-1l1,1"></path>
        <path d="M8.108,12.108c-0.066,0.288 -0.108,0.584 -0.108,0.892c0,2.209 1.791,4 4,4c0.849,0 1.633,-0.268 2.281,-0.719"></path>
      </g>
      <path fill="none" d="M0,0h24v24h-24Z"></path>
    </svg>
  </BaseIcon>
)

export const UnhashLogo = ({
  fillColor = 'none',
  ...props
}: BaseIconProps & { fillColor?: string }) => (
  <BaseIcon {...props} baseSize={58}>
    <svg viewBox="0 0 58 58" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M58 11C58 4.92487 53.0751 0 47 0H11C4.92487 0 0 4.92487 0 11V47.5C0 49.433 1.567 51 3.5 51V51C5.433 51 7 52.567 7 54.5V54.5C7 56.433 8.567 58 10.5 58H47C53.0751 58 58 53.0751 58 47V11Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.3168 9H25.9656V9C25.0887 9 24.3778 9.71088 24.3778 10.5878V34.5435C24.3778 36.3704 22.8969 37.8514 21.07 37.8514V37.8514C19.2431 37.8514 17.7621 36.3704 17.7621 34.5435V10.3232C17.7621 9.5924 17.1697 9 16.4389 9V9V9C12.0544 9 8.5 12.5544 8.5 16.9389V37.8516V43.4594C8.5 44.5555 9.38859 45.4441 10.4847 45.4441V45.4441C11.5809 45.4441 12.4695 46.3327 12.4695 47.4289V47.7219C12.4695 48.9799 13.4893 49.9996 14.7472 49.9996H25.9656H28.3473V49.9996C31.4165 49.9996 33.9046 47.5116 33.9046 44.4424V22.854C33.9046 21.2828 35.1782 20.0092 36.7493 20.0092V20.0092C38.3205 20.0092 39.5941 21.2828 39.5941 22.8539V27.9059C39.5941 30.7193 41.8748 33 44.6883 33V33C47.5017 33 49.7824 30.7193 49.7824 27.9059V15.2188C49.7824 11.7843 46.9981 9 43.5636 9V9H41.8435H33.9046H32.9784H32.3168ZM49.7824 43.0941C49.7824 40.2807 47.5017 38 44.6883 38V38C41.8748 38 39.5941 40.2807 39.5941 43.0941V48.8744C39.5941 49.4956 40.0977 49.9991 40.7188 49.9991H41.8432C41.8434 49.9991 41.8435 49.9992 41.8435 49.9994V49.9994C41.8435 49.9995 41.8436 49.9996 41.8438 49.9996H45.8129C48.0052 49.9996 49.7824 48.2225 49.7824 46.0302V43.0941Z"
        fill={fillColor}
      />
    </svg>
  </BaseIcon>
)

export const Basket = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <g fill="none">
        <path d="M0 0h24v24H0V0z"></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8 3L5.89 6.777M15 3l2.3 3.777M16 21a5 5 0 11.001-10.001A5 5 0 0116 21M16 14.25v3.5M17.75 16h-3.5"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M19.441 12.375l.703-3.246a1.94 1.94 0 00-1.896-2.352H4.94a1.942 1.942 0 00-1.896 2.352l1.471 6.792a1.937 1.937 0 001.896 1.529h4.804"
        ></path>
      </g>
    </svg>
  </BaseIcon>
)

export const PlusSign = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={16}>
    <svg viewBox="0 0 16 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.6 1C9.6 0.447715 9.15228 0 8.6 0H7.4C6.84772 0 6.4 0.447716 6.4 1V5.4C6.4 5.95228 5.95228 6.4 5.4 6.4H1C0.447715 6.4 0 6.84772 0 7.4V8.6C0 9.15229 0.447716 9.6 1 9.6H5.4C5.95228 9.6 6.4 10.0477 6.4 10.6V15C6.4 15.5523 6.84772 16 7.4 16H8.6C9.15229 16 9.6 15.5523 9.6 15V10.6C9.6 10.0477 10.0477 9.6 10.6 9.6H15C15.5523 9.6 16 9.15228 16 8.6V7.4C16 6.84772 15.5523 6.4 15 6.4H10.6C10.0477 6.4 9.6 5.95228 9.6 5.4V1Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
)

export const Wallet = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg viewBox="0 0 24 24">
      <g fill="none">
        <path d="M0 0h24v24H0V0z"></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M13.499 13.48a.25.25 0 00-.249.251.25.25 0 10.249-.251"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3 6.283V6a3 3 0 013-3h12a3 3 0 013 3v9a3 3 0 01-3 3h-1"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M21 9L17 9"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M13.325 20.922A3 3 0 0017 17.999V9.387a3 3 0 00-2.325-2.923L5.45 4.335A2 2 0 003 6.283v9.869a3 3 0 002.325 2.923l8 1.847z"
        ></path>
      </g>
    </svg>
  </BaseIcon>
)

export const Dots = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg fill="none" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M8.074 12c0-.448-.156-.825-.469-1.133a1.55 1.55 0 00-1.14-.46 1.61 1.61 0 00-1.391.796c-.14.24-.21.505-.21.797 0 .292.07.557.21.797.146.24.339.432.578.578.245.146.516.219.813.219.292 0 .56-.073.805-.219.244-.146.44-.338.585-.578.146-.24.22-.505.22-.797zm5.524 0a1.54 1.54 0 00-.461-1.133 1.54 1.54 0 00-1.133-.46c-.297 0-.565.072-.805.218a1.61 1.61 0 00-.578.578c-.14.24-.21.505-.21.797 0 .292.07.557.21.797.146.24.339.432.578.578.24.146.508.219.805.219.292 0 .557-.073.797-.219a1.7 1.7 0 00.578-.578c.146-.24.219-.505.219-.797zm5.539 0a1.54 1.54 0 00-.461-1.133 1.55 1.55 0 00-1.14-.46 1.601 1.601 0 00-1.391.796c-.146.24-.22.505-.22.797 0 .292.074.557.22.797.145.24.338.432.578.578.244.146.515.219.812.219.297 0 .565-.073.805-.219.245-.146.437-.338.578-.578.146-.24.219-.505.219-.797z"
      ></path>
    </svg>
  </BaseIcon>
)

export const Warning = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g fill="none">
        <path d="M0 0h24v24H0z"></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 13.12V9.38M11.999 16.125a.25.25 0 10.002.5.25.25 0 00-.002-.5"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M14.029 4.139l7.659 13.404c.89 1.558-.235 3.497-2.029 3.497H4.341c-1.795 0-2.92-1.939-2.029-3.497L9.971 4.139c.897-1.571 3.161-1.571 4.058 0z"
        ></path>
      </g>
    </svg>
  </BaseIcon>
)

export const Error = (props: BaseIconProps) => (
  <BaseIcon {...props} baseSize={24}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g fill="none">
        <path d="M0 0h24v24H0V0z"></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 12V7.5M11.999 15.5a.25.25 0 10.002.5.25.25 0 00-.002-.5"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3 14.381V9.619A4.5 4.5 0 015.236 5.73l4.5-2.619a4.501 4.501 0 014.527 0l4.5 2.619A4.5 4.5 0 0121 9.619v4.762a4.5 4.5 0 01-2.236 3.889l-4.5 2.619a4.501 4.501 0 01-4.527 0l-4.5-2.619A4.5 4.5 0 013 14.381z"
        ></path>
      </g>
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
