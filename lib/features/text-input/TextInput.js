import { domify } from 'min-dom';

/**
 * Adds a text input field to the BPMN editor UI to accept natural language commands.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 * @param {LLMIntegration} llmIntegration
 */
export default function TextInput(eventBus, canvas, llmIntegration) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._llmIntegration = llmIntegration;

  this._init();
}

TextInput.$inject = [ 'eventBus', 'canvas', 'llmIntegration' ];

TextInput.prototype._init = function() {
  var parent = this._canvas.getContainer();

  var container = domify('<div class="bjs-text-input-container" style="position:absolute; bottom:10px; right:10px; z-index: 100; display: flex; flex-direction: column; align-items: flex-end;"></div>');
  var textarea = domify('<textarea placeholder="Enter command..." style="width:300px; height:100px; padding:5px; margin-bottom:5px;"></textarea>');
  var button = domify('<button style="width:300px; padding:5px;">Execute</button>');

  container.appendChild(textarea);
  container.appendChild(button);

  parent.appendChild(container);

  var self = this;

  button.addEventListener('click', function() {
    var command = textarea.value;
    textarea.value = '';

    if (command.trim() === '') {
      return;
    }

    // Send command to LLM
    self._llmIntegration.processCommand(command);
  });
};
