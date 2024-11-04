/**
 * Handles communication with the LLM and mapping function calls to editor actions.
 *
 * @param {EventBus} eventBus
 * @param {Modeling} modeling
 * @param {ElementFactory} elementFactory
 * @param {ElementRegistry} elementRegistry
 * @param {Canvas} canvas
 */
export default function LLMIntegration(eventBus, modeling, elementFactory, elementRegistry, canvas) {
  this._eventBus = eventBus;
  this._modeling = modeling;
  this._elementFactory = elementFactory;
  this._elementRegistry = elementRegistry;
  this._canvas = canvas;
}

LLMIntegration.$inject = [ 'eventBus', 'modeling', 'elementFactory', 'elementRegistry', 'canvas' ];

LLMIntegration.prototype.processCommand = function(command) {
  var self = this;

  // For simplicity, let's simulate the LLM response with a hardcoded mapping.

  // In a real implementation, you would send the command to the LLM and get the function calls.

  // For now, let's parse the command and map it to actions.

  // Simulate LLM function call mapping
  var functionCalls = this._parseCommand(command);

  // Execute the mapped functions
  functionCalls.forEach(function(funcCall) {
    self._executeFunctionCall(funcCall);
  });
};

LLMIntegration.prototype._parseCommand = function(command) {
  // A simple parser to map commands to function calls
  var functionCalls = [];

  command = command.toLowerCase();

  if (command.includes('add') || command.includes('create')) {
    if (command.includes('start event')) {
      functionCalls.push({ name: 'createStartEvent' });
    } else if (command.includes('user task')) {
      functionCalls.push({ name: 'createUserTask' });
    } else if (command.includes('end event')) {
      functionCalls.push({ name: 'createEndEvent' });
    }
  }

  if (command.includes('connect')) {
    var elements = command.match(/connect (.+) to (.+)/);
    if (elements && elements.length === 3) {
      functionCalls.push({ name: 'connectElements', params: [ elements[1].trim(), elements[2].trim() ] });
    }
  }

  if (command.includes('remove') || command.includes('delete')) {
    var elementName = command.match(/remove (.+)|delete (.+)/);
    if (elementName) {
      var name = elementName[1] || elementName[2];
      functionCalls.push({ name: 'removeElement', params: [ name.trim() ] });
    }
  }

  return functionCalls;
};

LLMIntegration.prototype._executeFunctionCall = function(funcCall) {
  var modeling = this._modeling;
  var elementFactory = this._elementFactory;
  var elementRegistry = this._elementRegistry;

  switch (funcCall.name) {
  case 'createStartEvent':
    this._createElement('bpmn:StartEvent');
    break;
  case 'createUserTask':
    this._createElement('bpmn:UserTask');
    break;
  case 'createEndEvent':
    this._createElement('bpmn:EndEvent');
    break;
  case 'connectElements':
    this._connectElements(funcCall.params[0], funcCall.params[1]);
    break;
  case 'removeElement':
    this._removeElement(funcCall.params[0]);
    break;
  default:
    console.warn('Unknown function call:', funcCall);
  }
};

LLMIntegration.prototype._createElement = function(type) {
  var elementFactory = this._elementFactory;
  var modeling = this._modeling;
  var canvas = this._canvas;

  var shape = elementFactory.createShape({ type: type });

  var rootElement = canvas.getRootElement();

  // For simplicity, we will position the new element at a default location
  modeling.createShape(shape, { x: 200, y: 200 }, rootElement);
};

LLMIntegration.prototype._connectElements = function(sourceName, targetName) {
  var modeling = this._modeling;
  var elementRegistry = this._elementRegistry;

  var source = elementRegistry.get(sourceName);
  var target = elementRegistry.get(targetName);

  if (source && target) {
    modeling.connect(source, target);
  } else {
    console.warn('Cannot find elements to connect:', sourceName, targetName);
  }
};

LLMIntegration.prototype._removeElement = function(name) {
  var modeling = this._modeling;
  var elementRegistry = this._elementRegistry;

  var element = elementRegistry.get(name);

  if (element) {
    modeling.removeElements([ element ]);
  } else {
    console.warn('Cannot find element to remove:', name);
  }
};
