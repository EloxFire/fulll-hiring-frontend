import { renderHook, act } from "@testing-library/react";
import {useSearch} from "../hooks/useSearch";

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ items: [{ id: 1, login: "octocat" }] }),
    headers: { get: () => null },
  })
) as jest.Mock;

describe("useSearch", () => {
  it("fetches users on query change", async () => {
    const { result, rerender } = renderHook(({ query }) => useSearch(query), {
      initialProps: { query: "" },
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(false);

    // simulate query change
    await act(async () => {
      rerender({ query: "octocat" });
    });

    expect(result.current.loading).toBe(true);

    // attendre que le debounce et fetch se terminent
    await new Promise((r) => setTimeout(r, 600));

    expect(result.current.loading).toBe(false);
    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].login).toBe("octocat");
  });
});
