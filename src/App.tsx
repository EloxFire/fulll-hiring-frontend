import './styles/home.css';
import UserCard from "./components/UserCard.tsx";
import SearchInput from "./components/SearchInput.tsx";
import {SearchProvider} from "./contexts/SearchContext.tsx";

function App() {


  return (
    <SearchProvider>
      <div id={"app"}>
        <div className={"header"}>
          <h1>Github Search</h1>
        </div>

        <SearchInput />

        <UserCard user={{
          id: 1,
          login: "octocat",
          avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
          html_url: "https://github.com/octocat"
        }}/>
      </div>
    </SearchProvider>
  )
}

export default App
