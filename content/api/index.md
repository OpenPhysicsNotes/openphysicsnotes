

| API (`/api/...`)  | params | returns | description            |
|-------------------|--------|---------|------------------------|
| [`hello`](#hello) | any    | JSON    | test function          |
| `answer`          | none   | JSON    | test function          |
| `git/pull`        | none   | JSON    | executes `git pull`    |
| `git/pull/status` | none   | JSON    | check last pull output |

## Functions

### `hello`

#### params

#### returns
```json
{
  "hello": "world!",
  "your_query": {}
}
```
<!--iframe src="./hello" style="background: white; display:block; width:100%; height: 5em;">
</iframe-->

### `answer`

#### params

none/ignored

#### returns

```json
{
  "answer": 42
}
```
<!--iframe src="./answer" style="background: white; display:block; width:100%; height: 5em;">
</iframe-->
