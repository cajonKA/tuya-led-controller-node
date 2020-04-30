var color = require('./color/color');
module.exports = function (RED) {

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
        var tuya = new TuyaDevice(tuyacfg);
        console.log("MagicHome Led Node Created");

        // function to try to discover the controllers IP
        function discoverIP() {
            tuya.resolveId()
                .then(status => {
                    console.log("Magichome Led Controller IP discovered as : " + tuya.device.ip);
                    node.status({ fill: "green", shape: "dot", text: "connected" });
                })
                .catch(error => {
                    console.log("Controller not found: " + error);
                    node.status({ fill: "red", shape: "ring", text: "no connection" });
                });
        };

        // IF IP is zero, try to detect it.
        if (tuya.device.ip == "0.0.0.0") {
            delete tuya.device.ip;
            discoverIP();
        }

        function getStatus() {
            tuya.get()
                .then(status => node.status({ fill: "green", shape: "dot", text: "connected" }))
                // if getting status failes, try to newly discover IP
                .catch(error => {
                    node.status({ fill: "red", shape: "ring", text: "no connection" });
                    delete tuya.device.ip;
                    discoverIP()
                });
        }

        getStatus();

        setInterval(function () {
            getStatus()
        }, 60000);


        node.on('close', function () {
            console.log('MagicHome Led Node Closed');
        });

        //handle input from either a node red dashboard color picker
        //or a button 
        node.on('input', function (msg) {
            switch (typeof msg.payload) {
                // button to switch on and off delivers bool
                case "boolean":
                    dps = 1;
                    hexval = msg.payload;
                    break;
                // color picker delivers string to choose color    
                case "string":
                    switch (true) {
                        case (msg.payload == ""):
                            return 0;
                            break;
                        case (msg.payload.length != 6):
                            console.log("Error: Color String has wrong length(6)");
                            return 0;
                            break;
                        default:
                            dps = 5;
                            hexval = color.set(msg.payload);
                    }
                    break;
                default:
                    console.log("Error: Wrong Input Value (must be Bool or String)");
            }
            // If we are about to set a color, set the color mode to white to colour.
            // Some devices have a specific white mode. To accomodate these devices, if we are
            // setting the color to white, then change to white mode, and vice-versa.
            // For the documented modes, checkout the python tuya interface:
            // https://github.com/clach04/python-tuya/blob/master/pytuya/__init__.py#L343
	        if (dps == 5)
            {
                if (msg.payload == "FFFFFF")
                {
                    tuya.set({ dps: 2, set: "white" })
                        .then(status => {
                            this.status({ fill: "green", shape: "dot", text: "connected" });
                        })
                        .catch(error => {
                            console.log(error);
                            this.status({ fill: "red", shape: "ring", text: "no connection" });
                        })
                }
                else
                {
                    tuya.set({ dps: 2, set: "colour" })
                        .then(status => {
                            this.status({ fill: "green", shape: "dot", text: "connected" });
                        })
                        .catch(error => {
                            console.log(error);
                            this.status({ fill: "red", shape: "ring", text: "no connection" });
                        })
                }

            }

            tuya.set({ dps: dps, set: hexval })
                .then(status => {
                    this.status({ fill: "green", shape: "dot", text: "connected" });
                })
                .catch(error => {
                    console.log(error);
                    this.status({ fill: "red", shape: "ring", text: "no connection" });
                })
        });
    }
    RED.nodes.registerType("tuya-led", TuyaLedNode);
};
