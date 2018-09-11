# magichome-led-controller-node
This is a node-red node to control RGB Led Controllers by MagicHome (and maybe other brands working based on the tuya cloud)
which can be bought from different sources on the Internet.

This node is working on the <b>local network</b>, Internet is only needed to link the Led Controller and obtain the id and key.

## Usage
To use this node, you have to obtain the device ID and the localkey of your LED controller by following
<a href="https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md"><b> this instruction </b></a>.

### Inputs
The node accepts a 3 byte string containing the hex values of the red, green and blue color (0-255-> 00-FF)
<br/>or a boolean value to switch the light on and off.
To provide these inputs, the color-picker and the button of the node-red dashboard could be used.




This is my first try on developing a node-red node, so any suggestions are welcome.






[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
