# Iterable

JavaScript Iterators based on Rust's
[std::iter](https://doc.rust-lang.org/std/iter/index.html).

# Usage

The library exposes an `Iter` class that receives any iterable.

```javascript
const iter = new Iter([1, 2, 3, 4, 5]);

for (const item of iter) {
  console.log(item); // 1, 2, 3, 4, 5
}
```

`Iter` has methods similar to `Array.prototype`

```javascript
const iter = new Iter([1, 2, 3, 4, 5]);

const result = Array.from(iter.map((item) => item * 2));

console.log(result); // [2, 4, 6, 8, 10]
```

This methods can form a chain of iterables

```javascript
const iter = new Iter([1, 2, 3, 4, 5]);

const double = (item) = item * 2;
const result = Array.from(iter.map(double).map(double));

console.log(result); // [4, 8, 12, 16, 20]
```

# Why?

Why use `Iter` instead of `Array`?

## Lazyness

Iterators are lazy by default, nothing happens until you call
`Iter.prototype.next` or _collect_ them into another iterator (like `Array`)

## Infinity

Iterators do not have to be finite.

```javascript
// TODO: example
```
