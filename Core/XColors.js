"use strict";
class XColors {
    static get HighHue() {
        if (XColors._HighHue == null) {
            var hsl = XColors.Colors.Select(c => this.Convert(c)).Where(c => c.H > 0.3 && c.L < 0.7);
            XColors._HighHue = hsl.Select(c => c.RGB);
        }
        return XColors._HighHue;
    }
    static RColor() {
        let r = Math.floor(Math.random() * (this.Colors.length - 1));
        return this.Colors[r];
    }
    static Convert(pColor) {
        var rgb = XHSLColor.StringToRGB(pColor);
        return XHSLColor.RGBToHSL(rgb[0], rgb[1], rgb[2]);
    }
}
XColors.AliceBlue = "#F0F8FF";
XColors.AntiqueWhite = "#FAEBD7";
XColors.Aqua = "#00FFFF";
XColors.Aquamarine = "#7FFFD4";
XColors.Azure = "#F0FFFF";
XColors.Beige = "#F5F5DC";
XColors.Bisque = "#FFE4C4";
XColors.Black = "#000000";
XColors.BlanchedAlmond = "#FFEBCD";
XColors.Blue = "#0000FF";
XColors.BlueViolet = "#8A2BE2";
XColors.Brown = "#A52A2A";
XColors.Burlywood = "#DEB887";
XColors.CadetBlue = "#5F9EA0";
XColors.Chartreuse = "#7FFF00";
XColors.Chocolate = "#D2691E";
XColors.Coral = "#FF7F50";
XColors.CornflowerBlue = "#6495ED";
XColors.Cornsilk = "#FFF8DC";
XColors.Crimson = "#DC143C";
XColors.Cyan = "#00FFFF";
XColors.DarkBlue = "#00008B";
XColors.DarkCyan = "#008B8B";
XColors.DarkGoldenrod = "#B8860B";
XColors.DarkGray = "#A9A9A9";
XColors.DarkGreen = "#006400";
XColors.DarkKhaki = "#BDB76B";
XColors.DarkMagenta = "#8B008B";
XColors.DarkOliveGreen = "#556B2F";
XColors.DarkOrange = "#FF8C00";
XColors.DarkOrchid = "#9932CC";
XColors.DarkRed = "#8B0000";
XColors.DarkSalmon = "#E9967A";
XColors.DarkSeaGreen = "#8FBC8F";
XColors.DarkSlateBlue = "#483D8B";
XColors.DarkSlateGray = "#2F4F4F";
XColors.DarkTurquoise = "#00CED1";
XColors.DarkViolet = "#9400D3";
XColors.DeepPink = "#FF1493";
XColors.DeepSkyBlue = "#00BFFF";
XColors.DimGray = "#696969";
XColors.DodgerBlue = "#1E90FF";
XColors.Firebrick = "#B22222";
XColors.FloralWhite = "#FFFAF0";
XColors.ForestGreen = "#228B22";
XColors.Fuchsia = "#FF00FF";
XColors.Gainsboro = "#DCDCDC";
XColors.GhostWhite = "#F8F8FF";
XColors.Gold = "#FFD700";
XColors.Goldenrod = "#DAA520";
XColors.Gray = "#BEBEBE";
XColors.WebGray = "#808080";
XColors.Green = "#00FF00";
XColors.WebGreen = "#008000";
XColors.GreenYellow = "#ADFF2F";
XColors.Honeydew = "#F0FFF0";
XColors.HotPink = "#FF69B4";
XColors.IndianRed = "#CD5C5C";
XColors.Indigo = "#4B0082";
XColors.Ivory = "#FFFFF0";
XColors.Khaki = "#F0E68C";
XColors.Lavender = "#E6E6FA";
XColors.LavenderBlush = "#FFF0F5";
XColors.LawnGreen = "#7CFC00";
XColors.LemonChiffon = "#FFFACD";
XColors.LightBlue = "#ADD8E6";
XColors.LightCoral = "#F08080";
XColors.LightCyan = "#E0FFFF";
XColors.LightGoldenrod = "#FAFAD2";
XColors.LightGray = "#D3D3D3";
XColors.LightGreen = "#90EE90";
XColors.LightPink = "#FFB6C1";
XColors.LightSalmon = "#FFA07A";
XColors.LightSeaGreen = "#20B2AA";
XColors.LightSkyBlue = "#87CEFA";
XColors.LightSlateGray = "#778899";
XColors.LightSteelBlue = "#B0C4DE";
XColors.LightYellow = "#FFFFE0";
XColors.Lime = "#00FF00";
XColors.LimeGreen = "#32CD32";
XColors.Linen = "#FAF0E6";
XColors.Magenta = "#FF00FF";
XColors.Maroon = "#B03060";
XColors.WebMaroon = "#800000";
XColors.MediumAquamarine = "#66CDAA";
XColors.MediumBlue = "#0000CD";
XColors.MediumOrchid = "#BA55D3";
XColors.MediumPurple = "#9370DB";
XColors.MediumSeaGreen = "#3CB371";
XColors.MediumSlateBlue = "#7B68EE";
XColors.MediumSpringGreen = "#00FA9A";
XColors.MediumTurquoise = "#48D1CC";
XColors.MediumVioletRed = "#C71585";
XColors.MidnightBlue = "#191970";
XColors.MintCream = "#F5FFFA";
XColors.MistyRose = "#FFE4E1";
XColors.Moccasin = "#FFE4B5";
XColors.NavajoWhite = "#FFDEAD";
XColors.NavyBlue = "#000080";
XColors.OldLace = "#FDF5E6";
XColors.Olive = "#808000";
XColors.OliveDrab = "#6B8E23";
XColors.Orange = "#FFA500";
XColors.OrangeRed = "#FF4500";
XColors.Orchid = "#DA70D6";
XColors.PaleGoldenrod = "#EEE8AA";
XColors.PaleGreen = "#98FB98";
XColors.PaleTurquoise = "#AFEEEE";
XColors.PaleVioletRed = "#DB7093";
XColors.PapayaWhip = "#FFEFD5";
XColors.PeachPuff = "#FFDAB9";
XColors.Peru = "#CD853F";
XColors.Pink = "#FFC0CB";
XColors.Plum = "#DDA0DD";
XColors.PowderBlue = "#B0E0E6";
XColors.Purple = "#A020F0";
XColors.WebPurple = "#800080";
XColors.RebeccaPurple = "#663399";
XColors.Red = "#FF0000";
XColors.RosyBrown = "#BC8F8F";
XColors.RoyalBlue = "#4169E1";
XColors.SaddleBrown = "#8B4513";
XColors.Salmon = "#FA8072";
XColors.SandyBrown = "#F4A460";
XColors.SeaGreen = "#2E8B57";
XColors.Seashell = "#FFF5EE";
XColors.Sienna = "#A0522D";
XColors.Silver = "#C0C0C0";
XColors.SkyBlue = "#87CEEB";
XColors.SlateBlue = "#6A5ACD";
XColors.SlateGray = "#708090";
XColors.Snow = "#FFFAFA";
XColors.SpringGreen = "#00FF7F";
XColors.SteelBlue = "#4682B4";
XColors.Tan = "#D2B48C";
XColors.Teal = "#008080";
XColors.Thistle = "#D8BFD8";
XColors.Tomato = "#FF6347";
XColors.Turquoise = "#40E0D0";
XColors.Violet = "#EE82EE";
XColors.Wheat = "#F5DEB3";
XColors.White = "#FFFFFF";
XColors.WhiteSmoke = "#F5F5F5";
XColors.Yellow = "#FFFF00";
XColors.YellowGreen = "#9ACD32";
XColors.Colors = ["#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E",
    "#FF7F50", "#6495ED", "#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B", "#B8860B", "#A9A9A9", "#006400", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00", "#9932CC", "#8B0000",
    "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1", "#9400D3", "#FF1493", "#00BFFF", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22", "#FF00FF", "#DCDCDC", "#F8F8FF",
    "#FFD700", "#DAA520", "#BEBEBE", "#808080", "#00FF00", "#008000", "#ADFF2F", "#F0FFF0", "#FF69B4", "#CD5C5C", "#4B0082", "#FFFFF0", "#F0E68C", "#E6E6FA", "#FFF0F5", "#7CFC00",
    "#FFFACD", "#ADD8E6", "#F08080", "#E0FFFF", "#FAFAD2", "#D3D3D3", "#90EE90", "#FFB6C1", "#FFA07A", "#20B2AA", "#87CEFA", "#778899", "#B0C4DE", "#FFFFE0", "#00FF00", "#32CD32",
    "#FAF0E6", "#FF00FF", "#B03060", "#800000", "#66CDAA", "#0000CD", "#BA55D3", "#9370DB", "#3CB371", "#7B68EE", "#00FA9A", "#48D1CC", "#C71585", "#191970", "#F5FFFA", "#FFE4E1",
    "#FFE4B5", "#FFDEAD", "#000080", "#FDF5E6", "#808000", "#6B8E23", "#FFA500", "#FF4500", "#DA70D6", "#EEE8AA", "#98FB98", "#AFEEEE", "#DB7093", "#FFEFD5", "#FFDAB9", "#CD853F",
    "#FFC0CB", "#DDA0DD", "#B0E0E6", "#A020F0", "#800080", "#663399", "#FF0000", "#BC8F8F", "#4169E1", "#8B4513", "#FA8072", "#F4A460", "#2E8B57", "#FFF5EE", "#A0522D", "#C0C0C0",
    "#87CEEB", "#6A5ACD", "#708090", "#FFFAFA", "#00FF7F", "#4682B4", "#D2B48C", "#008080", "#D8BFD8", "#FF6347", "#40E0D0", "#EE82EE", "#F5DEB3", "#FFFFFF", "#F5F5F5", "#FFFF00",
    "#9ACD32", "#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F0FFFF", "#F5F5DC", "#FFE4C4", "#000000", "#FFEBCD"];
XColors._HighHue = null;
//# sourceMappingURL=XColors.js.map