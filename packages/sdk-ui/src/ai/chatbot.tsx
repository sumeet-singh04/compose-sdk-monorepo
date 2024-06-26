import { CSSProperties } from 'react';
import { asSisenseComponent } from '../decorators/component-decorators/as-sisense-component';
import { ChatConfig, ChatConfigProvider } from './chat-config';
import ChatFrame from './chat-frame';
import ChatRouter from './chat-router';
import { ChatStyle, ChatStyleProvider } from './chat-style-provider';

/**
 * Props for {@link Chatbot} component.
 */
export type ChatbotProps = {
  /**
   * Total width of the chatbot
   *
   * If not specified, a default width of `500px` will be used.
   */
  width?: CSSProperties['width'];

  /**
   * Total height of the chatbot
   *
   * If not specified, a default height of `900px` will be used.
   */
  height?: CSSProperties['height'];

  /**
   * Style settings for the chatbot
   *
   * @internal
   */
  style?: ChatStyle;

  /**
   * Various configuration options for the chatbot
   */
  config?: Partial<ChatConfig>;
};

/**
 * React component that renders a chatbot with data topic selection. You can optionally provide `width` and/or `height`.
 *
 * ::: warning Note
 * This component is currently under private beta for selected customers and is subject to change as we make fixes and improvements.
 * :::
 *
 * @example
 * ```tsx
 * import { SisenseContextProvider } from '@sisense/sdk-ui';
 * import { AiContextProvider, Chatbot } from '@sisense/sdk-ui/ai';
 *
 * function App() {
 *   return (
 *     <SisenseContextProvider {...sisenseContextProps}>
 *       <AiContextProvider>
 *         <Chatbot width={1000} height={800} />
 *       </AiContextProvider>
 *     </SisenseContextProvider>
 *   );
 * }
 * ```
 * @param props - {@link ChatbotProps}
 * @group Generative AI
 * @beta
 */
export const Chatbot = asSisenseComponent({
  componentName: 'Chatbot',
})((props: ChatbotProps) => {
  const { width, height, config, style } = props;

  return (
    <ChatStyleProvider value={style ?? {}}>
      <ChatConfigProvider value={config ?? {}}>
        <ChatFrame width={width} height={height}>
          <ChatRouter />
        </ChatFrame>
      </ChatConfigProvider>
    </ChatStyleProvider>
  );
});
