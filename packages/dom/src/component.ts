import Element from "./element";
import {Context, MainScope, Plugin} from "cordis";

export class Component<C extends Context = Context> extends Element<C> {
    constructor(protected runtime: MainScope<C>) {
        super(runtime);
    }

    protected* getMainScopes() {
        for (const disposable of this.scope.disposables.values()) {
            const isFork = disposable.name.startsWith("fork")
            const runtime: MainScope = disposable[Context.static].runtime
            const isSame = this.runtime.uid === runtime.uid

            if (!isFork) continue
            if (isSame) continue

            yield runtime
        }
    }

    getComponentByPlugin(plugin: Plugin): Component | null {
        for (const runtime of this.getMainScopes()) {
            const component = new Component(runtime)
            if (component.runtime.plugin === plugin) return component

            const found = component.getComponentByPlugin(plugin)
            if (found) return found
        }

        return null
    }

    getComponentById(id: number): Component | null {
        for (const runtime of this.getMainScopes()) {
            const component = new Component(runtime)
            if (component.runtime.uid === id) return component

            const found = component.getComponentById(id)
            if (found) return found
        }

        return null
    }

    getComponentByName(name: string): Component | null {
        for (const runtime of this.getMainScopes()) {
            const component = new Component(runtime)
            if (component.runtime.name == name) return component

            const found = component.getComponentByName(name)
            if (found) return found
        }

        return null
    }

}


export default Component