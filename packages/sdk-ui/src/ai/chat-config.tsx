import { createContext, ReactNode, useContext } from 'react';
import { ChatMode } from '@/ai/api/types';

export interface ChatConfig {
  /**
   * Boolean flag to show or hide suggested questions following a chat response. Currently
   * follow-up questions are still under development and are not validated. Therefore, follow-up
   * questions are disabled by default.
   */
  enableFollowupQuestions: boolean;

  /**
   * Number of recommended queries that should be shown in a chat session
   *
   * If not specified, the default value is `4`
   */
  numOfRecommendations: number;

  /**
   * The default context (data model or perspective) title to use for a chat session
   *
   * If specified, the data topic selector screen will not be shown.
   */
  defaultContextTitle?: string;

  /**
   * The chat mode to use for a chat session.
   *
   * @internal
   */
  chatMode?: ChatMode;

  /** The input prompt text to show in the chat input box */
  inputPromptText: string;

  /**
   * The welcome text to show at the top of a chat session.
   *
   * A value of `false` will hide the welcome text.
   */
  welcomeText?: string | false;
}

export const DEFAULTS = Object.freeze<ChatConfig>({
  enableFollowupQuestions: false,
  numOfRecommendations: 4,
  inputPromptText: 'Ask a question',
});

const ChatConfigContext = createContext<ChatConfig>({
  enableFollowupQuestions: DEFAULTS.enableFollowupQuestions,
  numOfRecommendations: DEFAULTS.numOfRecommendations,
  inputPromptText: DEFAULTS.inputPromptText,
});

export type ChatConfigProviderProps = {
  children: ReactNode;
  value: Partial<ChatConfig>;
};

export const useChatConfig = () => useContext(ChatConfigContext);

export const ChatConfigProvider = ({ children, value }: ChatConfigProviderProps) => {
  const config = Object.entries(value).reduce<ChatConfig>(
    (acc, [key, val]) => {
      if (val) {
        acc[key] = val;
      }

      return acc;
    },
    { ...DEFAULTS },
  );

  return <ChatConfigContext.Provider value={config}>{children}</ChatConfigContext.Provider>;
};
