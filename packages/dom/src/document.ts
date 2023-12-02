import {Context, Plugin} from "cordis";
import Element from './element'
import Component from "./component";

export class Document<C extends Context = Context.Parameterized<Context>> extends Component<C> {
    constructor(protected app: C) {
        if (app.scope.uid !== 0) throw Error("Invalid app, expect root context")
        super(app.runtime);
    }

    getElementsByPlugin(plugin: Plugin): Element[] {
        const runtime = this.app.registry.get(plugin)!
        const element = new Element(runtime)

        if (!runtime) return []

        const elements: Element[] = []
        for (const child of element.forks) {
            elements.push(new Element(child))
        }
        return elements
    }
}

export default Document
