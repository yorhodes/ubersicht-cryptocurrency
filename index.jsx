export const command = ```
    source .env.coinmarketcap && \
    curl \
    -H "X-CMC_PRO_API_KEY: $API_KEY" -H "Accept: application/json" \
    -d @quotes_latest_body.json https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest
```

export const refreshFrequency = 5*60*1000 // 5 mins * 60 seconds * 1000 milliseconds

export const render = ({output}) => {
    holdingsArray = JSON.parse(output)[1]
    boxes = ""
    for (coin, attrs of holdingsArray) {
        boxes += genHtmlBox(attrs.ticker) + "\n"
    }
    boxes += genHtmlBox('total', 'USD')

    return boxes
}

/*  A method that generates a HTML block
for a coin

coinName - Name of a coin to generate box for (e.g. bitcoin)
ticker - Ticker for a given coin (e.g. BTC). Defaults to coinName
*/
const genHtmlBox = (coinName, ticker = coinName) => (
    <div class={coinName.toLowerCase()+' box'}>
        <div class='ticker'>1 {ticker.toUpperCase()}</div>
        <div class='badge lastUpdated'>Last Updated</div>
        <div class='price'></div>
    </div>
)

/*
A function that gets current date in a form of HH:MM
returns formatted date 
*/
const getDate = () => {
    d = new Date()
    hours = d.getHours()
    mins = d.getMinutes()
    return "Updated: " + [
        hours > 9 ? '' : '0' + hours,
        mins > 9 ? '' : '0' + mins
    ].join(':')
}

const update = (output, domEl) => {
  resArr = JSON.parse(output)[0]
  holdingsArray = JSON.parse(output)[1]
  fmtDate = getDate()
  portfolio = {value: 0, cost_basis: 0, html: "", color: ""}

  for (coin, attrs of holdingsArray) {
      coinRes = findCoinResults(resArr, coin)
      box = $(domEl).find('.' + attrs.ticker.toLowerCase())
      info = getPriceInfo(coinRes, attrs)
      portfolio.value += info.value
      portfolio.cost_basis += (coin.cost_basis == undefined) ? 0 : coin.cost_basis
      updateBox(box, info.html, fmtDate)
  }

//   update 'total' portfolio value rounded to cents
  totalBox = $(domEl).find('.total')
  portfolio.color = (portfolio.value >= portfolio.cost_basis) ? 'green' : 'red'
  portfolio.html = (
    <div class={"value" + portfolio.color}>
      {roundAmount(portfolio.value, 2)}
    </div>
  )
  updateBox(totalBox, portfolio.html, fmtDate)
}


/* 
    Finds a coin to generate data for from json response

    jsonResponse - JSON with info about all coins
    coinName - name of a coin to search for
*/
const findCoinResults = (jsonResponse, coinName) => {
    for (coin in jsonResponse) {
        if (coin['id'] == coinName)
            return coin
    }
    return {}
}

/* Sets date and value to a HTML box

boxName - class name for a HTML box to update
value - current price for a given coin
date - date string when it was last updated
*/
const updateBox = (boxName, value, date) => {
    $(boxName).find('.price').html + value
    $(boxName).find('.lastUpdated').html + date
}


/*
Rounds a value to a number of decimals

amount - number to round
precision - number of numbers after decimal point
*/
const roundAmount = (amount, precision) => {
    prec = Math.pow(10, precision)
    rv = Math.round(amount * prec) / prec

    return rv
}


/* Gets price information for a given coin

json - JSON object for a given coin
coin - coin config from holdings

returns JSON object containing HTML to be rendered
    and raw value of holdings */
const getPriceInfo = (json, coin) => {
    price = json['price_usd']
    change = json['percent_change_1h']
    value = coin.holdings * price
    if (coin.cost_basis == undefined) {
        color = change >= 0 ? 'green' : 'red'
    } else {
        color = value > coin.cost_basis ? 'green' : 'red'
    }
    
    return {
        html: (
            <div>
                <div class='price default'>{roundAmount(price, coin.round)}</div>
                <div class='badge default'>Last Price</div>
                <div class={"value" + color}>{roundAmount(value, 2)}</div>
                <div class='currency default'>USD</div>
            </div>
        ),
        value
    }
}

export const className = `
  bottom: 0.5%'
  right: 0.5%'
  color: white'
  font-family: 'Helvetica Neue''
  font-weight: 100'
  text-align: left'
  margin: 5px'
  width: 200px'
  text-align: center'
  background-color: black'
  .box'
    padding: 3px'
    border: 1px solid rgba(#FFF, 50%)'
    font-size: 24px'
    .price'
      font-size: 32px'
    .ticker, .lastUpdated'
      text-align: left'
    .currency, .badge'
      text-align: right'
    .currency, .ticker, .badge, .lastUpdated'
      font-size: 10px'
      font-weight: 500'
      letter-spacing: 1px'
    .green'
      color: green'
    .red'
      color: red'
    .default'
      color: white'
`