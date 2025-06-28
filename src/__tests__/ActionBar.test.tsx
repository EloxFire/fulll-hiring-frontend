import { render, screen } from "@testing-library/react";
import { SearchProvider } from "../contexts/SearchContext";
import ActionBar from "../components/ActionBar";

describe("ActionBar", () => {
  it("disables buttons when nothing is selected", () => {
    render(
      <SearchProvider>
        <ActionBar />
      </SearchProvider>
    );

    expect(screen.getByRole("button", { name: /dupliquer/i })).toBe('disabled');
    expect(screen.getByRole("button", { name: /supprimer/i })).toBe('disabled');
  });

  // Test avancé : avec sélection active (via context mock)
  // tu pourras l'ajouter si besoin pour valider le comportement complet.
});
