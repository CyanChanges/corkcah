# Corkcah
Maybe useful cordis hacks

## DOM
@corkcah/dom

Find forks like manipulate DOM

### Examples
```ts
import {Document} from '@corkcah/dom'
const document = new Document(ctx.root)

const pluign = {
    name: "pluginA",
    apply: ()=>{}
}

ctx.plugin(plugin)

// Search for plugin with name
const elements = document.getElementsByName("pluginA") 
console.log(elements[0].runtime.plugin === plugin) // true
```

