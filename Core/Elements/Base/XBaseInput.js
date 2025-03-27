"use strict";
class XBaseInput extends XElement {
    constructor(pOwner, pClass = null) {
        super(pOwner, pClass);
        this.Container.className = "InputContainer";
    }
    CreateContainer() {
        return XUtils.AddElement(this.Owner, "div", null);
    }
    CreateElement(pClass = null) {
        return XUtils.AddElement(this.Container, "input", pClass);
    }
}
//# sourceMappingURL=XBaseInput.js.map