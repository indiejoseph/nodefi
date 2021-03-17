import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { createGlobalStyle, ServerStyleSheet } from 'styled-components';

const AppGlobalStyle = createGlobalStyle`
  button, html, input, select, textarea {
    font-family: 'Proxima Nova',Helvetica,Arial,sans-serif;
  }

  body, html {
    margin: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-touch-callout: none;
    min-height: 100%;
    text-size-adjust: 100%;
    -webkit-font-smooth: antialiased;
    -moz-osx-font-smooth: grayscale;
    height: 100%;
    position: relative;
  }
`;

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props =>
            sheets.collectStyles(
              <>
                <AppGlobalStyle />
                <App {...props} />
              </>
            ),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
      };
    } finally {
      sheets.seal();
    }
  }

  public render() {
    return (
      <Html lang="en-US">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
