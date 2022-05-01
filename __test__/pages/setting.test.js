import React from 'react';
import { render, screen } from '../test-utils';
import Settings from '../../pages/settings';

describe('Setting', () => {
    it('Should render SettingsForm', () => {
        const textToFind = 'Добавить Token';
        const component = render(<Settings />);

        const heading = screen.getByText(textToFind);

        expect(heading).toBeInTheDocument();
    });
});
