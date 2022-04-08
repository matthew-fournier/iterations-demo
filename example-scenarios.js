const term = require('terminal-kit').terminal
const axios = require('axios')

exports.getProductTitlesByRating = (products, rating) => {
  const result = products
    .filter(product => product.rating.rate >= rating)
    .sort((a, b) => { return b.rating.rate - a.rating.rate })
    .map((product, index) => `${index + 1}. (${product.rating.rate}) ${product.title}`)

  displayOutput(`
    Steps:
    1. Filter products to only get products with rating of 4+
    2. Sort the filtered products
    3. Map the sorted results to an array of descriptive strings
  `, `
    const result = products
      .filter(product => product.rating.rate >= rating)
      .sort((a, b) => { return b.rating.rate - a.rating.rate })
      .map((product, index) => \`\${index + 1}. (\${product.rating.rate}) \${product.title}\`)
  `, result.join('\n'))
  return result
}

exports.getTotalReviewsOnStore = (products) => {
  const result = products
    .reduce((total, product) => total + product.rating.count, 0)

  displayOutput(`
    Steps:
    1. Create a reduce method with a starting value of 0
    2. Add the current product rating count to the total
  `, `
    const result = products
      .reduce((total, product) => total + product.rating.count, 0)
  `, result)
  return result
}

exports.titlesAsParagraph = (products) => {
  const result = products
    .flatMap(product => product.title.split(' '))

  displayOutput(`
    Steps:
    1. Create a flatMap, this will map the child array to one level
    2. Inside the map method split the product title by spaces
  `, `
    const result = products
      .flatMap(product => product.title.split(' '))
  `, result.join('||'))
  return result
}

exports.findProductByID = (products, id) => {
  const foundProduct = products.find(product => product.id === id)
  const result = typeof foundProduct === 'undefined'
    ? `No product could be found with ID -> ${id}`
    : JSON.stringify(foundProduct)

  displayOutput(`
    Steps:
    1. Run a find method on products that check if the product.id === ${id}
    2. If product is found, display it. Otherwise, show an error message
  `, `
    const foundProduct = products.find(product => product.id === id)
    const result = typeof foundProduct === 'undefined'
      ? \`No product could be found with ID -> \${id}\`
      : JSON.stringify(foundProduct)
  `, result)
  return result
}

exports.addSomeNewProducts = async () => {
  displayOutput(`
    Steps:
    1. Create an array of 10 product objects
    2. Within an await Promise.all() map the newProducts. The map will be async
    3. Not neccessary but return and log the response info

    *Note: All IDs will be 21 as the api doesn't actually save any data
  `, `
    const newProducts = [...Array(10).keys()].map((newProduct, index) => {
      return {title: \`New Product \${index}\`, price: Math.floor((Math.random() * 100) + 1)}
    })

    await Promise.all(newProducts.map(async (newProduct) => {
      const res = await axios.post('https://fakestoreapi.com/products', newProduct)
      term.green('Success, the follow product has been added!\\n')
      term.yellow(\`\${JSON.stringify(res.data)}\\n\`)
    }))
  `)

  const newProducts = [...Array(10).keys()].map((newProduct, index) => {
    return {
      title: `New Product ${index}`,
      price: Math.floor((Math.random() * 100) + 1)
    }
  })

  await Promise.all(newProducts.map(async (newProduct) => {
    const res = await axios.post('https://fakestoreapi.com/products', newProduct)
    term.green('Success, the follow product has been added!\n')
    term.yellow(`${JSON.stringify(res.data)}\n`)
  }))

  return null
}

/* ----------------------------------
  Displays Steps + Code + Result
---------------------------------- */

const displayOutput = (steps = '', code = '', results = '') => {
  term.green(steps.trim().replace(/ {4}/g, ''))
  term('\n')
  term.white(code.replace(/ {4}/g, ''))
  term('\n')
  term.yellow('Results:\n')
  term.yellow(results)
  return null
}
