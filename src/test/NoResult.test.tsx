import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import NoResult from '../components/NoResult';

describe('NoResult', () => {
    it('should render the NoResult component with the correct text', () => {
        render(<NoResult />);
        const noResultText = screen.getByText(/Aucun résultat trouvé/i);
        expect(noResultText).toBeInTheDocument();
    })
    }
)