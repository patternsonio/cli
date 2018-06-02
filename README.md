![Patternsoncli Banner](https://raw.githubusercontent.com/patternsonio/cli/master/patternsoncli-logo.png)

<h2 align="center">Create, Run and Publish helper for <a href="https://patternson.io">Patternson</a> Libraries.
</h2>

## Install

`npm i -g @patternson/cli`

## Config

There are multiple ways to configure the patternson cli.

_Sorted by importance (cli args will overwrite env vars etc.)_

### command line arguments

```bash
patternson <command> --[key]=[value]
```

### environment variables

```bash
patternson_[key]=[value] patternson <command>
```

or

```bash
export patternson_[key]=[value]
patternson <command>
```

### `.patternsonrc` file in any parent folder

```ini
[key]=[value]
```

### `package.json` file of the project

```json
{
  "name": "mylib",
  "patternson": {
    "[key]": "[value]"
  }
}
```

## Options

### `accessToken`

authentication token for patternson registry.  
_required_

### `name`

name of the component library.  
_defaults to `name` in `package.json`_

### `version`

version of the library.  
_defaults to `version` in `package.json`_

### `componentsDir`

directory where all components can be found.  
_defaults to `src/components`_

### `rootDir`

root directory of the local library.  
_defaults to dirname of `package.json`_

### `registryUrl`

http endpoint of the patternson registry.  
_defaults to the official patternson registry_

## Contributing

Feel free to send us issues and pull requests.
