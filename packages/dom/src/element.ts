import {Context, ForkScope, Plugin} from "cordis";
import Node from "./node";

export class Element<C extends Context = Context> extends Node<C> {
    constructor(scope: ForkScope<C>) {
        super(scope)
    }

    getElementById(id: number): Element | null {
        for (const children of this._getForks()) {
            const element = new Element(children)
            if (children.uid === id) return element

            const found = element.getElementById(id)
            if (found) return found
        }

        return null
    }

    getElementsByName(name: string) {
        const elements: Element[] = [];
        for (const children of this._getForks()) {
            const element = new Element(children)
            if (children.runtime.name === name)
                elements.push(element)
            elements.push(...element.getElementsByName(name))
        }
        return elements
    }

    getElementsByPlugin(plugin: Plugin) {
        this.scope.ctx.registry.resolve(plugin)
        const elements: Element[] = [];
        for (const children of this._getForks()) {
            const element = new Element(children)
            if (children.runtime.plugin === plugin)
                elements.push(element)
            elements.push(...element.getElementsByPlugin(plugin))
        }
        return elements
    }
}


export default Element