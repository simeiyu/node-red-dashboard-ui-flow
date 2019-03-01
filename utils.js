module.exports = {
    /** 
	 * Generate our dashboard HTML code
	 * @param {object} config - The node's config instance
	 * @param {object} ledStyle - Style attribute of our LED span in in-line CSS format
	 */
    HTML: function(config) {
        return String.raw`
            <ul class='flow' id="flow_{{$id}}" style="background-color: ` + config.bgcolor + `; border-color: ` + config.borderColor + `">
                <li ng-repeat="item in msg.items" id="flow_{{item.id}}" data-status="{{item.status}}"><span class='flow-status' ng-style="{'borderColor': item.color}"></span><span class='flow-status-after' ng-style="{'backgroundColor': item.color}"></span><span style="color: ` + config.color + `">{{item.name}}</span></li>
            </ul>
            
            <style>
                .flow {
                    list-style: none;
                    margin: 10px 0;
                    padding: 8px 20px;
                    border-radius: 5px;
                    border: 1px solid #d9d9d9;
                    background-color: #fafafa;
                    color: #555;
                }
                .flow li {
                    padding: 8px 0 8px 32px;
                    position: relative;
                }
                .flow-status {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    z-index: 3;
                    margin-top: -6px;
                    display: block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    border: 3px solid #eee;
                }
                .flow-status-after {
                    position: absolute;
                    z-index: 1;
                    width: 2px;
                    height: 28px;
                    left: 5px;
                    bottom: 24px;
                    background-color: #eee;
                }
                .flow li:first-child .flow-status-after {
                    display: none;
                }
            </style>`;
	},
	
	/** 
	 * Check for that we have a config instance and that our config instance has a group selected, otherwise report an error
	 * @param {object} config - The config instance
	 * @param {object} node - The node to report the error on
	 * @returns {boolean} `false` if we encounter an error, otherwise `true`
	 */
	checkConfig: function(config, node) {
        if (!config) {
			// TODO: have to think further if it makes sense to separate these out, it isn't clear what the user can do if they encounter this besides use the explicit error to more clearly debug the code
            node.error(RED._("ui_flow.error.no-config"));
            return false;
        }
        if (!config.hasOwnProperty("group")) {
            node.error(RED._("ui_flow.error.no-group"));
            return false;
        }
        return true;
	},

	ledStyle: function(color, glow) {
		if (glow) {
			return `background-color: ` + color;
		} else {
			// TODO: duplicate code because of execution scope, fix this shit :|
			return `background-color: ` + color;
		}
	},

	beforeEmit: function(node, RED) {

		return function(msg, value) {

            const colorForValue =  node.colorForValue;
			var colors = {};
            const getColor = function(status) {
                let _color = 'grey';
                Object.keys(colors).forEach((item) => {
                    if (colors[item] == status) {
                        _color = item
                    }
                })
                return _color
            }

			if (Array.isArray(colorForValue)) {
				for (var index = 0; index < colorForValue.length; index ++) {
					const compareWith = colorForValue[index];
                    if (!colors[`${compareWith.color}`]) {
                        colors[`${compareWith.color}`] = compareWith.value
                    }
				}
            }
            
            const values = value.map(function(item) {
                return {
                    ...item,
                    color: getColor(item.status)
                }
            })
            // console.log('flow - values -->', values)

			return { 
				msg: {
                    items: values,
                    colors: colors
				}
			};
		}
	},

	initController: function($scope) {
        // var update = (msg) => {
        //     if (!msg) {
        //         return;
        //     }
        //     const colors = msg.colors;
        //     const getColor = function(status) {
        //         let _color;
        //         Object.keys(colors).forEach((item) => {
        //             if (colors[item] == status) {
        //                 _color = item
        //             }
        //         })
        //         return _color
        //     }
        //     let color = 'gray'
        //     function ledStyleTemplate(status) {
        //         color = getColor(status);
        //         if (color) {
        //             return `border-color: ` + color;
        //         } else {
        //             // TODO: duplicate code because of execution scope, fix this shit :|
        //             return `border-color: ` + color;
        //         }
        //     }
        //     var ptr = document.getElementById("flow_" + $scope.$eval('$id'));
        //     console.log('flow - ptr -->', ptr)
        //     ptr.childNodes.forEach(function(item) {
        //         console.log('item -->', item, item.nodeType)
        //         if (item.nodeType == 1) {
        //             var status = item.getAttributeNode('data-status').value
        //             console.log('status -->', status)
        //             console.log('status -->', item.childNodes[0])
        //             item.childNodes[0].attr('style', ledStyleTemplate(status))
        //         }
        //         // item.childNodes[0].style = ledStyleTemplate(status)
        //     })

        // };
        // $scope.$watch('msg', update);
    }
};