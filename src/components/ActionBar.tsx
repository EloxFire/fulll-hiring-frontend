import '../styles/components/actionBar.css';
import { useSearchContext } from "../contexts/SearchContext";

const ActionBar = () => {
  const {
    selectedUserIds,
    selectAllUsers,
    clearSelection,
    duplicateSelectedUsers,
    deleteSelectedUsers
  } = useSearchContext();

  const selectedCount = selectedUserIds.size;

  return (
    <div className={"action-bar"}>
      <div className={"row"}>
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) selectAllUsers();
            else clearSelection();
          }}
          checked={selectedCount > 0}
        />
        <span>{selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}</span>
      </div>

      <div className={"row"}>
        <button
          className="action-button"
          onClick={duplicateSelectedUsers}
          disabled={selectedCount === 0}
        >
          <img src={'/copy.png'} alt={"Copy icon"}/>
        </button>
        <button
          className="action-button"
          onClick={deleteSelectedUsers}
          disabled={selectedCount === 0}
        >
          <img src={'/trash.png'} alt={"Trash icon"}/>
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
