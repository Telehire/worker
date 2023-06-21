const LogoText = ({ color, width, height }: any) => {
  return (
    <svg width={width ?? 233} height={height ?? 42} viewBox='0 0 233 42' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M35.0514 2.49561H0V10.9525H12.7409V41.4417H22.3105V10.9525H35.0514V2.49561Z'
        fill={color ?? 'currentColor'}
      />
      <path d='M65.2464 41.4415H74.2517V1.10449L65.2464 2.49542V41.4415Z' fill={color ?? 'currentColor'} />
      <path
        d='M101.506 13.6232C99.2044 12.1924 96.5379 11.4582 93.8282 11.509C91.8081 11.4616 89.7992 11.8228 87.9221 12.5707C86.045 13.3186 84.3382 14.438 82.9042 15.8616C81.4702 17.2852 80.3385 18.9837 79.5769 20.8554C78.8154 22.727 78.4397 24.7332 78.4723 26.7536C78.4365 29.4789 79.1692 32.1591 80.5865 34.4872C81.9931 36.784 83.9665 38.6807 86.3172 39.9953C88.8291 41.3466 91.6438 42.0359 94.4958 41.9982C96.7293 42.0329 98.9514 41.6751 101.061 40.9411C103.158 40.1595 105.098 39.0102 106.792 37.5472L100.838 32.2617C100.106 32.9844 99.2358 33.5521 98.2792 33.9308C97.2085 34.3138 96.078 34.5022 94.9409 34.4872C93.8769 34.4961 92.8205 34.3074 91.8253 33.9308C90.8902 33.5423 90.0398 32.9753 89.3216 32.2617C88.6546 31.5434 88.1168 30.7152 87.7319 29.8136H108.707V27.5882C108.763 24.7054 108.093 21.8549 106.76 19.2982C105.563 16.9601 103.745 14.9967 101.506 13.6232ZM87.5412 23.5266C87.7922 22.6134 88.2277 21.7613 88.8209 21.023C89.3977 20.3414 90.1202 19.7982 90.9351 19.4333C91.7931 19.0536 92.7231 18.8638 93.6613 18.877C94.5872 18.8682 95.5022 19.0779 96.3319 19.489C97.1468 19.8538 97.8693 20.3971 98.4461 21.0786C99.0935 21.7756 99.5697 22.6137 99.837 23.5266H87.5412Z'
        fill={color ?? 'currentColor'}
      />
      <path
        d='M53.8489 13.6232C51.5472 12.1924 48.8807 11.4582 46.171 11.509C44.1509 11.4616 42.142 11.8228 40.2649 12.5707C38.3877 13.3186 36.681 14.438 35.247 15.8616C33.813 17.2852 32.6813 18.9837 31.9197 20.8554C31.1582 22.727 30.7824 24.7332 30.8151 26.7536C30.7793 29.4789 31.512 32.1591 32.9293 34.4872C34.3359 36.784 36.3093 38.6807 38.66 39.9953C41.1719 41.3466 43.9865 42.0359 46.8386 41.9982C49.0827 42.0367 51.3159 41.6788 53.4356 40.9411C55.5324 40.1595 57.473 39.0102 59.1662 37.5472L53.2131 32.2617C52.4808 32.9844 51.6104 33.5521 50.6537 33.9308C49.5831 34.3138 48.4525 34.5022 47.3155 34.4872C46.2515 34.4959 45.1951 34.3072 44.1998 33.9308C43.2647 33.5424 42.4143 32.9755 41.6962 32.2617C41.0292 31.5434 40.4914 30.7152 40.1065 29.8136H61.0818V27.5882C61.1374 24.7053 60.4678 21.8547 59.1344 19.2982C57.9287 16.956 56.0996 14.9922 53.8489 13.6232ZM39.9237 23.5266C40.1747 22.6134 40.6102 21.7613 41.2034 21.023C41.7802 20.3414 42.5027 19.7982 43.3176 19.4333C44.1756 19.0536 45.1056 18.8638 46.0438 18.877C46.9697 18.8682 47.8847 19.0779 48.7144 19.489C49.5293 19.8538 50.2518 20.3971 50.8286 21.0786C51.476 21.7756 51.9522 22.6137 52.2195 23.5266H39.9237Z'
        fill={color ?? 'currentColor'}
      />
      <path
        d='M138.934 4.06155V17.4622H122.911V2.57524L113.341 4.08539V41.4418H122.911V26.1972H138.934V41.4418H148.504V2.54346L138.934 4.06155Z'
        fill={color ?? 'currentColor'}
      />
      <path
        d='M213.989 13.6231C211.687 12.1923 209.02 11.4581 206.311 11.5089C204.289 11.4594 202.279 11.8189 200.4 12.5658C198.521 13.3128 196.812 14.4318 195.376 15.8556C193.941 17.2794 192.808 18.9788 192.045 20.8515C191.282 22.7242 190.906 24.7317 190.939 26.7535C190.903 29.4788 191.636 32.159 193.053 34.4871C194.46 36.7839 196.433 38.6806 198.784 39.9951C201.296 41.3465 204.11 42.0358 206.963 41.9981C209.196 42.0328 211.418 41.675 213.528 40.941C215.624 40.1594 217.565 39.0101 219.258 37.5471L213.305 32.2616C212.573 32.9843 211.702 33.552 210.746 33.9307C209.675 34.3137 208.545 34.5021 207.408 34.4871C206.344 34.496 205.287 34.3073 204.292 33.9307C203.357 33.5422 202.507 32.9752 201.788 32.2616C201.121 31.5433 200.583 30.7151 200.199 29.8135H221.142V27.588C221.197 24.7053 220.528 21.8548 219.195 19.2981C218.011 16.9662 216.21 15.0034 213.989 13.6231ZM200.024 23.5265C200.275 22.6133 200.71 21.7612 201.303 21.0229C201.88 20.3413 202.603 19.7981 203.418 19.4332C204.276 19.0535 205.206 18.8637 206.144 18.8768C207.07 18.8681 207.985 19.0778 208.814 19.4889C209.629 19.8537 210.352 20.397 210.929 21.0785C211.576 21.7755 212.052 22.6136 212.32 23.5265H200.024Z'
        fill={color ?? 'currentColor'}
      />
      <path d='M163.526 12.0098H154.512V41.4419H163.526V12.0098Z' fill={color ?? 'currentColor'} />
      <path
        d='M230.91 33.9466C230.522 33.5253 230.05 33.1903 229.524 32.963C228.999 32.7357 228.431 32.6213 227.858 32.6272C227.279 32.6239 226.705 32.7392 226.172 32.9661C225.639 33.1931 225.158 33.5267 224.759 33.9466C224.349 34.3415 224.026 34.8161 223.807 35.341C223.588 35.8659 223.479 36.4301 223.487 36.9987C223.482 37.5742 223.591 38.1451 223.809 38.6778C224.027 39.2106 224.348 39.6946 224.755 40.1016C225.162 40.5086 225.646 40.8304 226.179 41.0482C226.712 41.266 227.283 41.3755 227.858 41.3702C228.427 41.3778 228.991 41.2689 229.516 41.0502C230.041 40.8314 230.516 40.5076 230.91 40.0985C231.33 39.6992 231.664 39.2182 231.891 38.6851C232.118 38.152 232.233 37.578 232.23 36.9987C232.236 36.4259 232.121 35.8583 231.894 35.3326C231.667 34.8069 231.332 34.3347 230.91 33.9466Z'
        fill='#FFC736'
      />
      <path
        d='M181.481 12.2876C180.157 12.9009 178.994 13.8155 178.087 14.9582V12.1207L169.074 13.5514V41.4495H178.087V22.7474C178.79 21.5963 179.789 20.6549 180.98 20.0212C182.197 19.3532 183.565 19.0084 184.954 19.0197C185.72 19.0184 186.484 19.093 187.235 19.2423C187.929 19.3747 188.603 19.5993 189.238 19.9099V12.0651C188.19 11.5294 187.019 11.2799 185.844 11.3418C184.336 11.3171 182.843 11.6408 181.481 12.2876Z'
        fill={color ?? 'currentColor'}
      />
      <path
        d='M159.021 8.74295C158.01 8.74007 157.031 8.387 156.252 7.74385C155.472 7.10069 154.939 6.20719 154.744 5.21543C154.549 4.22366 154.703 3.19492 155.181 2.3043C155.659 1.41367 156.431 0.716201 157.365 0.3306C158.3 -0.0550002 159.339 -0.104905 160.306 0.189384C161.273 0.483674 162.108 1.10396 162.669 1.94469C163.23 2.78541 163.483 3.79461 163.384 4.80051C163.284 5.80641 162.84 6.74685 162.125 7.46177C161.723 7.87625 161.24 8.20381 160.706 8.42418C160.172 8.64454 159.598 8.75303 159.021 8.74295Z'
        fill={color ?? 'currentColor'}
      />
    </svg>
  )
}

export default LogoText
