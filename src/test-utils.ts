import { HarmajaStaticOutput, HarmajaOutput, mount, unmount } from "harmaja";
import * as H from "./index";
import * as L from "lonna";

export function mounted(element: HarmajaOutput) {
    const parent = document.createElement("html");
    const root = document.createElement("div");
    parent.appendChild(root);

    mount(element, root);

    return element as HarmajaStaticOutput;
}

export function renderAsString(output: HarmajaOutput): string {
    return getHtml(mounted(output));
}

export function getHtml(element: HarmajaStaticOutput): string {
    if (element instanceof Array) {
        return element.map(getHtml).join("");
    } else {
        if (element instanceof HTMLElement) {
            return element.outerHTML;
        } else {
            return element.textContent || "";
        }
    }
}
export function wait(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function testRender<T>(
    init: T,
    test: (property: L.Property<T>, set: (v: T) => any) => HarmajaOutput
) {
    const bus = L.bus<T>();
    const testScope = L.createScope();
    testScope.start();
    const property = L.toProperty(init, testScope)(bus);
    const element = test(property, bus.push);
    unmount(element as HarmajaStaticOutput);
    // Verify that all subscribers are removed on unmount
    testScope.end();
    expect((property as any)._dispatcher.hasObservers()).toEqual(false);
}
