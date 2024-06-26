import json
import random
from util.logging import GLOBAL_LOGGER as logger
from domain.objects.exceptions.base import ServerError
from domain.objects.sortable_item import SortableItem

class ComparisonRequest:
    itemA: SortableItem
    itemB: SortableItem

    def __init__(self, itemA: SortableItem, itemB: SortableItem) -> None:
        self.itemA = itemA
        self.itemB = itemB
    
    def getRepresentation(self) -> str:
        return f"{self.itemA.getIdentifier()},{self.itemB.getIdentifier()}"
    
    def fromRepresentation(rep: str):
        parts: list[str] = rep.split(",")
        return ComparisonRequest(SortableItem(parts[0]), SortableItem(parts[1]))
    
    def fromRaw(itemA: str, itemB: str):
        comparisonRequest = ComparisonRequest(SortableItem(itemA), SortableItem(itemB))
        return comparisonRequest
    
    def __str__(self) -> str:
        return f"({self.getRepresentation()})"
    
    def __repr__(self) -> str:
        return f"({self.getRepresentation()})"

class Comparison:
    itemA: SortableItem
    itemB: SortableItem
    choice: SortableItem

    def __init__(self, itemA: SortableItem, itemB: SortableItem, choice: SortableItem) -> None:
        self.itemA = itemA
        self.itemB = itemB
        self.choice = choice
        assert type(self.itemA).__name__ == SortableItem.__name__
        assert type(self.itemB).__name__ == SortableItem.__name__
        assert type(self.choice).__name__ == SortableItem.__name__
        assert (not self.itemA.getIdentifier() == self.itemB.getIdentifier())
        assert (self.choice.getIdentifier() == self.itemA.getIdentifier()) or (self.choice.getIdentifier() == self.itemB.getIdentifier())

    def getRepresentation(self) -> str:
        return f"{self.itemA.getIdentifier()},{self.itemB.getIdentifier()},{self.choice.getIdentifier()}"
    
    def fromRepresentation(rep: str):
        parts: list[str] = rep.split(",")
        return Comparison(SortableItem(parts[0]), SortableItem(parts[1]), SortableItem(parts[2]))
    
    def fromRaw(itemA: str, itemB: str, choice: str):
        comparison = Comparison(SortableItem(itemA), SortableItem(itemB), SortableItem(choice))
        return comparison
    
    def __str__(self) -> str:
        return f"({self.getRepresentation()})"
    
    def __repr__(self) -> str:
        return f"({self.getRepresentation()})"

class SortHistory:
    history: list[Comparison]
    deleted: list[Comparison]

    def __init__(self, history: list[Comparison] = [], deleted: list[Comparison] = []) -> None:
        self.history = history
        self.deleted = deleted

    def getList(self) -> list[Comparison]:
        return self.history
    
    def getDeletedList(self) -> list[Comparison]:
        return self.deleted
    
    def findInHistory(self, itemA: SortableItem, itemB: SortableItem) -> int:
        for i, historicalComparison in enumerate(self.history):
            if (
                historicalComparison.itemA.getIdentifier() == itemA.getIdentifier() and
                historicalComparison.itemB.getIdentifier() == itemB.getIdentifier()
            ):
                return i
            elif (
                historicalComparison.itemA.getIdentifier() == itemB.getIdentifier() and
                historicalComparison.itemB.getIdentifier() == itemA.getIdentifier()
            ):
                return i
        return -1
    
    def getHistory(self, itemA: SortableItem, itemB: SortableItem) -> SortableItem | None:
        checkExists = self.findInHistory(itemA, itemB)
        return None if checkExists == -1 else self.history[checkExists].choice

    def addHistory(self, comparison: Comparison):
        checkExists = self.findInHistory(comparison.itemA, comparison.itemB)
        if (checkExists == -1):
            self.history.append(comparison)
        else:
            logger.warn(f"Tried to add {comparison} to history but it already existed.")

    def undoHistory(self, comparison: Comparison):
        checkExists = self.findInHistory(comparison.itemA, comparison.itemB)
        if (checkExists != -1):
            self.history.pop(checkExists)
        else:
            logger.warn(f"Tried to remove {comparison} from history but it did not exist.")

    def historySize(self) -> int:
        return len(self.history)
    
    def deletedSize(self) -> int:
        return len(self.deleted)

    def deleteItem(self, toDelete: str):
        remainders: list[Comparison] = []
        delete: list[Comparison] = []
        for item in self.history:
            if (item.itemA.getIdentifier() == toDelete or item.itemB.getIdentifier() == toDelete):
                delete.append(item)
            else:
                remainders.append(item)
        self.history = remainders
        self.deleted = self.deleted + delete

    def undeleteItem(self, toUndelete: str):
        stayDeleted: list[Comparison] = []
        bringBack: list[Comparison] = []
        for deletedItem in self.deleted:
            if (deletedItem.itemA.getIdentifier() == toUndelete or deletedItem.itemB.getIdentifier() == toUndelete):
                bringBack.append(deletedItem)
            else:
                stayDeleted.append(deletedItem)
        self.deleted = stayDeleted
        self.history = self.history + bringBack

    def getRepresentation(self) -> tuple[list[str], list[str]]:
        historyList: list[str] = []
        for comparison in self.history:
            historyList.append(comparison.getRepresentation())

        deletedList: list[str] = []
        for comparison in self.deleted:
            deletedList.append(comparison.getRepresentation())
        
        return (historyList, deletedList)
    
    # def fromRepresentation(history: str, deleted: str):
    #     historyList: list[Comparison] = []
    #     for comparison in json.loads(history):
    #         historyList.append(Comparison.fromRepresentation(comparison))

    #     deletedList: list[Comparison] = []
    #     for comparison in json.loads(deleted):
    #         deletedList.append(Comparison.fromRepresentation(comparison))
        
    #     return SortHistory(historyList, deletedList)
    
    def __str__(self) -> str:
        return f"<{self.getRepresentation()}>"
    
    def __repr__(self) -> str:
        return f"<{self.getRepresentation()}>"

class DoneForNow(Exception):
    comparisonRequest: ComparisonRequest

    def __init__(self, comparisonRequest: ComparisonRequest, *args: object) -> None:
        super().__init__(*args)
        self.comparisonRequest = comparisonRequest

class Sorter:
    SORT_NAME = "base"
    history: SortHistory
    compareTracker: int = -1
    random: any

    def __init__(self, history: list[Comparison] = [], deleted: list[Comparison] = [], seed: int = 0) -> None:
        self.history = SortHistory(history, deleted)
        self.random = random.Random()
        self.random.seed(seed)

    def doSort(self, itemArray: list[SortableItem], latestChoice: Comparison | None = None) -> ComparisonRequest | list[SortableItem]:
        raise NotImplementedError()
    
    def undo(self, toUndo: Comparison, itemArray: list[SortableItem]) -> ComparisonRequest | list[SortableItem]:
        self.history.undoHistory(toUndo)
        return self.doSort(itemArray)
    
    def restart(self, itemArray: list[SortableItem]) -> ComparisonRequest | list[SortableItem]:
        self.history = SortHistory([], [])
        return self.doSort(itemArray)
    
    def deleteItem(self, itemArray: list[SortableItem], toDelete: str) -> ComparisonRequest | list[SortableItem]:
        self.history.deleteItem(toDelete)
        return self.doSort(itemArray)
    
    def undeleteItem(self, itemArray: list[SortableItem], toUndelete: str) -> ComparisonRequest | list[SortableItem]:
        self.history.undeleteItem(toUndelete)
        return self.doSort(itemArray)

    def compare(self, itemA: SortableItem, itemB: SortableItem) -> bool:
        choice = self.history.getHistory(itemA, itemB)

        if (choice):
            if (choice.getIdentifier() == itemA.getIdentifier()):
                return False
            elif (choice.getIdentifier() == itemB.getIdentifier()):
                return True
            else:
                raise ServerError("Invalid history check.")
        else:
            comparisonRequest = ComparisonRequest(itemA, itemB)
            # logger.debug(f"Comparison not found for {comparisonRequest}")
            raise DoneForNow(comparisonRequest)
        
    def getCurrentProgress(self) -> int:
        return 0

    def getTotalEstimate(self, itemArray: list[SortableItem]) -> int:
        raise NotImplementedError()
