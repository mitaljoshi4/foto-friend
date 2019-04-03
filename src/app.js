//https://medium.freecodecamp.org/es5-to-esnext-heres-every-feature-added-to-javascript-since-2015-d0c255e13c6e
import { myutilExtra } from './util'

const greeting = 'Hello World';
console.log(greeting);

const getData = async (url) => {
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
  //console.log($);
  console.log(myutilExtra());
};

getData('https://jsonplaceholder.typicode.com/posts');


