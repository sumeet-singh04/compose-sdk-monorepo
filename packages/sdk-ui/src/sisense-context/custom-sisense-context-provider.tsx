import { PropsWithChildren, type FunctionComponent } from 'react';
import { ThemeProvider } from '../theme-provider';
import { ErrorBoundary } from '../error-boundary/error-boundary';
import { SisenseContext, SisenseContextPayload } from './sisense-context';

/** @internal */
export type CustomSisenseContext = SisenseContextPayload & {
  showRuntimeErrors: boolean;
};

/** @internal */
export type CustomSisenseContextProviderProps = {
  context?: CustomSisenseContext;
  error?: Error;
};

/**
 * Custom Sisense Context Provider component that allows passing external context.
 *
 * Note: it specifically designed to serve as a bridge for passing context between an external wrapper and child React components.
 *
 * @internal
 */
export const CustomSisenseContextProvider: FunctionComponent<
  PropsWithChildren<CustomSisenseContextProviderProps>
> = ({ context, error, children }) => {
  return (
    <ErrorBoundary showErrorBox={context?.showRuntimeErrors} error={error}>
      {context && (
        <SisenseContext.Provider value={context}>
          <ThemeProvider skipTracking theme={context.app?.settings.serverThemeSettings}>
            {children}
          </ThemeProvider>
        </SisenseContext.Provider>
      )}
    </ErrorBoundary>
  );
};