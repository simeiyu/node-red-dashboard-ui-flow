module.exports = {
    /** 
	 * Generate our dashboard HTML code
	 * @param {object} config - The node's config instance
	 * @param {object} ledStyle - Style attribute of our LED span in in-line CSS format
	 */
    HTML: function(config) {
        return String.raw`
            <ul class='flow'>
                <li ng-repeat="item in msg.items"><span class='flow-status' ng-style="getStatusStyle(item.value)"></span><span>{{item.name}}</span></li>
            </ul>
            
            <style>
                .flow {
                    list-style: none;
                    margin: 10px 0;
                    padding: 8px 16px;
                    border-radius: 5px;
                    border: 1px solid #d9d9d9;
                    background-color: #fafafa;
                    color: #555;
                }
                .flow li {
                    padding: 8px 0 8px 40px;
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
                .active .flow-status {
                    border-color: blue;
                }
                .flow > li::before {
                    content: '';
                    position: absolute;
                    z-index: 1;
                    width: 2px;
                    height: 28px;
                    left: 5px;
                    bottom: 24px;
                    background-color: #eee;
                }
                .flow > li.active::before {
                    background-color: blue;
                }
                .flow > li:first-child::before {
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

			var updatedMessage = msg;
			const colorForValue =  node.colorForValue;

			var color, found = false;

			if (Array.isArray(colorForValue)) {
				for (var index = 0; index < colorForValue.length; index ++) {
					const compareWith = colorForValue[index];

					if (RED.util.compareObjects(compareWith.value, value)) {
						color = compareWith.color;
						found = true;
						break
					}
				}
			} 
			if (found === false) {
				color = 'gray';
			}

			return { 
				msg: {
					color: color,
					glow: found
				}
			};
		}
	},

	initController: function(colorForValue) {
        return function($scope) {
            // $scope.flag = true; 
            $scope.getStatusStyle = function(value) {
                for (let i = 0; i < colorForValue.length; i++) {
                    if (colorForValue[i].value == value) {
                        return `background-color: ` + colorForValue[i].color;
                    }
                }
            }      

            // var update = (msg) => {
            //     if (!msg) {
            //         return;
            //     }

            //     function ledStyleTemplate(color, glow) {
            //         if (glow) {
            //             return `background-color: ` + color + `; box-shadow: inset #ffffff8c 0px 1px 2px, inset #00000033 0 -1px 1px 1px, inset ` + color + ` 0 -1px 4px, ` + color + ` 0 0px 16px, ` + color + ` 0 0px 16px;`;
            //         } else {
            //             // TODO: duplicate code because of execution scope, fix this shit :|
            //             return `background-color: ` + color + `; box-shadow: inset #ffffff8c 0px 1px 2px, inset #00000033 0 -1px 1px 1px, inset ` + color + ` 0 -1px 4px;`;
            //         }
            //     }

            //     var ptr = document.getElementById("led_" + $scope.$eval('$id'));
                
            //     const color = msg.color;
            //     const glow = msg.glow;

            //     $(ptr).attr('style', ledStyleTemplate(color, glow));
            // };
            // $scope.$watch('msg', update);
        }
    }
};