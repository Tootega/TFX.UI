"use strict";
class XArray extends Array {
    constructor(pArg) {
        super();
        if (pArg != null) {
            if (pArg.length > 0) {
                for (var i = 0; i < pArg.length; i++)
                    this[i] = pArg[i];
            }
            else {
                if (pArg > 0) {
                    this.length = pArg;
                    for (var i = 0; i < this.length; i++)
                        this[i] = null;
                }
            }
        }
    }
}
class XLauncher {
    static Run() {
        this.Body = new XDiv(null, "MainDiv");
        let x = new XBaseInput(this.Body);
        new XBaseButtonInput(this.Body);
    }
}
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
class XBaseButtonInput extends XBaseInput {
    constructor(pOwner, pClass = null) {
        super(pOwner, pClass);
    }
}
/// <reference path="Elements/Base/XElement.ts" />
/// <reference path="Elements/Base/XBaseInput.ts" />
/// <reference path="Elements/Base/XDiv.ts" />
/// <reference path="Elements/Base/XBaseButtonInput.ts" />
/// <reference path="XDefault.ts" />
/// <reference path="XLauncher.ts" />
class XUtils {
    static X() {
        var elm = document.createElement("div");
        document.body.appendChild(elm);
    }
    static AddElement(pOwner, pType, pClass, pInsert = false) {
        var own;
        if (pOwner == null)
            own = document.body;
        else if (pOwner instanceof HTMLElement)
            own = pOwner;
        else
            own = pOwner.Element;
        var elm = document.createElement(pType);
        if (pClass != null)
            elm.className = pClass;
        if (pInsert && own.childNodes.length > 0)
            own.insertBefore(elm, elm.childNodes[0]);
        else
            own.appendChild(elm);
        if (pOwner == null)
            elm.Owner = pOwner;
        else if (pOwner instanceof XElement)
            elm.Owner = pOwner;
        return elm;
    }
}
//# sourceMappingURL=TFX.Core.js.map