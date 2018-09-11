var color = require('./color/color');
module.exports = function(RED) {

    function MagicHomeLedNode(config) {
        RED.nodes.createNode(this, config);

        //get config from node
        this.deviceid = config.deviceid;
        this.key = config.key;
        this.ip = config.ip;
        //and apply config to object
        var tuyacfg = {
            id: this.deviceid,
            key: this.key,
            ip: this.ip
        };
        var node = this;

        //link tuya api
        const TuyaDevice = require('tuyapi');
        //and create new device
        tuya = new TuyaDevice(tuyacfg);
        console.log("MagicHome Led Node Created");

        node.on('close', function() {
            console.log('MagicHome Led Node Closed');
        });

        //handle input from either a node red dashboard color picker
        //or a button 
        node.on('input', function(msg) {
            switch (typeof msg.payload) {
                // button to switch on and off delivers bool
                case "boolean":
                    dps = 1;
                    hexval = msg.payload;
                    break;
                    // color picker delivers string to choose color    
                case "string":
                    if (msg.payload.length != 6) {
                        console.log("Error: Color String has wrong length(6)");
                        break;
                    }
                    dps = 5;
                    hexval = color.set(msg.payload);
                    break;
                default:
                    console.log("Error: Wrong Input Value (must be Bool or String)");
            }
            tuya.set({ dps: dps, set: hexval })
                .then(status => {})
                .catch(error => {
                    console.log(error);
                });
        });
    }
    RED.nodes.registerType("magichome-led-node", MagicHomeLedNode);
};