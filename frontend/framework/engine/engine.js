import Component from "../components/component.js";
// Create virtual node
/**
 * Creates a virtual node (vNode) with the given tag, props, and children.
 *
 * @param {string} tag - The HTML tag name of the vNode.
 * @param {object} props - The properties of the vNode.
 * @param {...any} children - The child elements of the vNode.
 * @returns {Component} - The created vNode.
 */
export const vNode = (tag, props, ...children) => (new Component(tag, props, children));
// Render virtual node
/**
 * Renders a virtual DOM node into a real DOM node.
 * @param {Object|string} vNode - The virtual DOM node to render.
 * @returns {Node} - The rendered DOM node.
 */
export const render = (vNode) => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }
    const node = document.createElement(vNode.tag);
    if (typeof vNode.props === 'object' && vNode.props !== null) {
        for (const [prop, value] of Object.entries(vNode.props)) {
            if (node[prop] !== undefined) {
                node[prop] = value;
            } else {
                node.setAttribute(prop, value);
            }
        }
    }
    for (const child of vNode.children || []) {
        node.appendChild(render(child));
    }
    return node;
};
// Compare new virtual node with old virtual node
/**
 * Calculates the difference between two virtual DOM nodes.
 * @param {Object} v1 - The first virtual DOM node.
 * @param {Object} v2 - The second virtual DOM node.
 * @returns {Array} - An array of patches representing the differences between the two virtual DOM nodes.
 */
export const diff = (v1, v2) => {
    const patches = [];

    if (typeof v1 === 'string' || typeof v2 === 'string') {
        if (v1 !== v2) {
            patches.push({ tag: 'TEXT', value: v2 });
        }
    } else if (v1.tag !== v2.tag) {
        patches.push({ tag: 'REPLACE', value: v2 });
    } else if (v1.tag === v2.tag) {
        if (JSON.stringify(v1.props) !== JSON.stringify(v2.props)) {
            patches.push({ tag: 'PROPS', value: v2.props });
        }
        if (JSON.stringify(v1.children) !== JSON.stringify(v2.children)) {
            patches.push({ tag: 'CHILDREN', value: v2.children });
        }
    }
    return patches;
};
// Apply patches to the real DOM
/**
 * Applies a set of patches to a DOM node.
 * @param {Node} node - The DOM node to apply the patches to.
 * @param {Array} patches - An array of patches to apply.
 * @returns {Promise<void>} - A promise that resolves when all patches have been applied.
 */
export const patch = async (node, patches) => {
    for (const patch of patches) {
        switch (patch.tag) {
            case 'REMOVE':
                node.remove();
                break;
            case 'TEXT':
                node.textContent = patch.value;
                break;
            case 'REPLACE':
                node.parentNode.replaceChild(render(patch.value), node);
                break;
            case 'PROPS':
                for (const [prop, value] of Object.entries(patch.value)) {
                    node[prop] = value;
                }
                break;
            case 'CHILDREN':
                node.textContent = '';
                patch.value.map((child) => {
                    node.appendChild(render(child));
                })
                break;
        }
    }
};
/**
 * Retrieves the values of a form and returns them as an object.
 * @param {HTMLFormElement} form - The form element to retrieve values from.
 * @returns {Object} - An object containing the form values.
 */
export const getFormValues = (form) => {
    const values = new FormData(form)
    const data = Object.fromEntries(values.entries())
    return data
}
