import {expect} from "chai"
import * as jest from "jest-mock"
import {Context} from "cordis";
import {defineProperty} from "cosmokit"
import {Document} from '@corkcah/dom'

const app = new Context()

before(async () => {
    await app.start()
})

describe('Get Element', () => {
    const mock1 = jest.fn()
    const mock2 = jest.fn()

    const document = new Document(app)

    const fork1 = app.plugin(defineProperty(
        mock1, 'name', 'pluginA'
    ))

    const fork2 = app.plugin(defineProperty(
        mock2, 'name', 'pluginB'
    ))

    it('By name', () => {
        const pluginA = document.getElementsByName('pluginA')
        const pluginB = document.getElementsByName('pluginB')

        expect(pluginA).to.length.gte(1)
        expect(pluginB).to.length.gte(1)
        expect(pluginA[0].scope.runtime.plugin).to.equal(mock1)
        expect(pluginB[0].scope.runtime.plugin).to.equal(mock2)
    })

    it('By plugin', () => {
        const pluginA = document.getElementsByPlugin(mock1)
        const pluginB = document.getElementsByPlugin(mock2)

        expect(pluginA).to.length.gte(1)
        expect(pluginB).to.length.gte(1)
        expect(pluginA[0].scope.runtime.plugin).to.equal(mock1)
        expect(pluginB[0].scope.runtime.plugin).to.equal(mock2)
    })

    it('By id', () => {
        const pluginA = document.getElementById(fork1.uid!)
        const pluginB = document.getElementById(fork2.uid!)

        expect(pluginA?.scope.runtime.plugin).to.equal(mock1)
        expect(pluginB?.scope.runtime.plugin).to.equal(mock2)
    })
});

