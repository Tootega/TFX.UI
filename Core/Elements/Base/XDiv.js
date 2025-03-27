"use strict";
class XDiv extends XElement {
    constructor(pOwner, pClass) {
        super(pOwner, pClass);
        if (pClass != null && this.Container != null)
            this.Container.className = pClass;
    }
    CreateContainer() {
        return XUtils.AddElement(null, "div", null);
    }
    CreateElement(pClass = null) {
        return this.Container;
    }
}
//# sourceMappingURL=XDiv.js.map