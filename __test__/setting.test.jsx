import React from 'react';
import renderer from 'react-test-renderer';
import SettingsForm from '../pages/settings';


describe("Setting", () => {
    it("Should render chart", () => {
        const component = renderer.create(<SettingsForm />);
        expect(component).toMatchSnapshot();
    })
}); 