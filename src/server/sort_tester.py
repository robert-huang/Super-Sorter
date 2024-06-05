from objects.sorts.merge import MergeSorter
from objects.sorts.sorter import Comparison, ComparisonRequest
from objects.sortable_item import SortableItem

f = open("sort_testing_data.txt", "r")
fileContents = f.read()
f.close()
items = fileContents.split("\n")
list = []
for i in items:
    list.append(SortableItem(i))
print(list)

SORTER = MergeSorter(list, "", "", 123)

def fakeCompare(comparisonRequest: ComparisonRequest) -> Comparison:
    choice = comparisonRequest.itemA if int(comparisonRequest.itemA.getIdentifier()) > int(comparisonRequest.itemB.getIdentifier()) else comparisonRequest.itemB
    return Comparison(comparisonRequest.itemA, comparisonRequest.itemB, choice)

fakeChoice = None
turn = 1

print(f"Estimated total comparisons: {SORTER.getTotalEstimate()}")

while(True):
    print(f"[{turn}]")
    turn += 1
    output = SORTER.doSort(fakeChoice)
    if (output == None):
        print("------------")
        print(SORTER.getList())
        print(output)
        break
    else:
        fakeChoice = fakeCompare(output)
        # print(fakeChoice.itemA, fakeChoice.itemB, fakeChoice.choice)
        # print("---")