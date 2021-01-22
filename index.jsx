import { styled } from "uebersicht";
import { API_KEY } from './lib/config.js';

const Icon = ({ width = 24, height = 24, scaleHeight = 20, children, ...props }) => (
  <svg viewBox={`0 0 ${width} ${height}`} height={scaleHeight} {...props}>
    {children}
  </svg>
);

const CeloIcon = (props) => (
  <Icon width={950} height={950} {...props}>
    <path fill="#fbcc5c" d="M375,850c151.88,0,275-123.12,275-275S526.88,300,375,300,100,423.12,100,575,223.12,850,375,850Zm0,100C167.9,950,0,782.1,0,575S167.9,200,375,200,750,367.9,750,575,582.1,950,375,950Z"/>
    <path fill="#35d07f" d="M575,650c151.88,0,275-123.12,275-275S726.88,100,575,100,300,223.12,300,375,423.12,650,575,650Zm0,100c-207.1,0-375-167.9-375-375S367.9,0,575,0,950,167.9,950,375,782.1,750,575,750Z"/>
    <path fill="#5ea33b" d="M587.39,750a274.38,274.38,0,0,0,54.55-108.06A274.36,274.36,0,0,0,750,587.4a373.63,373.63,0,0,1-29.16,133.45A373.62,373.62,0,0,1,587.39,750ZM308.06,308.06A274.36,274.36,0,0,0,200,362.6a373.63,373.63,0,0,1,29.16-133.45A373.62,373.62,0,0,1,362.61,200,274.38,274.38,0,0,0,308.06,308.06Z"/>
  </Icon>
);

const BitcoinIcon = (props) => (
  <Icon width={256} height={256} {...props}>
    <circle fill="#fa8a34" cx="128" cy="128" r="128"/>
    <path fill="#fff" d="M1204.1,462.447c-4.67,12.309-32.28,20.379-32.28,20.379l5.38,22.428-14.21,3.4-5.41-22.585-11.24,2.563,5.44,22.708-14.21,3.4-5.48-22.865-28.48,6.493-1.13-17.911s5.18-.648,9.9-1.581,4.82-6.292,4.19-8.909-12.85-53.641-14.15-59.061-6.97-6.829-9.44-6.434-10.29,3.255-10.29,3.255l-3.58-14.952,27.66-6.626-5.55-23.176,14.2-3.4,5.55,23.176c4.06-.972,7.9-1.89,11.22-2.686l-5.55-23.176,14.2-3.4,5.59,23.311c6.37-1.033,18.66-2.112,26.25.684,9.1,3.353,15.14,14.553,15.8,23.091s-8.38,17.817-8.38,17.817,14.2,0.988,20.24,8.591C1212.62,442.426,1206.19,456.916,1204.1,462.447Zm-78.62-64.174,6.81,28.41s12.27-1.557,19.83-6.33,10.78-9.509,9.66-15.754c-1.19-6.631-8.99-10.52-16.68-10.234A73.025,73.025,0,0,0,1125.48,398.273Zm9.46,42.794,7.35,30.652s19.47-3.676,25.8-7.763,13.55-11.94,9.34-20.419-15.95-8.035-23.8-6.947A145.286,145.286,0,0,0,1134.94,441.067Z" data-name="Фигура 1 копия" id="Фигура_1_копия" transform="translate(-1016 -309)"/>
  </Icon>
);

const EthereumIcon = (props) => (
  <Icon width={156} height={256} {...props}>
    <path d="M0,128 L80,0 L80,93.5358372 L0,128 Z M156,128 L80,93.5809573 L80,0 L156,128 Z" fill="#828384" id="Combined-Shape"/>
    <path d="M80,176 L0,131.00396 L80,96 L80,176 Z M156,131.011473 L80,176 L80,96 L156,131.011473 Z" fill="#343535" id="Combined-Shape"/>
    <path d="M0,148 L80,194.180711 L80,256 L0,148 Z M156,148 L80,256 L80,194.175361 L156,148 Z" fill="#828384" id="Combined-Shape"/>
    <polygon fill="#2F3030" id="Path-3" points="156 128 80 93.5809573 80 0"/>
    <polygon fill="#131313" id="Path-5" points="156 131.011473 80 96 80 176"/>
    <polygon fill="#2F3030" id="Path-7" points="156 148 80 194.175361 80 256"/>
  </Icon>
);

const Container = styled("div")`
  padding-left: 175px;
  padding-top: 9px;
  display: flex;
`
const Box = styled("div")`
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledText = styled("span")`
  font-family: JetBrains Mono;
  font-size: 70%;
  padding-left: 5px;
`

export const command = `curl -s \
  -H "X-CMC_PRO_API_KEY: ${API_KEY}" -H "Accept: application/json" \
  -d "symbol=CELO,ETH,BTC" \
  -G https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest
`;

export const refreshFrequency = 5*60*1000; // 5 mins * 60 seconds * 1000 milliseconds

export const render = ({output, error}) => {
  if (error || !output) {
    return (<div>Something went wrong: <strong>{String(error)}</strong></div>);
  }
  try {
    const result = JSON.parse(output);
    return <Container>
      <Box>
        <BitcoinIcon></BitcoinIcon><StyledText>${parseFloat(result.data.BTC.quote.USD.price).toFixed(2)}</StyledText>
      </Box>
      <Box>
        <EthereumIcon></EthereumIcon><StyledText>${parseFloat(result.data.ETH.quote.USD.price).toFixed(2)}</StyledText>
      </Box>
      <Box>
        <CeloIcon></CeloIcon><StyledText>${parseFloat(result.data.CELO.quote.USD.price).toFixed(2)}</StyledText>
      </Box>
    </Container>;
  } catch (e) {
    return <Container>Error {e.toString()}</Container>
  }
};
