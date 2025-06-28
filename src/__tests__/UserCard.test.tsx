import { render, screen } from "@testing-library/react";
import UserCard from "../components/UserCard";
import {SearchProvider} from "../contexts/SearchContext";

const user = {
  id: 1,
  login: "octocat",
  avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
  html_url: "https://github.com/octocat"
};

describe("UserCard", () => {
  it("displays user info correctly", () => {
    render(
      <SearchProvider>
        <UserCard user={user} />
    </SearchProvider>
  );

    expect(screen.getByText(/octocat/i)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", user.avatar_url);
    expect(screen.getByRole("link", { name: /view profile/i })).toHaveAttribute("href", user.html_url);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
