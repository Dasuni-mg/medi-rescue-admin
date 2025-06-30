import PropTypes from 'prop-types';

// Third party
// import { Providers } from './providers';

// Style
import 'assets/scss/style.scss';

export const metadata = {
  title: 'Medirescue Admin',
  description: 'Medirescue admin application',
  keywords: 'medirescue admin, dhs, mediwave, management, acl, admin',
  author: 'Mediwave Pvt Ltd'
};

/**
 * This component renders the root layout of the application.
 *
 * @param {Object} props Properties passed from the parent component.
 * @param {ReactNode} props.children The children components of the root layout.
 * @returns {ReactElement} The root layout of the application.
 */
export default function RootLayout({ children }) {
  /**
   * PropType definitions for the component.
   */
  RootLayout.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
