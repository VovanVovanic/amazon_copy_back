import { faker } from '@faker-js/faker'
console.log(typeof(+faker.commerce.price({min:1, max:1000,symbol:"$"})))