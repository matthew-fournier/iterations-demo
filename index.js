const term = require('terminal-kit').terminal
const axios = require('axios')
const fs = require('fs')
const {
  addSomeNewProducts,
  getProductTitlesByRating,
  getTotalReviewsOnStore,
  titlesAsParagraph,
  findProductByID
} = require('./example-scenarios')

const optionSelect = async (products) => {
  const items = [
    ['1. Add some new products', addSomeNewProducts, []],
    ['2. Get a detailed list of sorted products with rating 4 or highter', getProductTitlesByRating, [products, 4]],
    ['3. Calculate the total number of reviews added to store', getTotalReviewsOnStore, [products]],
    ['4. Create array of all words from each product title', titlesAsParagraph, [products]],
    ['5. Check if product of id 11 exists (Should Pass)', findProductByID, [products, 5]],
    ['6. Check if product of id 99 exists (Should Fail)', findProductByID, [products, 99]],
    ['Cancel', terminate, [0]]
  ]

  const opt = await term.singleColumnMenu(items.map(item => item[0])).promise

  term.blue('\n------------------------------------------\n\n')
  term.magenta('###################################################################')
  term.magenta(`\n${opt.selectedText}\n\n`)
  await items[opt.selectedIndex][1](...items[opt.selectedIndex][2])
  term.blue('\n\n------------------------------------------\n')
  await optionSelect(products)
}

const getProducts = async () => {
  return await axios.get('https://fakestoreapi.com/products')
    .then(res => res)
    .then(products => {
      return products.data
    })
}

const terminate = (code = 0) => {
  setTimeout(() => {
    term.grabInput(true)
    term.green('\n')
    process.exit(code)
  }, 100)
}

const cancelKeys = () => {
  term.on('key', (name) => {
    if (name !== 'CTRL_C') { return }
    term.red('\nCanceled')
    terminate()
  })
}

(async () => {
  try {
    cancelKeys()
    const products = await getProducts()
    await fs.writeFileSync('./example-data.json', JSON.stringify(products, null, 2))
    term.grey('Example products saved to <example-data.json>\n\n')
    await optionSelect(products)
    return terminate()
  } catch (error) {
    term.red(`\n${error}`)
    return terminate(1)
  }
})()
