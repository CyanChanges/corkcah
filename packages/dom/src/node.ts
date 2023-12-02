import {Context, ForkScope} from "cordis";

export class NodeListOf<T extends Node = Node> {
    constructor(private nodes: Iterable<Node>) {
    }


    forEach(callback: (value: T, key: number, parent: NodeListOf<T>) => void, thisArg?: any) {
        let idx = 0
        for (const node of this.nodes) {
            callback.call(thisArg, node as T, idx, this)
            idx++
        }
    }

    entries() {
        return this.nodes
    }
}

export class Node<C extends Context = Context> {
    protected* _getForks() {
        const ids = [this.scope.uid]
        for (const disposable of this.scope.disposables.values()) {
            const isFork = disposable.name.startsWith("fork")
            const forkStatic: ForkScope = disposable[Context.static]

            if (!isFork) continue
            if (ids.indexOf(forkStatic.uid) !== -1) continue

            ids.push(forkStatic.uid)

            yield forkStatic
        }
        for (const child of this.forks) {
            if (ids.indexOf(child.uid) !== -1) return

            ids.push(child.uid)

            yield child
        }
    }

    constructor(public scope: ForkScope<C>) {
    }

    get name() {
        return this.scope.runtime.name
    }


    private* _getChildNodes() {
        for (const child of this._getForks()) {
            yield new Node(child)
        }
    }

    get childNodes() {
        return new NodeListOf(this._getChildNodes())
    }

    get forks() {
        const children: ForkScope[] = []
        for (const child of this.scope.runtime.children) {
            children.push(child)
        }
        return children
    }
}

export default Node