function ledStyle(color, glow) {
	if (glow) {
		return `background-color: ` + color + `; box-shadow: inset #ffffff8c 0px 1px 2px, inset #00000033 0 -1px 1px 1px, inset ` + color + ` 0 -1px 4px, ` + color + ` 0 0px 16px, ` + color + ` 0 0px 16px;`;
	} else {
		return `background-color: ` + color + `; box-shadow: inset #ffffff8c 0px 1px 2px, inset #00000033 0 -1px 1px 1px, inset ` + color + ` 0 -1px 4px;`;
	}
}

module.exports = function(RED) {
	'use strict';
	var utils = require('./utils');

	/**
	 * LED Node construction function
	 * @param {object} config Node configuration object
	 */
    function FlowNode(config) {
        try {
			var ui = undefined; 
			if(ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }

            RED.nodes.createNode(this, config);                       

			var node = this;

			this.colorForValue = config.colorForValue.map(function(colorForValue) {
				return {
					color: colorForValue.color,
					value: RED.util.evaluateNodeProperty(colorForValue.value, colorForValue.valueType, node)
				}
			});

			if (utils.checkConfig(config, node)) {
	            var done = ui.addWidget({                   
	                node: node,    
	                format: utils.HTML(config), 
	                group: config.group,  
	                templateScope: "local",
	                order: config.order,
	                beforeEmit: utils.beforeEmit(node, RED),
	                initController: utils.initController(node.colorForValue)
				});

				node.on("close", done);
			}		
        } catch(error) {
            console.log("While constructing LEDNode widget:", error);		
		}
    }

    RED.nodes.registerType("ui_flow", FlowNode);
}
