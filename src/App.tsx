import './styles/home.css';
import SearchInput from "./components/SearchInput.tsx";
import {SearchProvider} from "./contexts/SearchContext.tsx";
import UsersList from "./components/UsersList.tsx";

function App() {


  return (
    <SearchProvider>
      <div id={"app"}>
        <div className={"header"}>
          <h1>Github Search</h1>
        </div>
        <SearchInput />
        <UsersList/>
      </div>
    </SearchProvider>
  )
}

export default App
