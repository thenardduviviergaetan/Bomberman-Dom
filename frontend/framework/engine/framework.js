import Router from "../routes/router.js";

import { vNode, render, diff, patch } from "./engine.js";
/**
 * Represents a framework.
 */
export default class Framework {
    constructor() {
        /**
         * An array of routes.
         * @type {Array}
         */
        this.routes = [];
        /**
         * The router instance.
         * @type {Router}
         */
        this.router = new Router(this);
        /**
         * An array of components.
         * @type {Array}
         * @private
         */
        this._components = [];
        /**
         * The old virtual DOM node.
         * @type {Object}
         * @private
         */
        this.oldNode = {};
        this._init();
    }
    /**
     * Initializes the framework.
     * @private
     */
    _init() {
        this.oldNode = vNode("main", { id: "root"}, ...this._components);
        const initNode = render(this.oldNode);
        document.body.appendChild(initNode);
    }
    /**
     * Sets the routes for the framework.
     * @param {Array} routes - The routes to set.
     */
    setRoutes(routes) {
        this.router.init(routes);
    }

    /**
     * Binds a link to a component.
     * @param {Object} component - The component to bind.
     * @param {string} href - The href of the link.
     */
    bindLink(component, href) {
        const route = {};
        this.routes.push((route[href] = component));
        component.actionListener("click", () => {
            this.router.navigateTo(href);
        });
    }
    /**
     * Adds a component to the framework.
     * @param {Object} component - The component to add.
     * @returns {Promise} A promise that resolves when the component is rendered.
     */
    async addComponent(component) {
        this._components.push(component);
        await this.render(component);
    }
    /**
     * Renders the framework.
     * @returns {Promise} A promise that resolves when the framework is rendered.
     */
    async render() {
        const newNode = vNode("main", { id: "root" }, ...this._components);
        const patches = diff(this.oldNode, newNode);
        await patch(document.body.lastChild, patches);
        this.oldNode = newNode;
    }
}
