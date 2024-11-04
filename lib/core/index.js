import DrawModule from '../draw';
import ImportModule from '../import';
import TextInputModule from '../features/text-input';
import LLMIntegrationModule from '../features/llm-integration';

export default {
  __depends__: [
    TextInputModule,
    LLMIntegrationModule,
    DrawModule,
    ImportModule
  ]
};
