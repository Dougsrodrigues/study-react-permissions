import { buildAbility } from "./guards/ability";
import { GuardContext } from "./guards/GuardContext";
import { getAbilitiesByUser } from "./guards/userAbilities";
import { Home } from "./pages/Home";

function App() {
  const userAbilities = getAbilitiesByUser("user");
  const ability = buildAbility(userAbilities);

  return (
    <GuardContext.Provider value={ability}>
      <div className="App">
        <Home />
      </div>
    </GuardContext.Provider>
  );
}

export default App;
