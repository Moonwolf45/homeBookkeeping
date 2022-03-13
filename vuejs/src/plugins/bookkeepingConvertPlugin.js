const BookkeepingConvertPlugin = {
  install(Vue) {
    Vue.prototype.$getCurrencyBalance = function (allCurrencies, balance, currency, current_currency) {
      let currencyArr = Object.values(allCurrencies.Valute);

      if (currency === current_currency) {
        return parseFloat(balance)
      } else if (currency === 'RUB' && current_currency !== 'RUB') {
        let mainCurrencyObj = currencyArr.find(item => item.CharCode === current_currency)

        if (parseFloat(balance) > 0) {
          return parseFloat(balance) / (mainCurrencyObj.Value / mainCurrencyObj.Nominal)
        } else {
          return 0
        }
      } else if (currency !== 'RUB' && current_currency === 'RUB') {
        let currencyItem = currencyArr.find(item => item.CharCode === currency)

        return parseFloat(balance) * (currencyItem.Value / currencyItem.Nominal)
      } else {
        let mainCurrencyObj = currencyArr.find(item => item.CharCode === current_currency)
        let currencyItem = currencyArr.find(item => item.CharCode === currency)

        if (parseFloat(balance) > 0) {
          return (parseFloat(balance) * (currencyItem.Value / currencyItem.Nominal) / (mainCurrencyObj.Value / mainCurrencyObj.Nominal))
        } else {
          return 0
        }
      }
    }

    Vue.prototype.$getSymbolCurrency = function (currency) {
      let symbol = null;

      switch (currency) {
        case 'RUB':
        case 'BYN':
          symbol = '&#8381;';
          break
        case 'USD':
        case 'AUD':
        case 'HKD':
        case 'CAD':
        case 'SGD':
          symbol = '&#36;';
          break
        case 'EUR':
          symbol = '&euro;';
          break
        case 'GBP':
          symbol = '&#163;';
          break
        case 'AMD':
          symbol = '&#1423;';
          break
        case 'BGN':
          symbol = 'лв';
          break
        case 'BRL':
          symbol = '&#82;';
          break
        case 'HUF':
          symbol = 'Ft';
          break
        case 'DKK':
          symbol = 'kr';
          break
        case 'INR':
          symbol = '&#8360;';
          break
        case 'KZT':
          symbol = '&#8376;';
          break
        case 'KGS':
          symbol = 'сом';
          break
        case 'CNY':
        case 'JPY':
          symbol = '&yen;';
          break
        case 'MDL':
          symbol = 'MDL';
          break
        case 'NOK':
          symbol = '&#107;';
          break
        case 'PLN':
          symbol = 'zł';
          break
        case 'RON':
          symbol = 'lei';
          break
        case 'XDR':
          symbol = 'XDR';
          break
        case 'TJS':
          symbol = 'смн.';
          break
        case 'TRY':
          symbol = '&#8378;';
          break
        case 'TMT':
          symbol = 'TMT';
          break
        case 'UZS':
          symbol = 'сўм';
          break
        case 'UAH':
          symbol = '&#8372;';
          break
        case 'CZK':
          symbol = '&#75;';
          break
        case 'SEK':
          symbol = '&#114;';
          break
        case 'CHF':
          symbol = '&#8355;';
          break
        case 'ZAR':
          symbol = 'R';
          break
        case 'KRW':
          symbol = '&#8361;';
          break
        default:
          symbol = '&#8381;';
      }

      return symbol;
    }
  }
}

export default BookkeepingConvertPlugin;
