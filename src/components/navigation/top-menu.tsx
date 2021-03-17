import { Row } from '@geist-ui/react';
import { RowProps } from '@geist-ui/react/dist/row/row';
import React from 'react';

export interface TopMenuProps extends Partial<RowProps> {
  activeItem?: string;
}

export const TopMenu: React.FC<TopMenuProps> = ({ children, ...props }) => (
  <Row {...props} justify="end">
    {children}
  </Row>
);
