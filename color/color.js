// set : takes a string in the form rrggbb and converts it
//       to a hexvalue needed for dps 5 of the Tuya Led controller
//       The form of the string must be RRGGBB0HHHSSVV
exports.set = function(rgbString) {
    //split the string into pieces of 2 and put them in the rgb array
    rgb = rgbString.match(/.{1,2}/g);
    //convert the rgb value to a hsv value
    hsv = rgb2hsv(parseInt(rgb[0], 16), parseInt(rgb[1], 16), parseInt(rgb[2], 16));
    hexvalue = "";
    //start to create the hex string by putting the rgb values in
    for (var val in rgb) {
        hexvalue += ("00" + rgb[val]).slice(-2);
    }
    hsv_array = [parseInt(hsv[0] * 360), parseInt(hsv[1] * 255), parseInt(hsv[2] * 255)];
    hexvalue_hsv = "";
    //construct a array of the hex values of h, s and v
    for (val in hsv_array) {
        num = val > 0 ? 2 : 3;
        str = val > 0 ? "00" : "000";
        hexvalue_hsv += (str + hsv_array[val].toString(16)).slice(-num);
    }
    //concat the hsv array with a leading zero to the rgb hex array and make sure all is lower case
    hexvalue = (hexvalue + ("00000000" + hexvalue_hsv).slice(-8)).toLowerCase();
    return hexvalue;
};

// convert rgb to hsv values according to rapidtables.com/convert/color/rgb-to-hsv.html
function rgb2hsv(r, g, b) {
    // normalize r,g,b to range 0..1
    r /= 255, g /= 255, b /= 255;
    //calculate min and max of r,b,g
    var Cmin = Math.min(r, g, b),
        Cmax = Math.max(r, g, b);
    //initialize h and s and set v = maximum Value if r,g,b
    var h, s = 0,
        v = Cmax;
    //calculate diff of Cmax and Cmin
    var d = Cmax - Cmin;
    //set h according based on values of Cmax and diff
    if (d === 0) {
        h = 0;
    } else {
        switch (Cmax) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    //set s based on value of Cmax
    s = Cmax === 0 ? 0 : d / Cmax;
    return [h, s, v];
}
