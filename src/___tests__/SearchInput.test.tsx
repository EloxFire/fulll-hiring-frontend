import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {SearchProvider} from "../contexts/SearchContext";
import SearchInput from "../components/SearchInput";

describe('SearchInput', () => {
  it('renders input and updates value on typing', () => {
    render(
      <SearchProvider>
        <SearchInput />
      </SearchProvider>
    );

    const input = screen.getByPlaceholderText(/rechercher un utilisateur/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'octocat' } });
    expect(input).toHaveValue('octocat');
  });
});
