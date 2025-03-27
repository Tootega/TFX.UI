"use strict";
class XElement {
    constructor(pOwner, pClass = null) {
        this.Owner = pOwner;
        this.Container = this.CreateContainer();
        this.Element = this.CreateElement(pClass !== null && pClass !== void 0 ? pClass : this.constructor.name);
    }
    CreateContainer() {
        throw new Error("Method not implemented.");
    }
    CreateElement(pClass = null) {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=XElement.js.map